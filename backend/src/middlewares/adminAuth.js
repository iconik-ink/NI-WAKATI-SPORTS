import jwt from "jsonwebtoken";

export const adminAuth = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      message: "Server misconfiguration: JWT_SECRET missing"
    });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Unauthorized: No token provided"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token"
    });
  }
};
