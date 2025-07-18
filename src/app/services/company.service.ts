import { Company } from "@prisma/client";
import prisma from "../../shared/prisma";

const createCompany = async (
  name: string,
  userId?: string
): Promise<Company> => {
  return prisma.company.create({
    data: { name, users: { connect: { id: userId } } },
    include: { users: true },
  });
};

const getCompanyById = async (id: string): Promise<Company | null> => {
  return prisma.company.findUnique({
    where: { id },
    include: { users: true },
  });
};

const updateCompany = async (id: string, name: string): Promise<Company> => {
  return prisma.company.update({
    where: { id },
    data: { name },
  });
};

const deleteCompany = async (id: string): Promise<Company> => {
  return prisma.company.delete({
    where: { id },
  });
};

// get by userID
const getCompanyByUserId = async (userId: string) => {
  const isUserExit = await prisma.user.findUnique({
    where: { id: userId },
    include: { company: true },
  });
  if (!isUserExit) return null;

  const companies = await prisma.company.findMany({
    where: {
      users: { some: { id: userId } },
    },
    include: { users: true },
  });

  return companies;
};

export const CompanyService = {
  createCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getCompanyByUserId,
};
