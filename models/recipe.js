const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true, // for search
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    steps: [
      {
        type: String,
        required: true,
      },
    ],
    image: {
      url: String,
      public_id: String, // For Cloudinary deletion later
    },
    tags: {
      type: [String],
      index: true, // enables tag-based search
      default: [],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    favoritesCount: {
      type: Number,
      default: 0,
    },
    ratings: [
      {
        foodieId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Foodie",
        },
        rating: {
          type: Number,
          enum: [1, 2, 3, 4, 5],
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', recipeSchema);