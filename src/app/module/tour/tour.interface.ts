import { Types } from "mongoose";
export interface ITourType {
  name: string;
}
export interface ITour {
  title: string;
  slug: string;
  description?: string;
  departureLocation?: string;
  arrivalLocation?: string;
  images?: string[];
  location?: string;
  costFrom: number;
  startData?: Date;
  endData?: Date;
  included?: string[];
  excluded?: string[];
  amenities?: string[];
  tourPlan?: string[];
  maxGuest?: number;
  minAge?: number;
  division: Types.ObjectId;
  tourType: Types.ObjectId;
  deletedImages?:string[]
}
