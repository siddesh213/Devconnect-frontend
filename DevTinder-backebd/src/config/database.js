const mongoose = require("mongoose");

const conncectdb = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error(
        "❌ MONGODB_URI is not defined in environment variables. " +
        "Please check your .env file and ensure MONGODB_URI is set."
      );
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = { conncectdb };
