import mongoose, { Schema } from "mongoose";

const NoteSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

export const Notes = mongoose.model("note", NoteSchema);
