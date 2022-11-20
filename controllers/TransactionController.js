const {
  User,
  Profile,
  MarketItems,
  MyItems,
  prisma,
  Transaction,
  TransactionDetailItem,
} = require("../models");
const dotenv = require("dotenv");
const Midtrans = require("midtrans-client");
const axios = require("axios");
dotenv.config();

const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const createTransaction = async (req, res) => {
  try {
    const { userId } = req.user;
    const { item, type } = req.body;
    let rateIDR;

    await axios
      .get(
        "https://openexchangerates.org/api/latest.json?app_id=e0e9bf8de43d4dc5ad938761d4cd928b"
      )
      .then((res) => {
        rateIDR = res.data.rates.IDR;
      });

    const buyer = await Profile.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        user: true,
      },
    });

    const dataMidtrans = {
      transaction_details: {
        order_id: `PK-${Math.floor(Math.random() * 1000)}-${item.increment_id}`,
        gross_amount: parseInt(rateIDR) * parseFloat(item.price),
      },
      item_details: [
        {
          id: item.increment_id,
          name: item.name.replace("-", " ").toUpperCase(),
          quantity: item.quantity,
          price: parseInt(rateIDR) * parseFloat(item.price),
        },
      ],
      customer_details: {
        first_name: "Username : " + buyer.user.username,
        last_name: buyer.user.email,
        email: buyer.user.email,
      },
      custom_field1: userId, //field userId webhooks
      custom_field2: item.increment_id, // field itemId webhooks
      custom_field3: type, //field type market contoh : marketItems, marketPokemon, marketToken
    };

    const createSnapTransaction = await snap.createTransaction(dataMidtrans);

    return res.status(200).json({
      snap_token: createSnapTransaction.token,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const buyItemsByIdWithBalance = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { item } = req.body;
    const profile = await Profile.findUnique({
      where: {
        user_id: userId,
      },
    });
    if (!profile) return res.status(401).send("Unauthorized");

    const marketItem = await MarketItems.findUnique({
      where: {
        increment_id: parseInt(id),
      },
    });

    if (marketItem.buyer_id) return res.status(400).send("Item already sold");
    //update market items
    const updateMarketItems = await MarketItems.update({
      where: {
        increment_id: parseInt(id),
      },
      data: {
        buyer_id: profile.id,
      },
    });

    //update balance profile
    const updateBalanceProfile = await Profile.update({
      where: {
        user_id: userId,
      },
      data: {
        balance: {
          decrement: parseFloat(item.price) * item.quantity,
        },
      },
    });

    const findMyItems = await MyItems.findFirst({
      where: {
        profile_id: profile.id,
        name: item.name,
      },
    });

    if (findMyItems) {
      await MyItems.update({
        where: {
          id: findMyItems.id,
        },
        data: {
          quantity: {
            increment: item.quantity,
          },
        },
      });
    } else {
      await MyItems.create({
        data: {
          profile_id: profile.id,
          name: item.name,
          quantity: item.quantity,
        },
      });
    }
    //update transaction
    const updateTransactionProfile = await Profile.update({
      where: {
        user_id: userId,
      },
      data: {
        transactions: {
          create: {
            order_id: `PK-${Math.floor(Math.random() * 1000)}-${
              item.increment_id
            }`,
            price: parseFloat(item.price) * item.quantity,
            status: "Settlement",
            detail_item: {
              create: {
                name: item.name,
                rarity: item.rarity,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({ message: "Success buy items" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const buyItemsByidWithToken = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { item } = req.body;
    const profile = await Profile.findUnique({
      where: {
        user_id: userId,
      },
    });
    if (!profile) return res.status(401).send("Unauthorized");

    const marketItem = await MarketItems.findUnique({
      where: {
        increment_id: parseInt(id),
      },
    });

    if (marketItem.buyer_id) return res.status(400).send("Item already sold");
    //update market items
    const updateMarketItems = await MarketItems.update({
      where: {
        increment_id: parseInt(id),
      },
      data: {
        buyer_id: profile.id,
      },
    });

    //update token profile
    await Profile.update({
      where: {
        user_id: userId,
      },
      data: {
        token: {
          decrement: parseFloat(item.price) * item.quantity,
        },
      },
    });

    const findMyItems = await MyItems.findFirst({
      where: {
        profile_id: profile.id,
        name: item.name,
      },
    });

    if (findMyItems) {
      await MyItems.update({
        where: {
          id: findMyItems.id,
        },
        data: {
          quantity: {
            increment: item.quantity,
          },
        },
      });
    } else {
      await MyItems.create({
        data: {
          profile_id: profile.id,
          name: item.name,
          quantity: item.quantity,
        },
      });
    }
    //update transaction
    await Profile.update({
      where: {
        user_id: userId,
      },
      data: {
        transactions: {
          create: {
            order_id: `PK-${Math.floor(Math.random() * 1000)}-${
              item.increment_id
            }`,
            price: parseFloat(item.price) * item.quantity,
            status: "Settlement",
            detail_item: {
              create: {
                name: item.name,
                rarity: item.rarity,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({ message: "Success buy items" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const notificationMidtrans = async (req, res) => {
  try {
    const {
      custom_field1: userId,
      custom_field2: itemId,
      custom_field3: type,
      transaction_status,
      order_id,
    } = req.body;

    if (transaction_status == "settlement") {
      if (type === "items") {
        const profile = await Profile.findUnique({
          where: {
            user_id: userId,
          },
        });
        if (!profile) return res.status(401).send("Unauthorized");

        const marketItem = await MarketItems.findUnique({
          where: {
            increment_id: parseInt(itemId),
          },
        });

        if (marketItem.buyer_id)
          return res.status(400).send("Item already sold");

        //update market items
        const updateMarketItems = await MarketItems.update({
          where: {
            increment_id: parseInt(itemId),
          },
          data: {
            buyer_id: profile.id,
          },
        });

        const findMyItems = await MyItems.findFirst({
          where: {
            profile_id: profile.id,
            name: updateMarketItems.name,
          },
        });
        if (findMyItems) {
          await MyItems.update({
            where: {
              id: findMyItems.id,
            },
            data: {
              quantity: {
                increment: updateMarketItems.quantity,
              },
            },
          });
        } else {
          await MyItems.create({
            data: {
              profile_id: profile.id,
              name: updateMarketItems.name,
              quantity: updateMarketItems.quantity,
            },
          });
        }

        //update transaction profile
        await Profile.update({
          where: {
            user_id: userId,
          },
          data: {
            transactions: {
              create: {
                order_id: order_id,
                price:
                  parseFloat(updateMarketItems.price) *
                  updateMarketItems.quantity,
                status: transaction_status.toUpperCase(),
                detail_item: {
                  create: {
                    name: updateMarketItems.name,
                    rarity: updateMarketItems.rarity,
                  },
                },
              },
            },
          },
        });
      }
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const getNotificationMidtrans = async (req, res) => {
  try {
    // const { order_id } = req.params;
    const { type, increment_id, order_id } = req.body;
    const { userId } = req.user;

    const profile = await Profile.findUnique({
      where: {
        user_id: userId,
      },
    });
    if (!profile) return res.status(401).send("Unauthorized");

    if (type === "items") {
      const transaction = await Transaction.findFirst({
        where: {
          order_id,
        },
        include: {
          detail_item: true,
        },
      });

      if (transaction) {
        // get order_id from midtrans
        const MIDTRANS_ENV = process.env.MIDTRANS_ENV;

        if (MIDTRANS_ENV === "sandbox") {
          const getTransactionMidtrans = await axios.get(
            `https://api.sandbox.midtrans.com/v2/${order_id}/status`,
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Basic ${process.env.AUTHORIZATION_CODE}`,
              },
            }
          );
          const { transaction_status } = getTransactionMidtrans.data;
          if (transaction.status.toLowerCase() !== transaction_status) {
            await TransactionDetailItem.delete({
              where: {
                transaction_id: transaction.id,
              }
            })
            await Transaction.delete({
              where: {
                id: transaction.id,
              }
            })
            await MarketItems.update({
              where: {
                increment_id: parseInt(increment_id),
              },
              data: {
                buyer_id: null,
              },
            });
            return res
              .status(200)
              .json({ status: 400, message: "Transaction failed" });
          } else {
            return res
              .status(200)
              .json({ status: 200, message: "Transaction success" });
          }
        }
      }
    }

    // return res.status(200).json({ status: 200, message: "Success" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  createTransaction,
  buyItemsByIdWithBalance,
  buyItemsByidWithToken,
  notificationMidtrans,
  getNotificationMidtrans,
};
