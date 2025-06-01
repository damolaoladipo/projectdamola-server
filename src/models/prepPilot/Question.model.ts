import mongoose, { Schema, Model } from "mongoose";
import { IQuestionDoc } from "../../utils/interface.util";
import { DbModelsType } from "../../utils/enums.util";

const QuestionSchema = new Schema<IQuestionDoc>(
  {
    session: { type: Schema.Types.ObjectId, ref: DbModelsType.SESSION },
    question: { type: String },
    answer: { type: String },
    note: { type: String },
    isPinned: { type: Boolean, default: false },

    // relationships
    preppilotProfile: { type: Schema.Types.ObjectId, ref: DbModelsType.PREPPILOT },
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

const Question: Model<IQuestionDoc> = mongoose.model<IQuestionDoc>(
  DbModelsType.QUESTION,
  QuestionSchema
);

export default Question;
