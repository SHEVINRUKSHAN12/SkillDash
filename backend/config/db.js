const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars (if not already loaded globally, though it's usually done in server.js)
// dotenv.config({ path: './config.env' }); // Make sure the path to your .env file is correct

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Mongoose 6+ options are generally handled automatically
            // useNewUrlParser: true, // No longer needed
            // useUnifiedTopology: true, // No longer needed
            // useCreateIndex: true, // No longer needed
            // useFindAndModify: false // No longer needed
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
