import mongoose from "mongoose";
const Schema = mongoose.Schema;

const historySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // 여기에 추가적인 필드를 정의할 수 있습니다.
  },
  { timestamps: true }
);

export const History =
  mongoose.models.History || mongoose.model("History", historySchema);
