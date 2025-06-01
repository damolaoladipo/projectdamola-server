import { generate } from "@btffamily/pacitude";
import { CreatePrepPilotDTO } from "../../dtos/prepPilot.dto";
import prepPilotRepository from "../../repositories/prep-pilot.repository";
import ErrorResponse from "../../utils/error.util";
import { IPrepPilotDoc, IResult, IUserDoc } from "../../utils/interface.util";

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

    // Validate required fields
    if (!user || !user._id) {
      return {
        error: true,
        message: "User is required to create a PrepPilot profile.",
        code: 400,
        data: {},
      };
    }

    // Profile already exists for the user
    const isExit = await prepPilotRepository.findProfileById(user._id);
    if (isExit.error) {
      return {
      error: true,
      message: isExit.message,
      code: isExit.code!,
      data: {},
    };
    }
    // Create the PrepPilot profile
    const generateProfile: CreatePrepPilotDTO = {
      user: user,
      createdBy: createdBy || user._id,
    };

    const createdProfile = await prepPilotRepository.createProfile(generateProfile);

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

}

export const preppilotService = new PreppilotService();
