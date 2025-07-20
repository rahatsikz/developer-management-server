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
    include: { assignees: true, space: true },
  });
};

export const TaskService = {
  createTask,
  updateTask,
  getTasksBySpaceId,
};
