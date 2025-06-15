const jwt = require("jsonwebtoken");
const ERROR = require("../enums/Error");

module.exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
    
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: ERROR.UNAUTHORIZED });
  }
  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded contains _id and role (we added this in sign())
    next();
  } catch (err) {
    return res.status(401).json({ error: ERROR.INVALID_TOKEN });
  }
};
