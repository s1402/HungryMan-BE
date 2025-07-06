const Joi = require('joi');

const addressSchema = Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().required(),
    country: Joi.string().required()
})

exports.ownerRegisterSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  restaurantName: Joi.string().min(2).required(),
  image: Joi.object({
    url: Joi.string().uri().required(),
    public_id: Joi.string().required()
  }),
  address: addressSchema.required()
});

exports.ownerLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});
