import { generate } from "@btffamily/pacitude";
import {
  CreatePrepPilotDTO,
  UpdatePrepPilotDTO,
} from "../../dtos/prepPilot.dto";
import prepPilotRepository from "../../repositories/prep-pilot.repository";
import ErrorResponse from "../../utils/error.util";
import { IPrepPilotDoc, IResult, IUserDoc } from "../../utils/interface.util";
import { ObjectId } from "mongoose";

class PreppilotService {
  constructor() {}

  /**
   * @name createPrepPilotProfile
   * @description Creates a new PrepPilot profile.
   * @param data - createPrepPilotDTO
   * @returns IResult with created prepPilot and user
   */
  public async createPrepPilotProfile(
    data: CreatePrepPilotDTO
  ): Promise<IResult<{ prepPilot: IPrepPilotDoc; user: IUserDoc }>> {
    let result: IResult<{ prepPilot: IPrepPilotDoc; user: IUserDoc }> = {
      error: false,
      message: "",
      code: 200,
      data: {},
    };

    const { user, createdBy } = data;

    if (!user || !user._id) {
      return {
        error: true,
        message: "User is required to create a PrepPilot profile.",
        code: 400,
        data: {},
      };
    }

    const isExit = await prepPilotRepository.findProfileById(user._id);
    if (isExit.error) {
      return {
        error: true,
        message: isExit.message,
        code: isExit.code!,
        data: {},
      };
    }

    const generateProfile: CreatePrepPilotDTO = {
      user: user,
      createdBy: createdBy || user._id,
    };

    const createdProfile = await prepPilotRepository.createProfile(
      generateProfile
    );

    if (createdProfile.error) {
      return {
        error: true,
        message: createdProfile.message,
        code: createdProfile.code!,
        data: {},
      };
    }

    result.data = {
      prepPilot: createdProfile.data!,
      user,
    };

    result.message = "PrepPilot profile created successfully.";
    return result;
  }

  /**
   * @name updatePrepPilotProfile
   * @description Updates an existing PrepPilot profile.
   * @param data - UpdatePrepPilotDTO
   * @returns IResult with updated prepPilot
   */
  public async updatePrepPilotProfile(
    userId: string | ObjectId,
    data: UpdatePrepPilotDTO
  ): Promise<IResult<{prepilot: IPrepPilotDoc}>> {
    
    if (!userId) {
      return {
        error: true,
        message: "User is required to update a PrepPilot profile.",
        code: 400,
        data: {},
      };
    }

    const existingProfile = await prepPilotRepository.findProfileById(userId);
    if (existingProfile.error || !existingProfile.data) {
      return {
        error: true,
        message: existingProfile.message,
        code: existingProfile.code,
        data: {},
      };
    }

    const updatedProfile = await prepPilotRepository.updateProfile(
        userId,
        data
    );
    if (updatedProfile.error) {
      return {
        error: true,
        message: updatedProfile.message,
        code: updatedProfile.code!,
        data: {},
      };
    }

    return {
      error: false,
      message: "PrepPilot profile updated successfully.",
      code: 200,
      data: {
        prepPilot: updatedProfile.data!,
      },
    };
  }
}

export const preppilotService = new PreppilotService();
