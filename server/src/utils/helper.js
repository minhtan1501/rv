const crypto = require("crypto");
const cloudinary = require("../cloud")
exports.sendError = (res, error, statusCode = 400) => {
  res.status(statusCode).json({ error: error });
};

exports.generateRandomByte = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buf) => {
      if (err) reject(err);
      const buffString = buf.toString("hex");
      resolve(buffString);
    });
  });
};

exports.handleNotFound = (req, res, next) =>{
  this.sendError(res,"Not Found")
}

exports.uploadImageToCloud = async (file) =>{
  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    file,
    {
      folder: "baocao",
      aspect_ratio: "5:6",
      gravity: "face",
      height: 500,
      width: 500,
      crop: "thumb",
    })
    return {url,public_id}
}

exports.formatActors = actor =>{
  const {name,gender,about,_id,avatar} = actor
  return {
    id: _id,
    name,
    about,
    gender,
    avatar: avatar.url

  
  }
}

exports.parseData = (req, res, next) =>{
  const {trailer, cast, genres, tags, writers} = req.body;
  
  if(trailer) req.body.trailer = JSON.parse(trailer);
  if(cast) req.body.cast = JSON.parse(cast);
  if(genres) req.body.genres = JSON.parse(genres);
  if(tags) req.body.tags = JSON.parse(tags);
  if(writers) req.body.writers = JSON.parse(writers);
  next();
}