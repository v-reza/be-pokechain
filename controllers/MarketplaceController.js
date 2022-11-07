const { Pokemon, User, MarketPokemon } = require("../models");

const recentSales = async (req, res) => {
  try {
    const marketPokemon = await MarketPokemon.findMany({
      include: {
        detail_market_pokemon: true,
        buyer: {
          include: {
            user: true,
          },
        },
        seller: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      take: 9,
    });

    marketPokemon.map((item, _) => {
      delete item.seller.user.password;
      delete item.seller.user.refresh_token;
      delete item.buyer?.user.password;
      delete item.buyer?.user.refresh_token;
    });

    return res.status(200).json({ results: marketPokemon });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

module.exports = {
  recentSales,
};
