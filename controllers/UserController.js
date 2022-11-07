const { User } = require("../models");

const userGetController = async (req, res) => {
  try {
    return res.status(200).json("controller works");
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findFirst({
      where: {
        id,
      },
      include: {
        profile: true,
      },
    });
    if (!user) return res.status(400).json({ msg: "User not found" });
    delete user.password;
    delete user.refresh_token;
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  userGetController,
  getById,
};
