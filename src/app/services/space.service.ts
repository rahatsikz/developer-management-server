import prisma from "../../shared/prisma";

const createSpace = async (name: string, projectId: string) => {
  return prisma.space.create({
    data: {
      name,
      project: { connect: { id: projectId } },
    },
    include: { project: true, members: true },
  });
};

const getSpacesByProjectId = async (projectId: string) => {
  return prisma.space.findMany({
    where: { projectId },
    include: { project: true, members: true },
  });
};

const getSpaceById = async (id: string) => {
  return prisma.space.findUnique({
    where: { id },
    include: { project: true, members: true },
  });
};

const updateSpace = async (
  id: string,
  data: { name?: string; projectId?: string; userIds?: string[] }
) => {
  return prisma.space.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.projectId && { project: { connect: { id: data.projectId } } }),
      ...(data.userIds && {
        members: { connect: data.userIds.map((id) => ({ id })) },
      }),
    },
    include: { project: true, members: true },
  });
};

const deleteSpace = async (id: string) => {
  return prisma.space.delete({ where: { id } });
};

export const SpaceService = {
  createSpace,
  getSpacesByProjectId,
  getSpaceById,
  updateSpace,
  deleteSpace,
};
