import { Model, ObjectId, Types } from "mongoose";
import PrepPilot from "../models/prepPilot/PrepPilot.model";
import { IPrepPilotDoc, IResult } from "../utils/interface.util";
import { CreatePrepPilotDTO } from "../dtos/prepPilot.dto";

class PrepPilotRepository {
  private model: Model<IPrepPilotDoc>;

  constructor() {
    this.model = PrepPilot;
  }

  /**
   * @name findById
   * @param id
   * @param populate 
   * @returns prepPilot Profile
   * @description Find a profilr by ID and populate related data
   */
  public async findProfileById(id: ObjectId |string): Promise<IResult> {
    
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const user = await this.model.findById(id);
    if (!user) {
      result.error = true;
      result.code = 404;
      result.message = "PrepPilot profile not found";
    } else {
        result.data = user;
    }

    return result
  }

    /**
     * @name createProfile
     * @param data
     * @returns Created PrepPilot profile
     * @description Create a new PrepPilot profile
     */
    public async createProfile(data: CreatePrepPilotDTO): Promise<IResult<IPrepPilotDoc>> {
        let result: IResult = { error: false, message: "", code: 200, data: {} };

        const newProfile = new this.model(data);
        const savedProfile = await newProfile.save();

        if (!savedProfile) {
            result.error = true;
            result.code = 500;
            result.message = "Failed to create PrepPilot profile";
        } else {
            result.data = savedProfile;
        }

        return result;
    }

    /**
     * @name updateProfile
     * * @description Update an existing PrepPilot profile
     * @param id
     * @param data
     * @returns Updated PrepPilot profile
     * */
    public async updateProfile(id: ObjectId | string, data: Partial<CreatePrepPilotDTO>): Promise<IResult> {
        let result: IResult = { error: false, message: "", code: 200, data: {} };

        const updatedProfile = await this.model.findByIdAndUpdate
        (id, data, { new: true });
        if (!updatedProfile) {
            result.error = true;
            result.code = 404;
            result.message = "PrepPilot profile not found";
        }   else {
            result.data = updatedProfile;
        }

        return result;
    }
}

export default new PrepPilotRepository;