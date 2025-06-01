import { CreatePrepPilotDTO } from "../../dtos/prepPilot.dto";
import prepPilotRepository from "../../repositories/prep-pilot.repository";
import ErrorResponse from "../../utils/error.util";
import { IPrepPilotDoc, IResult, IUserDoc } from "../../utils/interface.util";

class PreppilotService {
  constructor() {}

  /**
   * @name createPrepPilotProfile
   * @description Creates a new PrepPilot profile.
   * @param data
   * @returns
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

    const {
      prepPilotUserId,
      jobRole,
      level,
      experience,
      preference,
      questions,
      session,
      user,
    } = data;

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
    const existingProfile = await prepPilotRepository.findProfileById({
      user: user._id,
    });
    if (existingProfile.error) {
      return new ErrorResponse(
        existingProfile.message,
        existingProfile.code!,
        []
      );
    }
    // Create the PrepPilot profile
    const prepPilotProfile: IPrepPilotDoc = {
      prepPilotUserId: prepPilotUserId || "",
      jobRole: jobRole || "",
      level: level || "",
      experience: experience || "",
      preference: preference || [],
      user: user._id,
      session: session || null,
      questions: questions || [],
      createdBy: user._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      _version: 1,
      _id: new ObjectId(),
    };

    const createdProfile = await prepPilotRepository.createProfile(
      prepPilotProfile
    );

    if (createdProfile.error) {
      return new ErrorResponse(
        createdProfile.message,
        createdProfile.code!,
        []
      );
    }
  }

  
}

export const preppilotService = new PreppilotService();
