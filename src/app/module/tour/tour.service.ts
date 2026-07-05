import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { tourSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({ title: payload.title });

  if (existingTour) {
    throw new Error("A tour with this title already exists.");
  }

  const tour = await Tour.create(payload);
  return tour;
};

const getAllTour = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);

  const tours = await queryBuilder
    .search(tourSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    tours.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);

  if (!existingTour) {
    throw new Error("Tour not found.");
  }

  // check
  if (
    payload.images &&
    payload.images.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    payload.images = [...payload.images, ...existingTour.images];
  }

  if (
    payload.deletedImages &&
    payload.deletedImages.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    const restDBImages = existingTour.images.filter(
      (imageUrl) => !payload.deletedImages?.includes(imageUrl),
    );

    const updatedPayloadImages = (payload.images || [])
    .filter((imageUrl) =>payload.deletedImages?.includes(imageUrl))
    .filter(imageUrl=>!restDBImages.includes(imageUrl))

    payload.images = [...restDBImages, ...updatedPayloadImages];
  }

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

// update hober por

 if (
    payload.deletedImages &&
    payload.deletedImages.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    (await Promise.all(payload.deletedImages)).map(url=>deleteImageFromCLoudinary(url))
  }






  return updatedTour;
};

// delete
const deleteTour = async (id: string) => {
  return await Tour.findByIdAndDelete(id);
};

// -------------tour types -------------------------
const createTourType = async (payload: ITourType) => {
  const existingTourType = await TourType.findOne({ name: payload.name });

  if (existingTourType) {
    throw new Error("Tour type already exists.");
  }

  return await TourType.create({ name });
};

const getAllTourType = async () => {
  return await TourType.find();
};

const updateTourType = async (id: string, payload: ITourType) => {
  const existingTourType = await TourType.findById(id);
  if (existingTourType) {
    throw new Error("Tour type not found.");
  }

  const updatedTourTypes = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedTourTypes;
};

const deletedTourType = async (id: string) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }
  return await TourType.findByIdAndDelete(id);
};

export const TourService = {
  createTour,
  getAllTour,
  updateTour,
  deleteTour,
  createTourType,
  getAllTourType,
  updateTourType,
  deletedTourType,
};
