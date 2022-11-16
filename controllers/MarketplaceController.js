const {
  Pokemon,
  User,
  MarketPokemon,
  MarketPlace,
  ListItems,
  MarketItems,
  MarketBundles,
  MarketToken,
  Transaction,
  Sales,
} = require("../models");

const recentSales = async (req, res) => {
  try {
    const { type } = req.query;
    let marketplace;
    if (type === "pokemon") {
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

      marketplace = marketPokemon;
    } else if (type === "items") {
      const marketItem = await MarketItems.findMany({
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

      marketplace = marketItem;
    } else if (type === "bundles") {
      const marketBundles = await MarketBundles.findMany({
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
          bundles_items: true,
        },
        orderBy: {
          created_at: "desc",
        },
      });
      marketplace = marketBundles;
    } else if (type === "token") {
      const marketToken = await MarketToken.findMany({
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
      marketplace = marketToken;
    } else {
      return res.status(400).json({ msg: "Type not found" });
    }

    marketplace.map((item) => {
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
    return res.status(200).json({ results: marketplace });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

const dataDummy = async (req, res) => {
  try {
    // const items = await MarketItems.findMany()

    // const itemName = []
    // const itemQty = []
    // const listItem = []

    // // map items and filter not duplicate name
    // items.map((item) => {
    //   if (!itemName.includes(item.name)) {
    //     itemName.push(item.name)
    //     itemQty.push(items.filter((i) => i.name === item.name).length)
    //   }
    // })

    // itemName.map((name, index) => {
    //   listItem.push({
    //     name,
    //     qty: itemQty[index]
    //   })
    // })

    // listItem.map(async (item) => {
    //   await User.update({
    //     where: {
    //       username: "wildan"
    //     },
    //     data: {
    //       profile: {
    //         update: {
    //           my_items: {
    //             create: {
    //               quantity: item.qty,
    //               name: item.name,
    //             }
    //           }
    //         }
    //       }
    //     }
    //   })
    // })

    // const item = [
    //   {
    //     types: ["awakening", "full-heal", "master-ball", "max-revive"],
    //   },
    //   {
    //     types: ["medium-ball", "master-ball"],
    //   },
    //   {
    //     types: [
    //       "potion",
    //       "protein",
    //       "revive",
    //       "ultra-ball",
    //       "x-attack",
    //       "x-defense",
    //     ],
    //   },
    //   {
    //     types: ["awakening", "protein", "master-ball", "ultra-ball"],
    //   },
    //   {
    //     types: ["revive", "x-attack", "medium-ball", "max-revive", "full-heal"],
    //   },
    //   {
    //     types: ["master-ball", "medium-ball", "ultra-ball"],
    //   },
    // ];
    // const user = await User.findFirst({
    //   where: {
    //     username: "gamemaster",
    //   },
    //   include: {
    //     profile: true,
    //   },
    // });
    // const profileId = user.profile.id;
    // const rateUSDToken = 0.028888;
    // new Array(20).fill(0).map(async (_) => {
    //   const priceRandom = Math.floor(Math.random() * 1000);
    //   const marketplace = await MarketPlace.update({
    //     where: {
    //       seller_id: profileId,
    //     },
    //     data: {
    //       market_token: {
    //         create: {
    //           price: priceRandom,
    //           token: parseFloat((priceRandom * rateUSDToken).toFixed(3)),
    //           increment_id: Math.floor(Math.random() * 100000),
    //         },
    //       },
    //     },
    //   });
    // });
    // item.map(async (item) => {
    //   const marketplace = await MarketPlace.update({
    //     where: {
    //       seller_id: profileId
    //     },
    //     data: {
    //       market_bundles: {
    //         create: {
    //           price: Math.floor(Math.random() * 10000),
    //           increment_id: Math.floor(Math.random() * 100000),
    //         }
    //       }
    //     },
    //     include: {
    //       market_bundles: true,

    //     }
    //   })
    //   item.types.map(async (type) => {
    //     const listItem = await ListItems.findFirst({
    //       where: {
    //         name: type
    //       }
    //     })
    //     marketplace.market_bundles.map(async (bundle) => {
    //       const marketBundle = await MarketBundles.update({
    //         where: {
    //           id: bundle.id
    //         },
    //         data: {
    //           bundles_items: {
    //             create: {
    //               item_name: listItem.name,
    //               rarity: listItem.rarity,
    //             }
    //           }
    //         }
    //       })
    //     })
    //   })
    // })
    // item.map(async (item) => {
    //   item.types.map(async (types) => {
    //     const listItem = await ListItems.findFirst({
    //       where: {
    //         name: types,
    //       },
    //     });
    //     const marketplace = await MarketPlace.update({
    //       where: {
    //         seller_id: profileId,
    //       },
    //       data: {
    //         market_items: {
    //           create: {
    //             name: listItem.name,
    //             price: Math.floor(Math.random() * 1000),
    //             rarity: listItem.rarity,
    //           },
    //         },
    //       },
    //     });
    //   });
    // });
    // const marketItem = await MarketItems.findMany()
    // marketItem.map(async (item) => {
    //   await MarketItems.update({
    //     where: {
    //       id: item.id
    //     },
    //     data: {
    //       increment_id: Math.floor(Math.random() * 100000)
    //     }
    //   })
    // })
    return res.status(200).json({ msg: "success", listItem });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

const overallStats = async (req, res) => {
  try {
    const { selected } = req.query;
    const sales = await Sales.findMany();
    const transaction = await Transaction.findMany();

    let total_sales = 0;
    let total_volume = 0;
    let pokemon_sold = 0;

    if (selected == "24H") {
      sales
        .filter(
          (sales) =>
            new Date(sales.created_at).getTime() >
            new Date().getTime() - 24 * 60 * 60 * 1000
        )
        .map((data) => {
          total_sales += data.sales;
        });
      transaction
        .filter(
          (transaction) =>
            new Date(transaction.created_at).getTime() >
            new Date().getTime() - 24 * 60 * 60 * 1000
        )
        .map((data) => {
          pokemon_sold += 1;
          total_volume += data.price;
        });
    } else if (selected == "7D") {
      sales
        .filter(
          (sales) =>
            new Date(sales.created_at).getTime() >
            new Date().getTime() - 7 * 24 * 60 * 60 * 1000
        )
        .map((data) => {
          total_sales += data.sales;
        });
      transaction
        .filter(
          (transaction) =>
            new Date(transaction.created_at).getTime() >
            new Date().getTime() - 7 * 24 * 60 * 60 * 1000
        )
        .map((data) => {
          pokemon_sold += 1;
          total_volume += data.price;
        });
    } else if (selected == "30D") {
      sales
        .filter(
          (sales) =>
            new Date(sales.created_at).getTime() >
            new Date().getTime() - 30 * 24 * 60 * 60 * 1000
        )
        .map((data) => {
          total_sales += data.sales;
        });
      transaction
        .filter(
          (transaction) =>
            new Date(transaction.created_at).getTime() >
            new Date().getTime() - 30 * 24 * 60 * 60 * 1000
        )
        .map((data) => {
          pokemon_sold += 1;
          total_volume += data.price;
        });
    } else {
      sales.map((data) => {
        total_sales += data.sales;
      });
      transaction.map((data) => {
        pokemon_sold += 1;
        total_volume += data.price;
      });
    }

    return res.status(200).json({
      total_sales,
      total_volume,
      pokemon_sold,
    });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

const recentListings = async (req, res) => {
  try {
    const { type } = req.query;
    let marketplace;
    if (type === "pokemon") {
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
      });

      marketplace = marketPokemon;
    } else if (type === "items") {
      const marketItem = await MarketItems.findMany({
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
      });

      marketplace = marketItem;
    } else if (type === "bundles") {
      const marketBundles = await MarketBundles.findMany({
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
          bundles_items: true,
        },
      });
      marketplace = marketBundles;
    } else if (type === "token") {
      const marketToken = await MarketToken.findMany({
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
      });
      marketplace = marketToken;
    } else {
      return res.status(400).json({ msg: "Type not found" });
    }

    marketplace.map((item) => {
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
    return res.status(200).json({ results: marketplace });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

const topSales = async (req, res) => {
  try {
    const marketPokemon = await MarketPokemon.findMany() 
    return res.status(200).json({ marketPokemon });
  } catch (error) {}
};

module.exports = {
  recentSales,
  overallStats,
  recentListings,
  topSales,
  dataDummy,
};
