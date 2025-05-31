import { Model } from "mongoose";
import PrepPilot from "../models/prepPilot/PrepPilot.model";
import { IPrepPilotDoc, IResult } from "../utils/interface.util";

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
  public async findProfileById(id: string): Promise<IResult> {
    
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

}

export default new PrepPilotRepository;