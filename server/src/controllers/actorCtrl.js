const Actor = require("../models/actorModel");
const {
  sendError,
  uploadImageToCloud,
  formatActors,
} = require("../utils/helper");
const { isValidObjectId } = require("mongoose");
const cloudinary = require("../cloud");
const actorCtrl = {
  create: async (req, res, next) => {
    try {
      const { name, gender, about } = req.body;
      const { file } = req;
      const newActor = new Actor({ name, gender, about });
      if (file) {
        const { url, public_id } = await uploadImageToCloud(file.path);
        newActor.avatar = { url, public_id };
      }

      await newActor.save();

      res.status(200).json({ actor: formatActors(newActor) });
    } catch (err) {}
  },

  update: async (req, res, next) => {
    try {
      const { name, about, gender } = req.body;
      const { file } = req;
      const { actorId } = req.params;

      if (!isValidObjectId(actorId)) return sendError(res, "Invalid request");

      const actor = await Actor.findById(actorId);
      if (!actor) return sendError(res, "Invalid request, record not found!");

      const public_id = actor.avatar?.public_id;

      if (public_id && file) {
        const { result } = await cloudinary.uploader.destroy(public_id);
        if (result !== "ok") {
          return sendError(res, "Could not remove image from cloud!");
        }
      }

      if (file) {
        const { url, public_id } = await uploadImageToCloud(file.path);
        actor.avatar = { url, public_id };
      }

      actor.name = name;
      actor.about = about;
      actor.gender = gender;

      await actor.save();
      res.status(200).json({ actor: formatActors(actor) });
    } catch (error) {}
  },
  delete: async (req, res, next) => {
    try {
      const { actorId } = req.params;

      if (!isValidObjectId(actorId)) return sendError(res, "Invalid request");

      const actor = await Actor.findById(actorId);
      if (!actor) return sendError(res, "Invalid request, record not found!");
      const public_id = actor.avatar.public_id;
      if (public_id) {
        const { result } = await cloudinary.uploader.destroy(public_id);
        if (result !== "ok") {
          return sendError(res, "Could not remove image from cloud!");
        }
      }
      await Actor.findByIdAndDelete(actorId);
      res.status(200).json({ message: "Record removed successfully" });
    } catch (error) {}
  },
  search: async (req, res, next) => {
    try {
      const { name } = req.query;
      // const result = await Actor.find({
      //   $text: { $search: `"${query.name}"` },
      // });

      if(!name.trim()) return sendError(res, "Invalid Request")
      const result = await Actor.find({
        name: { $regex: name, $options: "i" },
      });
      const actors = result.map((item) => formatActors(item));
      res.json({ results: actors });
    } catch (error) {}
  },
  getLatestActors: async (req, res, next) => {
    try {
      const result = await Actor.find().sort({ createdAt: "-1" }).limit(12);
      const actors = result.map((item) => formatActors(item));
      res.json(actors);
    } catch (error) {}
  },
  getSingleActor: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) return sendError(req, "Invalid request!");

      const result = await Actor.findById(id);
      if (!result) return sendError(res, "Actor not found!");

      res.status(200).json({actor:formatActors(result)});
    } catch (error) {}
  },
  getActors: async (req, res, next) => {
    try {
      const { pageNo, limit } = req.query;
      const actors = await Actor.find({})
        .sort({ createdAt: -1 })
        .skip(parseInt(pageNo) * parseInt(limit))
        .limit(parseInt(limit));

      const profile = actors?.map((a) => formatActors(a));

      res.status(200).json({ profile });
    } catch (err) {}
  },
};

module.exports = actorCtrl;
