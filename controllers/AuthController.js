const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config()

const register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (password != confirmPassword)
    return res.status(400).json({ msg: "Password and confirm don't match" });

  try {
    const haveUser = await User.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      }
    })
    if (haveUser) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const users = await User.create({
      data: {
        username: username,
        email: email,
        password: hashPassword,
        profile: {
          create: {
            balance: 0
          }
        }
      },
      include: {
        profile: true
      }
    });
    delete users.password
    res.status(200).json({ msg: "Register Successful", user: users });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

const login = async (req, res) => {
  try {
    const { userOrEmail, password } = req.body;
    const user = await User.findFirst({
      where: {
        OR: [{ email: userOrEmail }, { username: userOrEmail }],
      },
      include: {
        profile: true
      }
    });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });

    const { id: userId, username, email, profile } = user;
    const accessToken = jwt.sign(
      { userId, email, username, profile },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );

    const refreshToken = jwt.sign(
      { userId, email, username, profile },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await User.update({
      where: {
        id: userId,
      },
      data: {
        refresh_token: refreshToken,
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

const logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const user = await User.findFirst({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user) return res.sendStatus(204);

    await User.update({
      where: {
        id: user.id,
      },
      data: {
        refresh_token: null,
      },
    });
    res.clearCookie("refreshToken");
    return res.status(200).json({ msg: "Logout Successful" });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.sendStatus(401);

    const user = await User.findFirst({
      where: {
        refresh_token: refreshToken,
      },
      include: {
        profile: true
      }
    });
    if (!user) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const { id: userId, username, email, profile } = user;
        const accessToken = jwt.sign(
          { userId, username, email, profile },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "15s",
          }
        );
        res.json({ accessToken });
      }
    );
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

module.exports = {
  login,
  register,
  logout,
  refreshToken,
};
