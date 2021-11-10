const Category = require("../models/category");
const slugify = require("slugify");
const shortid = require("shortid");

function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    //get all the categories of parent level
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    //get all the nested categories
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  // push all the desired categories into the categoryList and return the list
  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      type: cate.type,
      children: createCategories(categories, cate._id), //recursively creating categories (sub cateogries) and nesting it in the parent category
    });
  }

  return categoryList;
}

exports.addCategory = (req, res) => {
  //Creating the category object
  const categoryObj = {
    name: req.body.name,
    slug: `${slugify(req.body.name)}-${shortid.generate()}`,
    createdBy: req.user._id,
  };

  //Assigning the image to the image property of the cateogry objcet if it was provided
  if (req.file) {
    categoryObj.categoryImage = "/public/" + req.file.filename;
  }

  //Assigning the parent id if the created category is a 'sub/nested category'
  if (req.body.parentId) {
    categoryObj.parentId = req.body.parentId;
  }

  //creating a new category from a predefined schema
  const cat = new Category(categoryObj);

  //pushing the created category to DB
  cat.save((error, category) => {
    //Usually throws an error when the the category already exists
    if (error) return res.status(400).json({ error });
    //push the new category
    if (category) {
      return res.status(201).json({ category });
    }
  });
};

exports.getCategories = (req, res) => {
  //Getting ALL the categories from the DB
  Category.find({}).exec((error, categories) => {
    if (error) return res.status(400).json({ error });
    if (categories) {
      const categoryList = createCategories(categories);
      res.status(200).json({ categoryList });
    }
  });
};

exports.updateCategories = async (req, res) => {
  const { _id, name, parentId, type } = req.body;
  const updatedCategories = [];
  if (name instanceof Array) {
    for (let i = 0; i < name.length; i++) {
      const category = {
        name: name[i],
        type: type[i],
      };
      if (parentId[i] !== "") {
        category.parentId = parentId[i];
      }

      const updatedCategory = await Category.findOneAndUpdate(
        { _id: _id[i] },
        category,
        { new: true }
      );
      updatedCategories.push(updatedCategory);
    }
    return res.status(201).json({ updateCategories: updatedCategories });
  } else {
    const category = {
      name,
      type,
    };
    if (parentId !== "") {
      category.parentId = parentId;
    }
    const updatedCategory = await Category.findOneAndUpdate({ _id }, category, {
      new: true,
    });
    return res.status(201).json({ updatedCategory });
  }
};

exports.deleteCategories = async (req, res) => {
  const { ids } = req.body.payload;
  const deletedCategories = [];
  for (let i = 0; i < ids.length; i++) {
    const deleteCategory = await Category.findOneAndDelete({
      _id: ids[i]._id,
      createdBy: req.user._id,
    });
    deletedCategories.push(deleteCategory);
  }

  if (deletedCategories.length == ids.length) {
    res.status(201).json({ message: "Categories removed" });
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
};
