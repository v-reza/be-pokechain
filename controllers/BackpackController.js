const { Profile, MarketPlace, User, ActivityToken } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getBackpackPokemon = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await Profile.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        my_pokemons: {
          where: {
            is_sell: false,
          },
          include: {
            detail_pokemon: true,
          },
        },
      },
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const getBackpackItems = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await Profile.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        my_items: true,
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const sellBackpackItems = async (req, res) => {
  try {
    const { userId } = req.user;
    const { name, price, quantity, rarity, id } = req.body;
    const profile = await Profile.findUnique({
      where: {
        user_id: userId,
      },
    });
    if (!profile) return res.status(401).send("Unauthorized");

    const marketplace = await MarketPlace.upsert({
      where: {
        seller_id: profile.id,
      },
      create: {
        seller_id: profile.id,
        market_items: {
          create: {
            name,
            price,
            rarity,
            quantity,
            increment_id: Math.floor(Math.random() * 100000),
          },
        },
      },
      update: {
        market_items: {
          create: {
            name,
            price,
            rarity,
            quantity,
            increment_id: Math.floor(Math.random() * 100000),
          },
        },
      },
    });

    if (marketplace) {
      await Profile.update({
        where: {
          user_id: userId,
        },
        data: {
          my_items: {
            update: {
              where: {
                id,
              },
              data: {
                quantity: {
                  decrement: quantity,
                },
              },
            },
          },
        },
      });
    }

    return res
      .status(200)
      .json({ msg: "Your item success for sell", marketplace });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const verifyPassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const profile = await Profile.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        user: true,
      },
    });
    //checked password
    const isPassword = await bcrypt.compare(
      req.body.password,
      profile.user.password
    );
    if (!isPassword)
      return res
        .status(400)
        .json({ status: 400, msg: "Password is incorrect" });

    return res.status(200).json({ status: 200, msg: "Password is correct" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const convertBalanceToToken = async (req, res) => {
  try {
    const { userId: userAsJwt } = req.user;
    const { balance, rateToken } = req.body;
    const findProfile = await Profile.findUnique({
      where: {
        user_id: userAsJwt,
      },
    });

    if (!findProfile) return res.status(401).send("Unauthorized");

    const convert = await Profile.update({
      where: {
        user_id: userAsJwt,
      },
      data: {
        balance: {
          decrement: parseFloat(balance),
        },
        token: {
          increment: parseFloat(balance * rateToken),
        },
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    // update the access token & refresh token
    const { id: userId, username, email, profile } = convert.user;

    const refreshToken = jwt.sign(
      { userId, email, username, profile },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const activityUser = await User.update({
      where: {
        id: convert.user.id,
      },
      data: {
        refresh_token: refreshToken,
        profile: {
          update: {
            activity_token: {
              create: {
                activity_id: `0x${Math.floor(Math.random() * 100000)}`,
                status: "convert",
                old_volume_balance: parseFloat(findProfile.balance),
                old_volume_token: parseFloat(findProfile.token),
                new_volume_balance: parseFloat(convert.balance),
                new_volume_token: parseFloat(convert.token),
              },
            },
          },
        },
      },
    });

    const userUpdated = await User.findUnique({
      where: {
        id: activityUser.id,
      },
      include: {
        profile: true,
      },
    });

    const accessToken = jwt.sign(
      {
        userId: userUpdated.id,
        email: userUpdated.email,
        username: userUpdated.username,
        refresh_token: userUpdated.refresh_token,
        profile: userUpdated.profile,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );

    return res.status(200).json({ msg: "Convert success", accessToken });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const convertTokenToBalance = async (req, res) => {
  try {
    const { userId: userAsJwt } = req.user;
    const { token, rateToken } = req.body;
    const findProfile = await Profile.findUnique({
      where: {
        user_id: userAsJwt,
      },
    });

    if (!findProfile) return res.status(401).send("Unauthorized");

    const convert = await Profile.update({
      where: {
        user_id: userAsJwt,
      },
      data: {
        balance: {
          increment: parseFloat(token / rateToken),
        },
        token: {
          decrement: parseFloat(token),
        },
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    // update the access token & refresh token
    const { id: userId, username, email, profile } = convert.user;

    const refreshToken = jwt.sign(
      { userId, email, username, profile },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const activityUser = await User.update({
      where: {
        id: convert.user.id,
      },
      data: {
        refresh_token: refreshToken,
        profile: {
          update: {
            activity_token: {
              create: {
                activity_id: `0x${Math.floor(Math.random() * 100000)}`,
                status: "convert",
                old_volume_balance: parseFloat(findProfile.balance),
                old_volume_token: parseFloat(findProfile.token),
                new_volume_balance: parseFloat(convert.balance),
                new_volume_token: parseFloat(convert.token),
              },
            },
          },
        },
      },
    });

    const userUpdated = await User.findUnique({
      where: {
        id: activityUser.id,
      },
      include: {
        profile: true,
      },
    });

    const accessToken = jwt.sign(
      {
        userId: userUpdated.id,
        email: userUpdated.email,
        username: userUpdated.username,
        refresh_token: userUpdated.refresh_token,
        profile: userUpdated.profile,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );

    return res.status(200).json({ msg: "Convert success", accessToken });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const getActivityToken = async (req, res) => {
  try {
    const { userId } = req.user;
    const profile = await Profile.findUnique({
      where: {
        user_id: userId,
      },
    });
    const activityToken = await ActivityToken.findMany({
      where: {
        profile_id: profile.id,
      },
    });

    return res.status(200).json(activityToken);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const sellBackpackToken = async (req, res) => {
  try {
    const { userId } = req.user;
    const { token, rateToken } = req.body;
    const profile = await Profile.findUnique({
      where: {
        user_id: userId,
      },
    });
    const marketplace = await MarketPlace.upsert({
      where: {
        seller_id: profile.id,
      },
      create: {
        seller_id: profile.id,
        market_token: {
          create: {
            token: parseFloat(token),
            price: parseFloat(token / rateToken),
            increment_id: Math.floor(Math.random() * 100000),
          },
        },
      },
      update: {
        market_token: {
          create: {
            token: parseFloat(token),
            price: parseFloat(token / rateToken),
            increment_id: Math.floor(Math.random() * 100000),
          },
        },
      },
    });
    if (!marketplace) return res.status(401).send("Unauthorized");
    
    const updateProfile = await Profile.update({
      where: {
        user_id: userId,
      },
      data: {
        token: {
          decrement: parseFloat(token),
        },
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
    const refreshToken = jwt.sign(
      {
        userId: updateProfile.user.id,
        username: updateProfile.user.username,
        email: updateProfile.user.email,
        profile: updateProfile.user.profile,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const activityUser = await User.update({
      where: {
        id: updateProfile.user.id,
      },
      data: {
        refresh_token: refreshToken,
        profile: {
          update: {
            activity_token: {
              create: {
                activity_id: `0x${Math.floor(Math.random() * 100000)}`,
                new_volume_balance: parseFloat(updateProfile.balance),
                new_volume_token: parseFloat(updateProfile.token),
                old_volume_balance: parseFloat(profile.balance),
                old_volume_token: parseFloat(profile.token),
                status: "sell",
              },
            },
          },
        },
      },
    });
    const userUpdated = await User.findUnique({
      where: {
        id: activityUser.id,
      },
      include: {
        profile: true,
      },
    });
    const accessToken = jwt.sign(
      {
        userId: userUpdated.id,
        email: userUpdated.email,
        username: userUpdated.username,
        refresh_token: userUpdated.refresh_token,
        profile: userUpdated.profile,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "20s" }
    );
    return res.status(200).json({ msg: "Sell success", accessToken });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  getBackpackPokemon,
  getBackpackItems,
  sellBackpackItems,
  verifyPassword,
  convertBalanceToToken,
  convertTokenToBalance,
  getActivityToken,
  sellBackpackToken,
};
