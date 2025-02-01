const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useFindAndModify: false, // Jeśli używasz findAndModify, ale ta opcja już jest niezalecana
      useCreateIndex: true,
    });
    console.log(`Database connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Zakończ proces w przypadku błędu
  }
};

module.exports = connectDB;
