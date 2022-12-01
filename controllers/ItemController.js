const {
  Pokemon,
  User,
  MarketItems,
  MarketBundlesItems,
  MyItems,
} = require("../models");

const getAllItems = async (req, res) => {
  try {
    const { page, sort } = req.query;
    const filterItem = req.query["filter-item"];
    const filterRarity = req.query["filter-rarity"];

    const sortQuery = () => {
      if (sort === "lowest_price") {
        return {
          orderBy: {
            price: "asc",
          },
        };
      } else if (sort === "highest_price") {
        return {
          orderBy: {
            price: "desc",
          },
        };
      } else if (sort === "lowest_id") {
        return {
          orderBy: {
            increment_id: "asc",
          },
        };
      } else if (sort === "highest_id") {
        return {
          orderBy: {
            increment_id: "desc",
          },
        };
      } else if (sort === "latest") {
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
    const findAllMarketItems = await MarketItems.findMany();

    const allMarketItems = await MarketItems.findMany({
      where: {
        name: {
          in: filterItem
            ? filterItem.split(",")
            : findAllMarketItems.map((item) => item.name),
        },
        rarity: {
          in: filterRarity
            ? filterRarity.split(",")
            : findAllMarketItems.map((item) => item.rarity),
        },
      },
      ...sortQuery(),
    });
    const marketItems = await MarketItems.findMany({
      skip: page ? (page - 1) * 12 : 0,
      take: page ? 12 : 100,
      where: {
        name: {
          in: filterItem
            ? filterItem.split(",")
            : findAllMarketItems.map((item) => item.name),
        },
        rarity: {
          in: filterRarity
            ? filterRarity.split(",")
            : findAllMarketItems.map((item) => item.rarity),
        },
      },
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
      ...sortQuery(),
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

const getItemByIncrementId = async (req, res) => {
  try {
    const items = await MarketItems.findUnique({
      where: {
        increment_id: parseInt(req.params.id),
      },
      include: {
        marketplace: {
          include: {
            seller: {
              include: {
                user: true,
              },
            },
          },
        },
        buyer: {
          include: {
            user: true,
          },
        },
      },
    });
    delete items.marketplace.seller.user.password;
    delete items.marketplace.seller.user.refresh_token;
    delete items.buyer?.user.password;
    delete items.buyer?.user.refresh_token;
    delete items.buyer?.balance;
    delete items.buyer?.point;
    delete items.buyer?.tier;
    delete items.buyer?.token;

    return res.status(200).json({ results: items });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

const insertMyItems = async (req, res) => {
  const item = await MarketBundlesItems.findMany({});
  item.map(async (data) => {
    await MyItems.create({
      data: {
        profile_id: "1dbc53ed-d32e-454b-99ea-71a158aae73d",
        name: data.item_name,
        quantity: 1,
      },
    });
  });
};

module.exports = {
  getAllItems,
  getItemByIncrementId,
  insertMyItems,
};
