import { CreatePrepPilotDTO } from "../dtos/prepPilot.dto";
import PrepPilot from "../models/prepPilot/PrepPilot.model";
import { generateRandomChars } from "../utils/helper.util";
import { IPrepPilotDoc, IUserDoc, IResult } from "../utils/interface.util";


class PrepPilotService {
  constructor() {}

  /**
   * @name createPrepPilotProfile
   * @description
   * Creates a new PrepPilot profile in the database using the provided DTO.
   * Handles setup for newly registered PrepPilot profiles by saving
   * essential user metadata and preferences.
   * @param {CreatePrepPilotDTO} data
   * @returns {Promise<IResult<{ profile: IPrepPilotDoc; user: IUserDoc }>>}
   */
  public async createPrepPilotProfile(
    data: CreatePrepPilotDTO
  ): Promise<IResult<{ profile: IPrepPilotDoc; user: IUserDoc }>> {
    const result: IResult<{ profile: IPrepPilotDoc; user: IUserDoc }> = {
      error: false,
      message: "",
      code: 200,
      data: {},
    };

    const { jobRole, level, experience, preference, user, session, questions } =
      data;

    if (!user || !user._id) {
      return {
        error: true,
        message: "User information is required to create a PrepPilot profile",
        code: 400,
        data: [],
      };
    }

    //Check if profile already exists for this user
    const prepPilotProfileExist = await PrepPilot.findOne({ user: user._id });
    if (prepPilotProfileExist) {
      return {
        error: true,
        message: "PrepPilot profile already exists for this user",
        code: 400,
        data: {prepPilotProfileExist, user}
      };
    }

    const genUserId = generateRandomChars(24);

    const profileData = {
      prepPilotUserId: genUserId,
      jobRole,
      level,
      experience,
      preference,
      user: user._id,
      session: session,
      questions: questions || [],
      createdBy: user._id,
    };

    const profile = await PrepPilot.create(profileData);

    await user.save();

    return {
      error: false,
      message: "PrepPilot profile created",
      code: 201,
      data: { profile, user },
    };
  }
}

export default new PrepPilotService();
