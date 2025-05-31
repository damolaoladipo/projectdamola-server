import { ObjectId } from "mongoose";
import { IUserDoc } from "../utils/interface.util";

export interface CreatePrepPilotDTO {
  prepPilotUserId?: string;
  jobRole?: string;
  level?: string;
  experience?: string;
  preference?: Array<string>;
  session?: ObjectId;
  questions?: Array<ObjectId>;
  user: IUserDoc;
}
