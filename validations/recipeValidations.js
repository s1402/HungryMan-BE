const Joi = require("joi");

exports.recipeSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().min(3).max(200).required(),
  ingredients: Joi.array().items(Joi.string()).min(1).required(),
  steps: Joi.array().items(Joi.string()).min(1).required(),
  image: Joi.object({
    url: Joi.string().uri().required(),
    public_id: Joi.string().required()
  }),
  tags: Joi.array().items(Joi.string()),
  vegetarian: Joi.boolean().default(false),
  ownerId: Joi.string().hex().length(24).required() // Mongo ObjectId
});