import { Project } from "@prisma/client";
import prisma from "../../shared/prisma";

const createProject = async (
  name: string,
  companyId: string,
  userId: string
): Promise<Project> => {
  return prisma.project.create({
    data: { name, companyId, users: { connect: { id: userId } } },
  });
};

const getProjectById = async (id: string): Promise<Project | null> => {
  return prisma.project.findUnique({
    where: { id },
    include: { company: true, users: true, Spaces: true },
  });
};

const getAllProjects = async (filters?: {
  companyId?: string;
  userId?: string;
}): Promise<Project[]> => {
  const { companyId, userId } = filters || {};
  return prisma.project.findMany({
    where: {
      ...(companyId && { companyId }),
      ...(userId && {
        users: {
          some: {
            id: userId, // assuming user has many-to-many relation with project
          },
        },
      }),
    },
    include: { company: true, users: true, Spaces: true },
  });
};

const updateProject = async (
  id: string,
  payload: {
    name?: string;
    userIds: string[];
  }
): Promise<Project> => {
  const { name, userIds } = payload;
  return prisma.project.update({
    where: { id },
    data: {
      name,
      users: {
        connect: userIds.map((id) => ({ id })),
      },
    },
  });
};

const deleteProject = async (id: string): Promise<Project> => {
  return prisma.project.delete({ where: { id } });
};

export const ProjectService = {
  createProject,
  getProjectById,
  getAllProjects,
  updateProject,
  deleteProject,
};
