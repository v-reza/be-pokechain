const { Pokemon, User, MarketToken } = require("../models");

const getAllTokens = async (req, res) => {
  try {
    const { page } = req.query;
    const allMarketToken = await MarketToken.findMany();
    const marketToken = await MarketToken.findMany({
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
    marketToken.map((item) => {
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
      hasNext:
        Math.ceil(allMarketToken.length / 12) === parseInt(page) ? false : true,
      total: allMarketToken.length,
      totalPages: Math.ceil(allMarketToken.length / 12),
      results: marketToken,
    });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

module.exports = {
  getAllTokens,
};
