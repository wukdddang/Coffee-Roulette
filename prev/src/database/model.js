const mongoose = require("mongoose");
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

const History = mongoose.model("History", historySchema);
const User = mongoose.model("User", userSchema);

module.exports = { User, History };
