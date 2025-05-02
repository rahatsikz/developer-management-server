import { Request, Response, NextFunction } from "express";
import {
  getGithubAuthUrl,
  exchangeCodeForToken,
} from "../services/github.service";

const redirectToGithub = (req: Request, res: Response) => {
  const state = Math.random().toString(36).substring(2);
  (req as any).session!.githubState = state;
  const url = getGithubAuthUrl(state);

  console.log(url);

  res.redirect(url);
};

const githubCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code, state } = req.query as { code: string; state: string };
    if (state !== (req as any).session!.githubState) {
      throw new Error("Invalid OAuth state");
    }
    const token = await exchangeCodeForToken(code);
    // store token in session or user record
    (req as any).session!.githubToken = token;
    res.redirect("/create-repo");
  } catch (error) {
    next(error);
  }
};

export const GithubController = { redirectToGithub, githubCallback };
