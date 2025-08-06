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

const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content, authorId } = req.body;
    const { taskId } = req.params;
    const comment = await TaskService.createComment({
      content,
      authorId,
      taskId,
    });

    res.status(httpStatus.CREATED).json({
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Comment created successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderByIndex = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskIds, spaceId } = req.body;
    if (!Array.isArray(taskIds) || !spaceId) {
      res.status(400).json({ error: "Invalid data format" });
      return;
    }
    await TaskService.updateTasksOrderByIndex(spaceId, taskIds);
    res.status(200).json({ message: "Tasks reordered successfully" });
  } catch (error) {
    next(error);
  }
};

const createSubTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId } = req.params;
    const { title, assigneeIds, dueDate, status, priority } = req.body;
    const subTask = await TaskService.createSubTask({
      title,
      taskId,
      assigneeIds,
      dueDate,
      status,
      priority,
    });

    res.status(httpStatus.CREATED).json({
      statusCode: httpStatus.CREATED,
      success: true,
      message: "SubTask created successfully",
      data: subTask,
    });
  } catch (error) {
    next(error);
  }
};

const updateSubTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, assigneeIds, dueDate, status, priority } = req.body;
    const updated = await TaskService.updateSubTask(id, {
      title,
      assigneeIds,
      dueDate,
      status,
      priority,
    });

    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "SubTask updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const TaskController = {
  create,
  update,
  getAllBySpaceId,
  createComment,
  updateOrderByIndex,
  createSubTask,
  updateSubTask,
};
