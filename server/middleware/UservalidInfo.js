const User = require('./user'); // Assuming you've defined the user schema in a separate file called user.js

module.exports = async (req, res, next) => {
  const { email, firstname, lastname, password } = req.body;

  function validEmail(userEmail) {
    return /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === '/register') {
    if (![email, firstname, lastname, password].every(Boolean)) {
      return res.status(401).json('Missing Credentials');
    } else if (!validEmail(email)) {
      return res.status(401).json('Invalid Email');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json('User already exists. Please log in.');
    }
  } else if (req.path === '/login') {
    if (![email, password].every(Boolean)) {
      return res.status(401).json('Missing Credentials');
    } else if (!validEmail(email)) {
      return res.status(401).json('Invalid Email');
    }
  }

  next();
};