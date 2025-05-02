import { Team } from "@prisma/client";
import prisma from "../../shared/prisma";

export const createTeam = async (
  name: string,
  companyId: string
): Promise<Team> => {
  return prisma.team.create({ data: { name, companyId } });
};

export const getTeamById = async (id: string): Promise<Team | null> => {
  return prisma.team.findUnique({ where: { id }, include: { company: true } });
};

export const getAllTeams = async (): Promise<Team[]> => {
  return prisma.team.findMany({ include: { company: true } });
};

export const updateTeam = async (id: string, name: string): Promise<Team> => {
  return prisma.team.update({ where: { id }, data: { name } });
};

export const deleteTeam = async (id: string): Promise<Team> => {
  return prisma.team.delete({ where: { id } });
};

export const TeamService = {
  createTeam,
  getTeamById,
  getAllTeams,
  updateTeam,
  deleteTeam,
};
