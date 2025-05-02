import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { TeamService } from "../services/team.service";
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, companyId } = req.body;
    const team = await TeamService.createTeam(name, companyId);
    res.status(httpStatus.CREATED).json({
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Team created",
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const team = await TeamService.getTeamById(id);
    if (!team)
      return res.status(httpStatus.NOT_FOUND).json({
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Team not found",
      });
    res
      .status(httpStatus.OK)
      .json({ statusCode: httpStatus.OK, success: true, data: team });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teams = await TeamService.getAllTeams();
    res
      .status(httpStatus.OK)
      .json({ statusCode: httpStatus.OK, success: true, data: teams });
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updated = await TeamService.updateTeam(id, name);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Team updated",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await TeamService.deleteTeam(id);
    res.sendStatus(httpStatus.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const TeamController = { create, getOne, getAll, update, remove };
