import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import { signinSchema, signupSchema } from "../validation/validation.js";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { success } from "zod";

//Route for user login
const loginUser = async (req, res) => {
  try {
    //zod
    const parsedData = signinSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        errors: parsedData.error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }

    //in variable store
    const { email, password } = parsedData.data;

    const user = await userModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not Found",
      });
    }

    //hased compare
    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    //token
    const token = jwt.sign({ id: user._id }, process.env.JWT_USER_SECRET, {
      expiresIn: "1d",
    });

    
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });


    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const registerUser = async (req, res) => {
  try {
    //zod validation
    const validateData = signupSchema.safeParse(req.body);

    if (!validateData.success) {
      return res.status(400).json({
        success: false,
        message: validateData.error.errors[0].message,
      });
    }

    const { name, email, password } = validateData.data;

    const existing = await userModel.findOne({ email });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email alerady used",
      });
    }

    //Hased Password
    const hasedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      name,
      password: hasedPassword,
      email,
    });

    res.json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_ADMIN_SECRET);
      res.status(200).json({
        success: true,
        token,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Admin not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export { loginUser, registerUser, adminLogin };
