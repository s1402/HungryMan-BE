const express = require("express");
const pino = require("pino");
const Recipe = require("../../models/recipe");
const Foodie = require("../../models/foodie");
const logger = pino({ level: "info" });
const { recipeSchema } = require("../../validations/recipeValidations");
const ERROR = require("../../enums/Error");
const { verifyToken } = require("../../middlewares/verifyToken");
const MESSAGE = require("../../enums/Messages");

const router = express.Router();

// Get ALL RECIPES
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: 1 }); // sort by latest recipes
    return res.status(200).json(recipes);
  } catch (err) {
    logger.error(`error in /recipe route ${err}`);
    return res.status(500).json({ error: ERROR.SERVER_ERROR });
  }
});

// Search (auto-complete) by title/tags
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    const regex = new RegExp(query, "i"); // makes the search case insensitive
    const recipes = await Recipe.find({
      $or: [{ title: regex }, { tags: regex }],
    }).limit(10);
    return res.status(200).json(recipes);
  } catch (err) {
    logger.error(`error in /recipe/search route ${err}`);
    return res.status(500).json({ error: ERROR.SERVER_ERROR });
  }
});

//1. Add/Remove  recipe from favorites[] of foodie
//2. Inc/Dec favoritesCount for Recipe
router.post("/favorites/:recipeId", verifyToken, async (req, res) => {
  try {
    // 1. get foodie id from token present in headers
    const foodieId = req.user._id;
    const recipeId = req.params.recipeId;
    // 2. check if foodie exists
    const foodie = await Foodie.findById(foodieId);
    if (!foodie) {
      return res.status(404).json({ error: ERROR.FOODIE_NOT_FOUND });
    }
    // 3. check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: ERROR.RECIPE_NOT_FOUND });
    }
    // 4. If recipe exists in favorites array of foodie, remove it and dec the favoritesCount for Recipe
    //    else add the recipe in favorites array of foodie and inc the favoritesCount for Recipe
    const index = foodie.favorites.indexOf(recipeId);
    let message = "";
    if (index > -1) {
      foodie.favorites.splice(index, 1);
      recipe.favoritesCount =
        recipe.favoritesCount <= 0 ? 0 : recipe.favoritesCount - 1;
      message = MESSAGE.RECIPE_REMOVED_FAVS;
    } else {
      foodie.favorites.push(recipeId);
      recipe.favoritesCount += 1;
      message = MESSAGE.RECIPE_ADDED_FAVS;
    }
    //5. save in Foodie and Recipe DB Collection
    await recipe.save();
    await foodie.save();
    return res.status(200).json({ message });
  } catch (err) {
    logger.error(`error in POST /favorites/:recipeId route ${err}`);
    return res.status(500).json({ error: ERROR.SERVER_ERROR });
  }
});

// Get all fav recipes
router.get("/favorites", verifyToken, async (req, res) => {
  try {
    const foodieId = req.user._id;
    // It replaces the ObjectIds(recipeId) in the favorites array with the actual full documents from the Recipe collection.
    const foodie = await Foodie.findById(foodieId).populate("favorites");
    if (!foodie) {
      return res.status(404).json({ error: ERROR.FOODIE_NOT_FOUND });
    }
    return res.status(200).json(foodie.favorites);
  } catch (err) {
    logger.error(`error in GET /recipe/favorites route ${err}`);
    return res.status(500).json({ error: ERROR.SERVER_ERROR });
  }
});

// Add ratings to a recipe
router.post("/ratings/:id", verifyToken, async (req, res) => {
  try {
    const foodieId = req.user._id;
    const foodie = await Foodie.findById(foodieId);
    const { rating } = req.body;

    if (!foodie) {
      return res.status(404).json({ error: ERROR.FOODIE_NOT_FOUND });
    }

    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ error: ERROR.RECIPE_NOT_FOUND });
    }
    // 1. check if already recipe is rated by the foodie, update the same rating
    // 2 else add a new rating
    let index = recipe.ratings.findIndex(
      (el) => el.foodieId.toString() === foodieId
    );

    if (index !== -1) {
      recipe.ratings[index].rating = rating;
    } else {
      recipe.ratings.push({
        foodieId,
        rating,
      });
    }
    await recipe.save();
    return res.status(200).json({ message: MESSAGE.RATING_ADDED });
  } catch (err) {
    logger.error(`error in POST /recipe/ratings route ${err}`);
    return res.status(500).json({ error: ERROR.SERVER_ERROR });
  }
});

// Get RECIPE By Id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: ERROR.RECIPE_NOT_FOUND });
    }
    return res.status(200).json(recipe);
  } catch (err) {
    logger.error(`error in GET /recipe/:id route ${err}`);
    return res.status(500).json({ error: ERROR.SERVER_ERROR });
  }
});

module.exports = router;
