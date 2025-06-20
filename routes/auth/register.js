const express = require("express");
const bcrypt = require("bcrypt");

const pino = require("pino");
const { ownerRegisterSchema } = require("../../validations/ownerValidations");
const { foodieRegisterSchema } = require("../../validations/foodieValidations");
const Owner = require("../../models/owner");
const Foodie = require("../../models/foodie");
const ERROR = require("../../enums/Error");
const MESSAGE = require("../../enums/Messages");

const logger = pino({ level: "info" });
const router = express.Router();

// REGISTER Owner
router.post("/owner", async (req, res) => {
  try {
    // 1. validate the payload
    const { error } = ownerRegisterSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    const { name, email, password, restaurantName, address } = req.body;

    // 2. Check if email exists
    const user = await Owner.findOne({ email });
    if (user) {
      return res.status(409).json({ error: ERROR.USER_ALREADY_EXISTS });
    }

    // 3. hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Save to DB
    const newOwner = new Owner({
      name,
      email,
      password: hashedPassword,
      restaurantName,
      address,
    });

    await newOwner.save();

    // 5 output the added owner
    return res.status(201).json({
      message: MESSAGE.OWNER_REGSITERED,
      owner: {
        _id: newOwner._id,
        name: newOwner.name,
        email: newOwner.email,
        restaurantName: newOwner.restaurantName,
      },
    });
  } catch (err) {
    logger.error(`error in register route ${err}`);
    res.status(500).json({ error: ERROR.SERVER_ERROR });
  }
});

// REGISTER fOODIE
router.post("/foodie", async (req, res) => {
  try {
    // 1. validate the payload
    const { error } = foodieRegisterSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    const { name, email, password } = req.body;

    // 2. Check if email exists
    const user = await Foodie.findOne({ email });
    if (user) {
      return res.status(409).json({ error: ERROR.USER_ALREADY_EXISTS });
    }

    // 3. hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Save to DB
    const newFoodie = new Foodie({
      name,
      email,
      password: hashedPassword
    });
    await newFoodie.save();

    // 5 output the added foodie
    return res.status(201).json({
      message: MESSAGE.FOODIE_REGSITERED,
      foodie: {
        _id: newFoodie._id,
        name: newFoodie.name,
        email: newFoodie.email
      },
    });
  } catch (err) {
    logger.error(`error in register route ${err}`);
    res.status(500).json({ error: ERROR.SERVER_ERROR });
  }
});
module.exports = router;
