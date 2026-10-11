import {
  registerUser,
  loginUser,
  generateToken,
} from "../services/authService.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
};

const sendUserResponse = (res, user, statusCode = 200) => {
  const token = generateToken(user._id);

  res.cookie("token", token, cookieOptions);

  res.status(statusCode).json({
    token,
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    if (name.trim().length < 2 || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid name and email",
      });
    }

    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 8 and 72 characters",
      });
    }

    const user = await registerUser({
      name: name.trim(),
      email,
      password,
    });

    sendUserResponse(res, user, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await loginUser({ email, password });

    sendUserResponse(res, user);
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const getMe = (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};
