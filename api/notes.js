import { Router } from "express";
import { Notes } from "../models/Notes.js";
import { User } from "../models/user.js";
import { HttpError } from "../models/HttpError.js";

export const notesRouter = Router();

notesRouter.get("/", async (req, res) => {
  const notes = await Notes.find({ owner: req?.userId });
  return res.json(notes);
});

notesRouter.post("/", async (req, res, next) => {
  if (!req?.body?.text) {
    return next(new HttpError(400, "Text is required"));
  }

  const user = await User.findById(req?.userId);

  if (!user) {
    return next(new HttpError(401, "Unauthorized"));
  }

  const text = req.body.text;
  const owner = user._id;
  const note = await Notes.create({ text, owner });

  return res.status(201).json(note);
});
