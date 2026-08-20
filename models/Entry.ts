import mongoose, { Schema, models, model } from "mongoose";

const EntrySchema = new Schema(
  {
    name: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

// models.Entry verhindert "OverwriteModelError" bei Hot-Reload in der Entwicklung
export const Entry = models.Entry || model("Entry", EntrySchema);

export default mongoose;
