const express = require("express");
const pino = require("pino");
const Recipe = require("../../models/recipe");
const logger = pino({ level: "info" });
const cloudinary = require("cloudinary").v2;
const { recipeSchema } = require("../../validations/recipeValidations");
const ERROR = require("../../enums/Error");
const MESSAGE = require("../../enums/Messages");
const { upload } = require("../../middlewares/cloudanaryUpload");
const router = express.Router();

// Add a recipe
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log(">>", req.body.ingredients, req.body.steps);
    console.log(">>", req.file.path, req.file.filename);

    // validate the payload
    const { error } = recipeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    const { title, description, ingredients, steps, tags, ownerId } = req.body;
    const recipe = new Recipe({
      title,
      description,
      ingredients,
      steps,
      tags,
      ownerId,
      image: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });
    // save recipe to DB
    const savedRecipe = await recipe.save();
    return res.status(201).json(savedRecipe);
  } catch (err) {
    logger.error(`error in /recipe route ${err}`);
    res.status(500).json({ error: ERROR.SERVER_ERROR });
  }
});

// Get all recipes by owner
router.get("/", async (req, res) => {
  try {
    const { ownerId } = req.query;
    const recipes = await Recipe.find({ ownerId }); // we had ownerId as an index in recipe schema that helps us now for quick validations
    // respond with recipes ([] if no recipes)
    return res.status(200).json(recipes);
  } catch (err) {
    logger.error(`error in /recipe route ${err}`);
    res.status(500).json({ error: ERROR.SERVER_ERROR });
  }
});

// update the recipe details
router.patch("/:id", async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
        $inc: { __v: 1 },
      },
      { new: true }
    );
    return res.status(200).json(updatedRecipe);
  } catch (err) {
    logger.error(`error in /recipe route ${err}`);
    res.status(500).json({ error: ERROR.SERVER_ERROR });
  }
});

// delete the recipe details
router.delete("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ error: ERROR.RECIPE_NOT_FOUND });
    }

    // Delete image from Cloudinary using public_id
    if (recipe.image?.public_id) {
      logger.error(`recipe with public_id ${recipe.image?.public_id} deleted`);
      await cloudinary.uploader.destroy(recipe.image.public_id);
    }

    await recipe.deleteOne();
    return res.status(200).json({ message: MESSAGE.RECIPE_DELETED });
  } catch (err) {
    logger.error(`error in /recipe route ${err}`);
    res.status(500).json({ error: ERROR.SERVER_ERROR });
  }
});

module.exports = router;
