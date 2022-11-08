const {
  Pokemon,
  User,
  MarketPokemon,
  MarketPlace,
  Transaction,
} = require("../models");

const recentSales = async (req, res) => {
  try {
    const marketPokemon = await MarketPokemon.findMany({
      take: 9,
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
      orderBy: {
        created_at: "desc",
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

    return res.status(200).json({ results: marketPokemon });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

const overallStats = async (req, res) => {
  try {
    const user = await User.findMany({
      include: {
        profile: true,
      },
    });
    const transaction = await Transaction.findMany();
    let total_sales = 0;
    let total_volume = 0;
    let pokemon_sold = transaction.length;
    user.map((data) => {
      total_sales += data.profile.total_sales;
    });
    transaction.map((data) => {
      total_volume += data.price;
    });
    return res.status(200).json({ total_sales, total_volume, pokemon_sold });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

module.exports = {
  recentSales,
  overallStats,
};
