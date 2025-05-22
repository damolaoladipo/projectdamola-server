import mongoose, { Schema, Model } from "mongoose";
import { IPrepPilotDoc } from "../../utils/interface.util";
import { DbModelsType } from "../../utils/enums.util";

const PrepPilotSchema = new Schema<IPrepPilotDoc>(
  {
    jobRole: { type: String },
    level: { type: String },
    experience: { type: String },
    preference: [{ type: String }],
    

    // relationships
    user: { type: Schema.Types.ObjectId, ref: DbModelsType.USER },
    questions: [{ type: Schema.Types.ObjectId, ref: DbModelsType.QUESTION }],
    session: { type: Schema.Types.ObjectId, ref: DbModelsType.SESSION },
    createdBy: { type: Schema.Types.ObjectId, ref: DbModelsType.USER },
  },
  {
    timestamps: true,
    versionKey: "_version",
    toJSON: {
      transform(doc: any, ret) {
        ret.id = ret._id;
        delete ret.__v;
      },
    },
  }
);

const PrepPilot: Model<IPrepPilotDoc> = mongoose.model<IPrepPilotDoc>(
  DbModelsType.PREPPILOT,
  PrepPilotSchema
);

export default PrepPilot;
