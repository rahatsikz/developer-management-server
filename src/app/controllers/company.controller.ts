import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { CompanyService } from "../services/company.service";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    const company = await CompanyService.createCompany(name);

    res.status(httpStatus.CREATED).json({
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Company created successfully",
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const company = await CompanyService.getCompanyById(id);

    if (!company) {
      return res.status(httpStatus.NOT_FOUND).json({
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Company not found",
      });
    }

    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updated = await CompanyService.updateCompany(id, name);

    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Company updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await CompanyService.deleteCompany(id);

    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

export const CompanyController = { create, getOne, update, remove };
