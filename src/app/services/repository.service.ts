import { Repository } from "@prisma/client";
import { createGithubRepo } from "./github.service";
import prisma from "../../shared/prisma";

const createRepository = async (
  userAccessToken: string,
  name: string,
  projectId: string,
  description?: string
): Promise<Repository> => {
  // 1) Create on GitHub
  const githubRepo = await createGithubRepo(userAccessToken, name, description);

  // 2) Persist in DB
  return prisma.repository.create({
    data: {
      name: githubRepo.name,
      url: githubRepo.html_url,
      githubId: githubRepo.id,
      projectId,
    },
  });
};

const getRepositoryById = async (id: string): Promise<Repository | null> => {
  return prisma.repository.findUnique({ where: { id } });
};

export const RepositoryService = {
  createRepository,
  getRepositoryById,
};
