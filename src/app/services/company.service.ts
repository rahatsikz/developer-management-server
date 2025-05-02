import { Company } from "@prisma/client";
import prisma from "../../shared/prisma";

const createCompany = async (name: string): Promise<Company> => {
  return prisma.company.create({
    data: { name },
  });
};

const getCompanyById = async (id: string): Promise<Company | null> => {
  return prisma.company.findUnique({
    where: { id },
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

export const CompanyService = {
  createCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
