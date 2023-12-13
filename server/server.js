// Import dependencies
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require('./routes/userrouter');
const subjectRouter = require('./routes/subjectrouter');
const assignmentRoutes = require('./routes/assignmentRoutes');


// Load environment variables
dotenv.config();

// Create an Express app
const app = express();
const PORT =  5000; 

// Middleware
app.use(cors());
app.use(express.json());

app.use(assignmentRoutes);
app.use(userRouter);
app.use(subjectRouter);

// MongoDB connection
const dbURI = "mongodb+srv://ahmedabughoshh:123@cluster0.trggooi.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`Connected to MongoDB`);
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error in connecting to MongoDB:', error);
    process.exit(1); // Exit the application on MongoDB connection error
  });
