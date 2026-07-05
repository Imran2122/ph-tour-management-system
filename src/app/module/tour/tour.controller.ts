import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourService } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";
import { ITour } from "./tour.interface";

const creteTour = catchAsync(async (req: Request, res: Response) => {
  const payload: ITour = {
    ...req.body,
    images: (req.files as Express.Multer.File[]).map((file) => file.path),
  };

  const result = await TourService.createTour(payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour created successfully",
    data: result,
  });
});

const getAllTours = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await TourService.getAllTour(query as Record<string, string>);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour created successfully",
    data: result,
  });
});

const updateTour = catchAsync(async (req: Request, res: Response) => {

 const payload: ITour = {
    ...req.body,
    images: (req.files as Express.Multer.File[]).map((file) => file.path),
  };

  const result = await TourService.updateTour(req.params.id, payload);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour update successfully",
    data: result,
  });
});

const deleteTour = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await TourService.deleteTour(id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour created successfully",
    data: result,
  });
});

// getAllTourTypes
const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
  const result = await TourService.getAllTourType();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour types retrieved successfully",
    data: result,
  });
});

const createTourType = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;
  const result = await TourService.createTourType(name);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour types retrieved successfully",
    data: result,
  });
});

const updateTourType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const result = await TourService.updateTourType(id, name);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour types update successfully",
    data: result,
  });
});

const deleteTourTypes = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourService.deletedTourType(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour types retrieved successfully",
    data: result,
  });
});

export const TourController = {
  creteTour,
  getAllTours,
  updateTour,
  deleteTour,
  getAllTourTypes,
  createTourType,
  updateTourType,
  deleteTourTypes,
};
