const express = require("express");
const {
  addCategory,
  getCategories,
  updateCategories,
  deleteCategories,
} = require("../controller/category");
const {
  requireSignin,
  adminMiddleware,
  superAdminMiddleware,
} = require("../common-middleware");
const router = express.Router();
const shortid = require("shortid");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

//request to create a category
router.post(
  "/category/create",
  requireSignin,  //check if a user is logged in
  superAdminMiddleware,  //check if the user is super admin
  upload.single("categoryImage"), //upload the category image (if any)
  addCategory // finally push the category to DB
);


//request to get categorieS
router.get("/category/getcategory", getCategories);


//request to update a category
router.post(
  "/category/update",
  requireSignin,
  superAdminMiddleware,
  upload.array("categoryImage"),
  updateCategories
);


//request to delete a category
router.post(
  "/category/delete",
  requireSignin,
  superAdminMiddleware,
  deleteCategories
);

module.exports = router;