import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISocial extends Document {
  title: string;
  href: string;
  icon: string;
  order?: number;
}

const SocialSchema: Schema<ISocial> = new Schema({
  title: { type: String, required: true },
  href: { type: String, required: true },
  icon: { type: String, required: true },
  order: { type: Number, default: 0 },
});

const Social: Model<ISocial> =
  mongoose.models.Social || mongoose.model<ISocial>("Social", SocialSchema);

export default Social;
