import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { SpaceService } from "../services/space.service";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, projectId, userId } = req.body;
    const space = await SpaceService.createSpace(name, projectId);

    res.status(httpStatus.CREATED).json({
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Space created successfully",
      data: space,
    });
  } catch (error) {
    next(error);
  }
};

const getAllByProjectId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId } = req.params;
    const spaces = await SpaceService.getSpacesByProjectId(projectId);

    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      data: spaces,
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const space = await SpaceService.getSpaceById(id);

    if (!space) {
      res.status(httpStatus.NOT_FOUND).json({
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Space not found",
      });
      return;
    }

    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      data: space,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, projectId, userIds } = req.body;
    const updated = await SpaceService.updateSpace(id, {
      name,
      projectId,
      userIds,
    });

    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Space updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await SpaceService.deleteSpace(id);

    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

export const SpaceController = {
  create,
  getAllByProjectId,
  getById,
  update,
  remove,
};
