const User = require("../models/usermodel");
const express = require('express');
const bcrypt = require('bcrypt');
const { jwtGenerator } = require('../utils/jwtGenerator');
const jwt = require('jsonwebtoken');

// Register route
const signup = async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
  
      // Check if the user with the same email already exists
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(401).send('User already exists. Please log in.');
      }
  
      // Create a new user instance with the provided data, including 'role'
      const newUser = new User({
        username,
        email,
        password,
        role,
      });
  
      // Hash the password and assign it to the newUser object
      const hashedPassword = await bcrypt.hash(password, 10);
      newUser.password = hashedPassword;
  
      // Save the newUser object to the database
      await newUser.save();
  
      // Generate a JWT token for the user
      const token = jwtGenerator(newUser);
      
      // Return a success response with the token and a message
      res.status(201).json({
        token,
        message: 'User registered successfully',
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
  
// Login route

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }

    const token = jwtGenerator(user);
var userdata= {  token,
  userId: user._id, 
  role: user.role,}
  console.log(userdata)
   
    res.json( userdata);


  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if the user with the same email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists. Please log in.' });
    }

    // Create a new user instance with the provided data, including 'role'
    const newUser = new User({
      username,
      email,
      password,
      role,
      approved: false, // You can set the 'approved' field to false by default
    });

    // Hash the password and assign it to the newUser object
    const hashedPassword = await bcrypt.hash(password, 10);
    newUser.password = hashedPassword;

    // Save the newUser object to the database
    await newUser.save();

    // Generate a JWT token for the user
    const token = jwtGenerator(newUser);

    // Return a success response with the token and a message
    res.status(201).json({
      token,
      message: 'User registered successfully',
      user: newUser, // Optionally, you can send the created user data in the response.
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};




const checkApprovalStatus = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 
  console.log(token)
const decodedToken = jwt.verify(token, process.env.jwtSecret); // Verify the JWT token
    const userId = decodedToken.user_id; 
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ approved: user.approved });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getallusers = async (req, res) => {
    try {
      const users = await User.find({ role: 'user' }); 
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  };






  const acceptUser = async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await User.findByIdAndUpdate(userId, { approved: true }, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  };

  
  const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};



const getUserByEmail = async (req, res) => {
    const userEmail = req.params.email; 
    try {
        const user = await User.findOne({ email: userEmail }); 
        if (!user) {                                                                                                                                                                                                                                
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const { username, email, approved } = req.body;
  
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the user's properties
      if (username) user.username = username;
      if (email) user.email = email;
      if (approved !== undefined) user.approved = approved;
  
      // Save the updated user
      const updatedUser = await user.save();
  
      return res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  };

// waitinghome
  const getUserApprovedByEmail = async (req, res) => {
    try {
      const email = req.params.email;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ approved: user.approved });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // waitinghome

// assignstou

const getFilteredUsers = async (req, res) => {
  try {
    const selectedSubject = req.query.selectedSubject;

    if (!selectedSubject) {
      return res.status(400).json({ error: 'Please provide a selectedSubject parameter' });
    }

    // Find users who are not associated with the selected subject
    const users = await User.find({ subjectname: { $ne: selectedSubject }, role: 'user' });

    res.json(users || []); // Return an empty array if no users match the criteria
  } catch (error) {
    console.error('Error in try-catch block:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const updateusersubject = async (req, res) => {
  try {
    const { userId, newSubjectName } = req.body;
    const user = await User.findById(userId);
    // Find the user by userId and update their subjectname
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { subjectname: newSubjectName } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'Subject added to the user', user: updatedUser });
  } catch (error) {
    console.error('Error updating user subject:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
  
const getOneUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

  // assignstou


module.exports = {
    signup,
    login,
    createUser,
  checkApprovalStatus,
    getallusers,
    acceptUser,
    deleteUser,
    updateUser,
    getUserByEmail,
    getUserApprovedByEmail,
    getFilteredUsers,
    updateusersubject,
    getOneUser
};
