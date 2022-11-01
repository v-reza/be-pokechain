const pokemonsGetController = async (req, res) => {
  try {
    return res.status(200).json({ msg: "Controllers Works" });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

module.exports = {
  pokemonsGetController,
};
