import { Project } from "@prisma/client";
import prisma from "../../shared/prisma";

const createProject = async (
  name: string,
  description: string | null,
  teamId: string,
  companyId: string
): Promise<Project> => {
  return prisma.project.create({
    data: { name, description, teamId, companyId },
  });
};

const getProjectById = async (id: string): Promise<Project | null> => {
  return prisma.project.findUnique({
    where: { id },
    include: { team: true, company: true },
  });
};

const getAllProjects = async (): Promise<Project[]> => {
  return prisma.project.findMany({ include: { team: true, company: true } });
};

const updateProject = async (
  id: string,
  name: string,
  description: string | null
): Promise<Project> => {
  return prisma.project.update({ where: { id }, data: { name, description } });
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
