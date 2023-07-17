const express = require("express");
const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.post("/", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      let user = await User.findOne({ email: email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "email already exsists" }] });
      }
  
      let username1 = await User.findOne({ name: name });
      if (username1) {
        return res
          .status(400)
          .json({ errors: [{ msg: "username already exsists" }] });
      } else {
        user = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
  
        await user.save();
  
        return res.send({
          data: {
            success: true,
            user: user,
          },
        });
      }
    } catch (err) {
      res.send(err.message);
    }
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      let user = await User.findOne({ email: email });
      if (!user) {
        res.status(400).send({ message: "User not found" });
        return;
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(400).send({ message: "Invalid password" });
        return;
      }
      if (user) {
        const token = jwt.sign(
          {
            username: user.name,
            email: user.email,
            password: user.password,
          },
          process.env.JWTSECRET,
          {
            expiresIn: "24h",
          }
        );
  
        await user.updateOne({ $set: { is_active: true } });
  
        return res.send({
          data: {
            success: true,
            user: user,
            token: token,
          },
        });
      }
    } catch (err) {
      res.status(500).json({ data: { success: false, message: err.message } });
    }
  });

  router.get("/", async (req, res) => {
    try {
      let username = await User.find({});
  
      if (!username) {
        res.status(400).send({ message: "user not found" });
        return;
      } else {
        return res.send({
          data: {
            success: true,
            allusers: username,
          },
        });
      }
    } catch (err) {
      res.status(500).json({ data: { success: false, message: err.message } });
    }
  });

  module.exports = router;