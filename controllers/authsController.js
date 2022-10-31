const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (password != confirmPassword)
    return res.status(400).json({ msg: "Password and confirm don't match" });

  try {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const users = await User.create({
      data: {
        username: username,
        email: email,
        password: hashPassword,
      },
    });
    res.status(200).json({ msg: "Register Successful", user: users });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findFirst({
      where: {
        OR: [
          { email: req.body.userOrEmail },
          { username: req.body.userOrEmail },
        ],
      },
    });

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });

    const { userId, userName, userEmail } = user;
    const accessToken = jwt.sign(
      { userId, userEmail, userName },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );

    const refreshToken = jwt.sign(
      { userId, userEmail, userName },
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
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const user = await User.findFirst({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user) return res.sendStatus(204);

    const userId = user.id;
    await User.update({
      where: {
        id: userId,
      },
      data: {
        refresh_token: null,
      },
    });
    res.clearCookie("refreshToken");
    return res.status(200).json({msg: "Logout Successful",});
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    const user = await User.findFirst({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const { userId, userName, userEmail } = user;
        const accessToken = jwt.sign(
          { userId, userName, userEmail },
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
