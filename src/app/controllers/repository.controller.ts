import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { RepositoryService } from "../services/repository.service";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = (req as any).session!.githubToken as string;
    const { name, projectId, description } = req.body;
    const repo = await RepositoryService.createRepository(
      accessToken,
      name,
      projectId,
      description
    );
    res.status(httpStatus.CREATED).json({
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Repository created successfully",
      data: repo,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const repo = await RepositoryService.getRepositoryById(id);
    if (!repo) {
      return res.status(httpStatus.NOT_FOUND).json({
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Repository not found",
      });
    }
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      data: repo,
    });
  } catch (error) {
    next(error);
  }
};

export const RepositoryController = { create, getOne };
