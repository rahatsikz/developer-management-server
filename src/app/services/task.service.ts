import { TaskPriority, TaskStatus } from "@prisma/client";
import prisma from "../../shared/prisma";

const createTask = async (data: {
  title: string;
  spaceId: string;
  assigneeIds?: string[];
  priority?: TaskPriority;
  dueDate?: Date;
  status?: TaskStatus;
  description?: string;
}) => {
  return prisma.task.create({
    data: {
      title: data.title,
      space: { connect: { id: data.spaceId } },
      ...(data.assigneeIds && {
        assignees: { connect: data.assigneeIds.map((id) => ({ id })) },
      }),
      ...(data.priority && { priority: data.priority }),
      ...(data.dueDate && { dueDate: data.dueDate }),
      ...(data.status && { status: data.status }),
      ...(data.description && { description: data.description }),
    },
    include: { assignees: true, space: true },
  });
};

const updateTask = async (
  id: string,
  data: {
    title?: string;
    assigneeIds?: string[];
    priority?: TaskPriority;
    dueDate?: Date;
    status?: TaskStatus;
    description?: string;
  }
) => {
  return prisma.task.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.assigneeIds && {
        assignees: { set: data.assigneeIds.map((id) => ({ id })) },
      }),
      ...(data.priority && { priority: data.priority }),
      ...(data.dueDate && { dueDate: data.dueDate }),
      ...(data.status && { status: data.status }),
      ...(data.description && { description: data.description }),
    },
    include: { assignees: true, space: true },
  });
};

const getTasksBySpaceId = async (spaceId: string) => {
  return prisma.task.findMany({
    where: { spaceId },
    orderBy: { order: "asc" },
    include: {
      assignees: true,
      space: true,
      SubTasks: {
        include: {
          assignees: true,
        },
      },
      Comments: {
        include: {
          author: true,
        },
      },
    },
  });
};

const createComment = async (data: {
  content: string;
  authorId: string;
  taskId: string;
}) => {
  return prisma.comment.create({
    data: {
      content: data.content,
      author: { connect: { id: data.authorId } },
      task: { connect: { id: data.taskId } },
    },
    include: { author: true, task: true },
  });
};

const updateTasksOrderByIndex = async (spaceId: string, taskIds: string[]) => {
  const updatePromises = taskIds.map((taskId, index) =>
    prisma.task.update({
      where: { id: taskId },
      data: { order: index },
    })
  );
  await Promise.all(updatePromises);
  return true;
};

const createSubTask = async (data: {
  title: string;
  taskId: string;
  assigneeIds?: string[];
  dueDate?: Date;
  status?: TaskStatus;
  priority?: TaskPriority;
}) => {
  return prisma.subTask.create({
    data: {
      title: data.title,
      task: { connect: { id: data.taskId } },
      ...(data.assigneeIds && {
        assignees: { connect: data.assigneeIds.map((id) => ({ id })) },
      }),
      ...(data.dueDate && { dueDate: data.dueDate }),
      ...(data.status && { status: data.status }),
      ...(data.priority && { priority: data.priority }),
    },
    include: { assignees: true, task: true },
  });
};

const updateSubTask = async (
  id: string,
  data: {
    title?: string;
    assigneeIds?: string[];
    dueDate?: Date;
    status?: TaskStatus;
    priority?: TaskPriority;
  }
) => {
  return prisma.subTask.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.assigneeIds && {
        assignees: { set: data.assigneeIds.map((id) => ({ id })) },
      }),
      ...(data.dueDate && { dueDate: data.dueDate }),
      ...(data.status && { status: data.status }),
      ...(data.priority && { priority: data.priority }),
    },
    include: { assignees: true, task: true },
  });
};

export const TaskService = {
  createTask,
  updateTask,
  getTasksBySpaceId,
  createComment,
  updateTasksOrderByIndex,
  createSubTask,
  updateSubTask,
};
