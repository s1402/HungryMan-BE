const express = require("express");
const pino = require("pino");
const Recipe = require("../../models/recipe");
const logger = pino({ level: "info" });
const { recipeSchema } = require("../../validations/recipeValidations");
const ERROR = require("../../enums/Error");
const MESSAGE = require("../../enums/Messages");
const router = express.Router();

// Add a recipe
router.post("/", async (req, res) => {
  try {
    // validate the payload
    const { error } = recipeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    // save recipe to DB
    const newRecipe = new Recipe({ ...req.body });
    const savedRecipe = await newRecipe.save();
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
    console.log(ownerId);

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
        $inc: {__v :1 }
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
    await Recipe.findByIdAndDelete(
      req.params.id,
    );
    return res.status(200).json({ message: MESSAGE.RECIPE_DELETED});
  } catch (err) {
    logger.error(`error in /recipe route ${err}`);
    res.status(500).json({ error: ERROR.SERVER_ERROR });
  }
});

module.exports = router;
