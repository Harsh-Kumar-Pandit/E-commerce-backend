import jwt from "jsonwebtoken";
import "dotenv/config";

const authUser = (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorized. Login again",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);

    req.user = { id: decoded.id };

    next();
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default authUser;
