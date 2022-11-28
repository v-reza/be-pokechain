const { Pokemon, User, MarketBundles } = require("../models");

const getAllBundles = async (req, res) => {
  const {filterSelected,filterItem,filterRarity,page} = req.query
  const sortQuery = () => {
    if (filterSelected === "lowest_price") {
      return {
        orderBy: {
          price: "asc",
        },
      };
    } else if (filterSelected === "highest_price") {
      return {
        orderBy: {
          price: "desc",
        },
      };
    } else if (filterSelected === "lowest_id") {
      return {
        orderBy: {
          increment_id: "asc",
        },
      };
    } else if (filterSelected === "highest_id") {
      return {
        orderBy: {
          increment_id: "desc",
        },
      };
    } else if (filterSelected === "latest") {
      return {
        orderBy: {
          created_at: "desc",
        },
      };
    } else {
      return {
        orderBy: {
          price: "asc",
        },
      };
    }
  };
  try {
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
      ...sortQuery(),
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
        Math.ceil(allMarketBundles.length / 12) === parseInt(page)
          ? false
          : true,
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
