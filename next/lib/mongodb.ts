import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

export const disconnectMongoDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};
