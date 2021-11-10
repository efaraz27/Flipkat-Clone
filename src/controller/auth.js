const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.signup = (req, res) => {
  //check if the user exists in the DB
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user) //the user already exists
      return res.status(400).json({
        error: "User already registered",
      });
    
    //destructure the required details from the sign up request body
    const { firstName, lastName, email, password } = req.body;
    //encrypt the password to store in the DB
    const hash_password = await bcrypt.hash(password, 10);
    //creating a new user document using the pre defined schema
    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password,
      username: shortid.generate(),
    });

    //pushing the new user to the DB
    _user.save((error, user) => {
      if (error) {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }

      //sign in if the user was created
      if (user) {
        const token = generateJwtToken(user._id, user.role);
        const { _id, firstName, lastName, email, role, fullName } = user;
        return res.status(201).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName },
        });
      }
    });
  });
};

exports.signin = (req, res) => {
  //check if the user exists in the DB
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    //if the user exists then authenticate
    if (user) {
      const isPassword = await user.authenticate(req.body.password); //comparing the hash password and the input password
      //if the user is of role 'user' then sign in
      if (isPassword && user.role === "user") {
        // const token = jwt.sign(
        //   { _id: user._id, role: user.role },
        //   process.env.JWT_SECRET,
        //   { expiresIn: "1d" }
        // );
        const token = generateJwtToken(user._id, user.role); //generating a JWT token
        const { _id, firstName, lastName, email, role, fullName } = user; //destructuring the necessary details from the user document obtained from the DB
        //respond with generated token and the user details
        res.status(200).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName },
        });
      } else {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  });
};
