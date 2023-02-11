const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
ObjectID = mongoose.ObjectID;
//Register
router.post("/register", async (req, res) => {
    try {

        //Generate new Password.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        
        //Create new user
        const newUser = await new User({
            // _id: mongoose.Types.ObjectId(),
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        //save user and respond
        const user = await newUser.save();
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(error)
    }
    
})

router.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if(!user)
      {
        return res.status(404).json("user not found"); 
      } 
  
      const validPassword = await bcrypt.compare(req.body.password, user.password)
      if(!validPassword){
        return res.status(400).json("wrong password")
      } 
      return res.status(200).json(user)
    } catch (err) {
      return res.status(500).json(err)
    }
  });

module.exports = router;