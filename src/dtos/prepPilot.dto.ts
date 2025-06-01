import { ObjectId } from "mongoose";
import { IUserDoc } from "../utils/interface.util";

export interface CreatePrepPilotDTO {
  user: IUserDoc;
  createdBy?: string | ObjectId;

  prepPilotUserId?: string;
  jobRole?: string;
  level?: string;
  experience?: string;
  preference?: Array<string>;
  session?: ObjectId;
  questions?: Array<string>;
  
}

export interface UpdatePrepPilotDTO {
  prepPilotUserId?: string;
  jobRole?: string;
  level?: string;
  experience?: string;
  preference?: Array<string>;
  session?: ObjectId;
  questions?: Array<ObjectId>;
  user: IUserDoc;
}
