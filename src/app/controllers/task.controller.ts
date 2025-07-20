import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { TaskService } from "../services/task.service";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title,
      spaceId,
      assigneeIds,
      priority,
      dueDate,
      status,
      description,
    } = req.body;
    const task = await TaskService.createTask({
      title,
      spaceId,
      assigneeIds,
      priority,
      dueDate,
      status,
      description,
    });

    res.status(httpStatus.CREATED).json({
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, assigneeIds, priority, dueDate, status, description } =
      req.body;
    const updated = await TaskService.updateTask(id, {
      title,
      assigneeIds,
      priority,
      dueDate,
      status,
      description,
    });

    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Task updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBySpaceId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { spaceId } = req.params;
    const tasks = await TaskService.getTasksBySpaceId(spaceId);

    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const TaskController = {
  create,
  update,
  getAllBySpaceId,
};
