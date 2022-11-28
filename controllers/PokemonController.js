const {
  Pokemon,
  User,
  MarketPokemon,
  MyPokemon,
  MarketPlace,
} = require("../models");

const getAllPokemons = async (req, res) => {
  try {
    const { page, filterSelected, filterElement } = req.query;
    console.log(filterSelected)
    console.log(filterSelected==="lowest_price")
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
    let allMarketPokemon = await MarketPokemon.findMany();
    let resultFilter = [];

    if (filterElement) {
      // split the filterElement string into an array
      filterElement.split(",").map((ele) => resultFilter.push(ele));

      // filter the element and push reverse element contoh : fire,water => water,fire
      filterElement.split(",").map((element, index) => {
        resultFilter.filter((el) => {
          if (!index === 0) {
            resultFilter.push(`${el},${element}`);
            resultFilter.push(`${element},${el}`);
          }
        });
      });

      resultFilter.filter((el) => {
        //check if query element is have comma and > 2 element contoh : fire,water
        if (el.split(",").length === 2) {
          // check if reverse element is same and delete from array
          if (el.split(",").reverse().join(",") === el) {
            resultFilter.splice(resultFilter.indexOf(el), 1);
            resultFilter.splice(
              resultFilter.indexOf(el.split(",").reverse().join(",")),
              1
            );
          }

          //check if element have comma more than 2
        } else if (el.split(",").length > 2) {
          resultFilter = resultFilter.filter((element) => {
            return element !== el;
          });
        }
      });

      allMarketPokemon.map((am) => {
        filterElement.split(",").length > 0
          ? filterElement.split(",").map((ele) => {
              if (am.element.match(`${ele},`)) {
                if (!resultFilter.includes(am.element)) {
                  resultFilter.push(am.element);
                }
              }
            })
          : () => {
              if (am.element.match(`${filterElement},`)) {
                if (!resultFilter.includes(am.element)) {
                  resultFilter.push(am.element);
                }
              }
            };
      });
      allMarketPokemon = await MarketPokemon.findMany({
        where: {
          element: {
            in: resultFilter,
          },
        },
      });
    }

    const marketPokemon = await MarketPokemon.findMany({
      skip: page ? (page - 1) * 12 : 0,
      take: page ? 12 : 100,
      where: {
        element: {
          in: filterElement
            ? resultFilter
            : allMarketPokemon.map((am) => am.element),
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
      ...sortQuery()
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
    console.log(allMarketPokemon.length);

    return res.status(200).json({
      hasPrevious: page > 1,
      hasNext:
        Math.ceil(allMarketPokemon.length / 12) === parseInt(page)
          ? false
          : true,
      total: allMarketPokemon.length || 12,
      totalPages: Math.ceil(allMarketPokemon.length / 12),
      results: marketPokemon,
    });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

const getPokemonByName = async (req, res) => {
  try {
    const pokemonWithEvolution = await Pokemon.findFirst({
      where: {
        name: req.params.name,
      },
      include: {
        pokemon_evolutions: true,
      },
    });

    return res.status(200).json({ results: pokemonWithEvolution });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

const getPokemonByIncrementId = async (req, res) => {
  try {
    const pokemonById = await MarketPokemon.findUnique({
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
      },
    });

    const pokemonWithEvolution = await Pokemon.findFirst({
      where: {
        name: pokemonById.name,
      },
      include: {
        pokemon_evolutions: true,
      },
    });

    return res
      .status(200)
      .json({ results: { pokemonById, pokemonWithEvolution } });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

const insertMarketPokemon = async (req, res) => {
  const pokemon = await Pokemon.findMany({
    take: 40,
  });
  pokemon.map(async (data) => {
    await MarketPokemon.create({
      data: {
        marketplace_id: "a02e1254-6002-4142-9811-7f88ca5b6d16",
        price: 50000,
        name: data.name,
        attack: data.attack,
        defense: data.defense,
        level: data.level,
        element: data.element,
        front_default: data.front_default,
        front_default_gif: data.front_default_gif,
        back_default_gif: data.back_default_gif,
        status: data.status,
        increment_id: Math.floor(Math.random() * 100000),
        health: data.health,
      },
    });
  });

  return res.json({ res: "ok" });
};

module.exports = {
  getAllPokemons,
  getPokemonByName,
  getPokemonByIncrementId,
  insertMarketPokemon,
};
