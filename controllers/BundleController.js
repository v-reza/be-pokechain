const { Pokemon, User, MarketBundles } = require("../models");

const getAllBundles = async (req, res) => {
  try {
    const { page } = req.query;
    const allMarketBundles = await MarketBundles.findMany();
    const marketBundles = await MarketBundles.findMany({
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
        bundles_items:true
      },
    });
    marketBundles.map((item) => {
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
        Math.ceil(allMarketBundles.length / 12) === parseInt(page) ? false : true,
      total: allMarketBundles.length,
      totalPages: Math.ceil(allMarketBundles.length / 12),
      results: marketBundles,
    });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

module.exports = {
  getAllBundles,
};
