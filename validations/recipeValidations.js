const Joi = require("joi");

exports.recipeSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(3).max(100).required(),
  ingredients: Joi.array().items(Joi.string()).min(1).required(),
  steps: Joi.array().items(Joi.string()).min(2).required(),
  image: Joi.object({
    url: Joi.string().uri().required(),
    public_id: Joi.string().required()
  }),
  tags: Joi.array().items(Joi.string()),
  ownerId: Joi.string().hex().length(24).required() // Mongo ObjectId
});