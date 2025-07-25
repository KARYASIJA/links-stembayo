import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILink extends Document {
  title: string;
  href: string;
  image?: string;
  type: "main" | "service" | "other";
  order?: number;
}

const LinkSchema: Schema<ILink> = new Schema({
  title: { type: String, required: true },
  href: { type: String, required: true },
  image: { type: String },
  type: { type: String, enum: ["main", "service", "other"], required: true },
  order: { type: Number, default: 0 },
});

const Link: Model<ILink> =
  mongoose.models.Link || mongoose.model<ILink>("Link", LinkSchema);

export default Link;
