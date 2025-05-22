import mongoose, { Schema, Model } from "mongoose";
import { ISessionDoc } from "../../utils/interface.util";
import { DbModelsType } from "../../utils/enums.util";

const SessionSchema = new Schema<ISessionDoc>(
  {
    
    role: { type: String, required: true  },
    experience: { type: String, required: true  },
    topicsToFocus: { type: String, required: true },    
    description: { type: String },

    // relationships
    user: { type: Schema.Types.ObjectId, ref: DbModelsType.USER },
    questions: [{ type: Schema.Types.ObjectId, ref: DbModelsType.QUESTION }],
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

const Session: Model<ISessionDoc> = mongoose.model<ISessionDoc>(
  DbModelsType.SESSION,
  SessionSchema
);

export default Session;
