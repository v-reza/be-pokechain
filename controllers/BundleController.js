const {
  Pokemon,
  User,
  MarketBundles,
  MarketBundlesItems,
} = require("../models");

const getAllBundles = async (req, res) => {
  try {
    let marketBundlesFiltered = [];
    const marketBundleIdFiltered = [];
    console.log(marketBundleIdFiltered);
    const { filterSelected, filterItem, filterRarity, page } = req.query;
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

    let allMarketBundles = await MarketBundles.findMany();
    let marketBundles = await MarketBundles.findMany({
      skip: page ? (page - 1) * 12 : 0,
      take: page ? 12 : 100,
      include: {
        bundles_items: true,
      },
      ...sortQuery(),
    });

    if (filterItem) {
      marketBundles.map((data) => {
        data.bundles_items.map((item) => {
          if (filterItem.split(",").includes(item.item_name)) {
            marketBundleIdFiltered.push(item.marketbundle_id);
            if (marketBundleIdFiltered.length > 0) {
              if (marketBundleIdFiltered.includes(data.id)) {
                marketBundlesFiltered.push(data);
              }
            }
          }
        });
      });

      marketBundles = marketBundlesFiltered.filter(
        (a, b, arr) => arr.indexOf(a) === b
      );
      allMarketBundles = marketBundlesFiltered.filter(
        (a, b, arr) => arr.indexOf(a) === b
      );
    }

    if (filterRarity) {
      marketBundles.map((data) => {
        data.bundles_items.map((item) => {
          if (filterRarity.split(",").includes(item.rarity)) {
            marketBundleIdFiltered.push(item.marketbundle_id);
            if (marketBundleIdFiltered.length > 0) {
              if (marketBundleIdFiltered.includes(data.id)) {
                marketBundlesFiltered.push(data);
              }
            }
          }
        });
      });

      marketBundles = marketBundlesFiltered.filter(
        (a, b, arr) => arr.indexOf(a) === b
      );
      allMarketBundles = marketBundlesFiltered.filter(
        (a, b, arr) => arr.indexOf(a) === b
      );
    }

    return res.status(200).json({
      hasPrevious: page > 1,
      hasNext:
        Math.ceil(allMarketBundles.length / 12) === parseInt(page)
          ? false
          : true,
      total: allMarketBundles.length,
      totalPages: Math.ceil(allMarketBundles.length / 12),
      results: marketBundles,
      marketBundleIdFiltered,
    });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

const getBundleByIncrementId = async (req, res) => {
  try {
    const bundleByIncrementId = await MarketBundles.findUnique({
      where: {
        increment_id: parseInt(req.params.incrementId),
      },
      include: {
        bundles_items: true,
      },
    });

    return res.status(200).json({ results: { bundleByIncrementId } });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

const getBundleItemById = async (req, res) => {
  try {
    const bundleItemById = await MarketBundlesItems.findUnique({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).json({ results: { bundleItemById } });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

module.exports = {
  getAllBundles,
  getBundleByIncrementId,
  getBundleItemById,
};
