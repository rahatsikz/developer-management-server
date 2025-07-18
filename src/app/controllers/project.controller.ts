import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { ProjectService } from "../services/project.service";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, userId, companyId } = req.body;
    const project = await ProjectService.createProject(name, companyId, userId);
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
    if (!project) {
      res.status(httpStatus.NOT_FOUND).json({
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Project not found",
      });
      return;
    }
    res
      .status(httpStatus.OK)
      .json({ statusCode: httpStatus.OK, success: true, data: project });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId, userId } = req.query;
    const projects = await ProjectService.getAllProjects({
      companyId: companyId as string,
      userId: userId as string,
    });
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
    const payload = req.body;
    const updated = await ProjectService.updateProject(id, payload);
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
