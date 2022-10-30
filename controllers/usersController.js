const userGetController = async (req, res) => {
  try {
    return res.status(200).json("controller works");
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  userGetController,
};
