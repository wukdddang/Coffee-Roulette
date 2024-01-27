import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    times: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number,
      default: 1,
    },
    isProfile: {
      type: Boolean,
      default: false,
    },
    histories: [
      {
        type: Schema.Types.ObjectId,
        ref: "History",
      },
    ],
    participationCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
