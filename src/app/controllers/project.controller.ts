import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { ProjectService } from "../services/project.service";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, teamId, companyId } = req.body;
    const project = await ProjectService.createProject(
      name,
      description,
      teamId,
      companyId
    );
    res.status(httpStatus.CREATED).json({
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Project created",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const project = await ProjectService.getProjectById(id);
    if (!project)
      return res.status(httpStatus.NOT_FOUND).json({
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Project not found",
      });
    res
      .status(httpStatus.OK)
      .json({ statusCode: httpStatus.OK, success: true, data: project });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await ProjectService.getAllProjects();
    res
      .status(httpStatus.OK)
      .json({ statusCode: httpStatus.OK, success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updated = await ProjectService.updateProject(id, name, description);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Project updated",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await ProjectService.deleteProject(id);
    res.sendStatus(httpStatus.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const ProjectController = { create, getOne, getAll, update, remove };
