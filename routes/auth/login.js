const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pino = require("pino");
const { ownerLoginSchema } = require("../../validations/ownerValidations");
const { foodieLoginSchema } = require("../../validations/foodieValidations");
const Owner = require("../../models/owner");
const Foodie = require("../../models/foodie");
const ERROR = require("../../enums/Error");
const Roles = require("../../enums/Roles");

const logger = pino({ level: "info" });
const router = express.Router();

// Login Owner
router.post("/owner", async (req, res) => {
  try {
    // 1. validate the payload
    const { error } = ownerLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // 2. Check if email exists
    const { email, password } = req.body;
    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(400).json({ error: ERROR.OWNER_NOT_FOUND });
    }

    // 3. Check if password is correct
    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.status(400).json({ error: ERROR.INVALID_EMAIL_OR_PASSWORD });
    }

    // 4. Generate jwt token and return it
    const token = jwt.sign(
      { _id: owner._id, role: Roles.OWNER, name: owner.name  },
      process.env.JWT_SECRET, 
      { expiresIn: "2d" }
    );

    return res.status(200).json({
      token,
      owner: {
        _id: owner._id,
        name: owner.name,
        email: owner.email,
      },
    });
  } catch (err) {
    logger.error(`error in login route ${err}`);
    res.status(500).json({ error: "Server error" });
  }
});

// Login Foodie
router.post("/foodie", async (req, res) => {
  try {
    // 1. validate the payload
    const { error } = foodieLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // 2. Check if email exists
    const { email, password } = req.body;
    const foodie = await Foodie.findOne({ email });
    if (!foodie) {
      return res.status(400).json({ error: ERROR.FOODIE_NOT_FOUND });
    }

    // 3. Check if password is correct
    const isMatch = await bcrypt.compare(password, foodie.password);
    if (!isMatch) {
      return res.status(400).json({ error: ERROR.INVALID_EMAIL_OR_PASSWORD });
    }

    // 4. Generate jwt token and return it
    const token = jwt.sign(
      { _id: foodie._id, role: Roles.FOODIE, name: foodie.name },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    return res.status(200).json({
      token,
      foodie: {
        _id: foodie._id,
        name: foodie.name,
        email: foodie.email,
      },
    });
  } catch (err) {
    logger.error(`error in login route ${err}`);
    res.status(500).json({ error: "Server error" });
  }
});

// get owner details by ownerId
router.get("/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;
    const owner = await Owner.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ error: ERROR.OWNER_NOT_FOUND });
    }

    return res.status(200).json(owner);
  } catch (err) {
    logger.error(`error in /recipe/owner/:ownerId route ${err}`);
    res.status(500).json({ error: ERROR.SERVER_ERROR });
  }
});

module.exports = router;
