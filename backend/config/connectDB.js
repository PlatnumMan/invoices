import chalk from "chalk";
import mongoose from "mongoose";

const connectionToDB = async () => {
  try {
    const connectionParams = {
      dbName: process.env.DB_NAME,
    };
    const connect = await mongoose.connect(
      process.env.MONGO_URI,
      connectionParams
    );
    console.log(
      `${chalk.blue.bold(`Connected to DB: ${connect.connection.host}`)}`
    );
  } catch (error) {
    console.log(`${chalk.bold.red(`Error connecting to DB: ${error}`)}`);
    process.exit(1);
  }
};

export default connectionToDB;
