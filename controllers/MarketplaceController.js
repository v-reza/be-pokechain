const {
  Pokemon,
  User,
  MarketPokemon,
  MarketPlace,
  ListItems,
  MarketItems,
  MarketBundles,
  MarketToken,
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
        }
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
    const user = await User.findFirst({
      where: {
        username: "gamemaster",
      },
      include: {
        profile: true,
      },
    });
    const profileId = user.profile.id;
    const rateUSDToken = 0.028888;
    new Array(20).fill(0).map(async (_) => {
      const priceRandom = Math.floor(Math.random() * 1000);
      const marketplace = await MarketPlace.update({
        where: {
          seller_id: profileId,
        },
        data: {
          market_token: {
            create: {
              price: priceRandom,
              token: parseFloat((priceRandom * rateUSDToken).toFixed(3)),
              increment_id: Math.floor(Math.random() * 100000),
            },
          },
        },
      });
    });
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
    return res.status(200).json({ msg: "success" });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

module.exports = {
  recentSales,
  dataDummy,
};
