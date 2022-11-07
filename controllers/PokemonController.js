const { Pokemon, User, MarketPokemon } = require("../models");

const getAllPokemons = async (req, res) => {
  try {
    const { page } = req.query;
    const allMarketPokemon = await MarketPokemon.findMany()
    const marketPokemon = await MarketPokemon.findMany({
      skip: page ? (page - 1) * 12 : 0,
      take: page ? 12 : 100,
      include: {
        buyer: {
          include: {
            user: true,
          },
        },
        marketplace: {
          include: {
            seller: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
    marketPokemon.map((item) => {
      delete item.buyer?.user.password;
      delete item.buyer?.user.refresh_token;
      delete item.marketplace.seller.user.password;
      delete item.marketplace.seller.user.refresh_token;
      delete item.marketplace.seller.user.email;
      delete item.marketplace.seller.balance;
      delete item.marketplace.seller.point;
      delete item.marketplace.seller.tier;
      delete item.marketplace.seller.total_sales;
      delete item.marketplace.seller.increment_id;
    });

    return res.status(200).json({
      hasPrevious: page > 1,
      hasNext: marketPokemon.length === 12,
      total: allMarketPokemon.length,
      totalPages: Math.ceil(allMarketPokemon.length / 12),
      results: marketPokemon,
    });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

module.exports = {
  getAllPokemons,
};
