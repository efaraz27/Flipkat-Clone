const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => { //checking if a user exists in the DB having the email provided
    //user is the document return by the DB
    if (user) //if the user exists inform that the user already exists
      return res.status(400).json({
        message: "Admin already registered",
      });
    
    //Count the number of users in the DB
    User.estimatedDocumentCount(async (err, count) => {
      if (err) return res.status(400).json({ error });
      let role = "admin";
      if (count === 0) { //if there is no users registered then the user will be signed up as super admin
        role = "super-admin";
      }
      //destructuring the required values from the request body
      const { firstName, lastName, email, password } = req.body;
      //encrypting the password input by the user
      const hash_password = await bcrypt.hash(password, 10);
      //creating a new user from the pre defined schema
      const _user = new User({
        firstName,
        lastName,
        email,
        hash_password,
        username: shortid.generate(),
        role,
      });

      //pushing the user to the DB or user collection
      _user.save((error, data) => {
        if (error) {
          return res.status(400).json({
            message: "Something went wrong",
          });
        }
        if (data) {
          return res.status(201).json({
            message: "Admin created Successfully..!",
          });
        }
      });
    });
  });
};

exports.signin = (req, res) => {
  //checking if the user exists in the DB
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      //if the user exists then authenticate the password by comparing the password provided by the user to the encrypted password stored in the DB
      const isPassword = await user.authenticate(req.body.password);
      //if the password is correct then check if the user is admin or super admin
      if (
        isPassword &&
        (user.role === "admin" || user.role === "super-admin")
      ) {
        //sign in accordingly with the role
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
        //destructuring the required details from the user object obtained from the DB
        const { _id, firstName, lastName, email, role, fullName } = user;
        res.cookie("token", token, { expiresIn: "1d" }); //storing the token which expires after 1 day. It signifies that the user is signed in
        //respond with the token adnd the user i.e user signed in successfully
        res.status(200).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName },
        });
      } else {
        //else the password was invalid
        return res.status(400).json({
          message: "Invalid Password",
        });
      }
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token"); //deleting the token cookie which signifies that either the session expired or the user is not logged in i.e signed out
  res.status(200).json({
    message: "Signout successfully...!",
  });
};