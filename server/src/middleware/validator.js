const { check, body, validationResult } = require("express-validator");
const genres = require("../utils/genres");
const { isValidObjectId } = require("mongoose");
exports.userValidator = [
  [
    check("name").trim().notEmpty().withMessage("Name is missing !"),

    check("password")
      .trim()
      .notEmpty()
      .withMessage("Password is missing !")
      .isLength({ min: 8 })
      .withMessage("Password must ve 8 characters long!"),

    check("email").trim().isEmail().withMessage("Email is invalid !"),
  ],
];

exports.validatePassword = [
  check("newPassword")
    .trim()
    .notEmpty()
    .withMessage("Password is missing !")
    .isLength({ min: 8 })
    .withMessage("Password must ve 8 characters long!"),
];

exports.signInValidator = [
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is missing !")
    .isLength({ min: 8 })
    .withMessage("Password must ve 8 characters long!"),

  check("email").trim().isEmail().withMessage("Email is invalid !"),
];

exports.actorInfoValidator = [
  check("name").trim().notEmpty().withMessage("Actor name is missing!"),
  check("gender").trim().notEmpty().withMessage("Gender is a required field!"),
  check("about").trim().notEmpty().withMessage("About is a required field!"),
];

exports.validateMovie = [
  check("title").trim().notEmpty().withMessage("Movie title is missing!"),
  check("storyLine").trim().notEmpty().withMessage("Storyline is important!"),
  check("releseDate").isDate().withMessage("Relese date is missing!"),
  check("language").trim().notEmpty().withMessage("Language is missing!"),
  check("status")
    .isIn(["public", "private"])
    .notEmpty()
    .withMessage("Status is missing!"),
  check("type").trim().notEmpty().withMessage("Type is missing!"),
  check("genres")
    .isArray()
    .withMessage("Genres must be an array of strings!")
    .custom((value) => {
      for (let g of value) {
        if (!genres.includes(g)) {
          throw Error("Invalid genres");
        }
      }
      return true;
    }),
  check("tags")
    .isArray({ min: 1 })
    .withMessage("Tags must be an array of strings!")
    .custom((value) => {
      for (let tag of value) {
        if (typeof tag !== "string") throw Error("tag must be a string!");
      }
      return true;
    }),
  check("cast")
    .isArray()
    .withMessage("Cast must be an array of objects!")
    .custom((value) => {
      for (let c of value) {
        if (!isValidObjectId(c.actor)) throw Error("Invalid cast id inside!");
        if (!c.roleAs?.trim()) throw Error("Role as is missing inside cast!");
        if (typeof c.leadActor !== "boolean")
          throw Error(
            "Only accepted boolean value inside leadActor inside cast!"
          );
      }
      return true;
    }),
  check("trailer")
    .isObject()
    .withMessage("Trailer must be an object with url and public_id")
    .custom(({url,public_id}) => {
      try {
        const result = new URL(url);
        if (!result.protocol.includes("https"))
          throw Error("Trailer url is invalid!");
        const arr = url.split("/");
        const publicId = arr[arr.length - 1].split(".")[0];
        if (public_id !== publicId)
          throw Error("Trailer public_id is invalid!");
      
      return true;
      } catch (error) {
        throw Error("Trailer url is invalid!");
      }
    }),
  // check("poster").custom((_, { req }) => {
  //   if (!req.file) throw Error("Poster file is missing!");
  //   return true;
  // }),
];

exports.validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (error.length > 0) {
    return res.status(400).json({ error: error[0].msg });
  }
  next();
};
