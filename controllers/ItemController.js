const { Pokemon, User, MarketItems } = require("../models");

const getAllItems = async (req, res) => {
  try {
    const { page } = req.query;
    const allMarketItems = await MarketItems.findMany();
    const marketItems = await MarketItems.findMany({
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
    marketItems.map((item) => {
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
        Math.ceil(allMarketItems.length / 12) === parseInt(page) ? false : true,
      total: allMarketItems.length,
      totalPages: Math.ceil(allMarketItems.length / 12),
      results: marketItems,
    });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

module.exports = {
  getAllItems,
};