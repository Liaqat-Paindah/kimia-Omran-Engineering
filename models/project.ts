import { model, models, Schema, type Model } from "mongoose";

type ProjectDocument = {
  name: string;
  slug: string;
  description: string;
  image: string;
  startDate: Date;
  endDate: Date;
  location: string;
  constructionType: string;
  createdAt: Date;
  updatedAt: Date;
};

const ProjectSchema = new Schema<ProjectDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    constructionType: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Project =
  (models.Project as Model<ProjectDocument> | undefined) ||
  model<ProjectDocument>("Project", ProjectSchema);

export default Project;
