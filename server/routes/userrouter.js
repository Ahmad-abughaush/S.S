const express = require("express");
const router = express.Router();
const userController = require('../controller/usercontroller');

router.post('/signup', userController.signup);
// Define the login route

router.post('/createuser', userController.createUser);


router.post('/login', userController.login);
router.get('/check-approval', userController.checkApprovalStatus);

// router.get('/users/:id',userController.oneUser)
router.patch('/users/:id', userController.updateUser);

// Waitinghome
router.get('/users/email/:email', userController.getUserApprovedByEmail);
// Waitinghome


// home 
router.get('/userbyemail/:email', userController.getUserByEmail);
// home


// dahsboard
router.get('/allusers', userController.getallusers);

router.patch('/accepteduser/:id/accept', userController.acceptUser);

router.delete('/delete-user/:id', userController.deleteUser);

// dahsboard

// assignstou

router.get('/filteredusers', userController.getFilteredUsers);

router.put('/updateusersubject', userController.updateusersubject);

router.get('/oneuser/:userId', userController.getOneUser);

// assignstou



module.exports = router;


