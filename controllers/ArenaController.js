const {
  Pokemon,
  User,
  MarketToken,
  Arena,
  ArenaChallenge,
  MyArenaIsComplete,
  Profile,
  MyItems,
} = require("../models");

const getArenaTier = async (req, res) => {
  try {
    const { userId } = req.user;
    const profile = await Profile.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        my_arena_is_complete: true,
      },
    });

    if (!profile) return res.status(401).send("Unauthorized");

    const arena = await Arena.findFirst({
      where: {
        tier: profile.tier,
      },
      include: {
        arena_challenge: true,
      },
    });
    const completeArena = [];
    if (profile.my_arena_is_complete.length > 0) {
      arena.arena_challenge.filter((challenge) => {
        profile.my_arena_is_complete.filter((complete) => {
          if (challenge.id === complete.arena_challenge_id) {
            completeArena.push(complete);
          }
        });
      });
    }
    return res.status(200).json({ arena, completeArena });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateLoginReward = async (req, res) => {
  try {
    const { userId } = req.user;
    const profile = await Profile.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        my_arena_is_complete: true
      }
    });
    if (!profile) return res.status(401).send("Unauthorized");
    const arena = await Arena.findFirst({
      where: {
        tier: profile.tier
      },
      include: {
        arena_challenge: true
      }
    })

    arena.arena_challenge.map(async (c, i) => {
      if (c.challenge === "Login the game") {
        const myArena = await MyArenaIsComplete.findFirst({
          where: {
            arena_challenge_id: c.id,
            profile_id: profile.id,
          }
        })
        if (!myArena) {
          await MyArenaIsComplete.create({
            data: {
              arena_challenge_id: c.id,
              profile_id: profile.id,
              is_claimed: false
            }
          })
        }
      }
    })

    return res.status(200).json({ message: "Success update login reward" })

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const claimRewardToBackpack = async (req, res) => {
  try {
    const { userId } = req.user;
    const { arenaChallengeId, items } = req.body;
    console.log(req.body);
    const profile = await Profile.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!profile) return res.status(401).send("Unauthorized");

    const myArena = await MyArenaIsComplete.findFirst({
      where: {
        arena_challenge_id: arenaChallengeId,
        is_claimed: false,
      },
    });

    if (!myArena) return res.status(404).send("Reward Arena not found");

    await MyArenaIsComplete.update({
      where: {
        id: myArena.id,
      },
      data: {
        is_claimed: true,
      },
    });

    items.map(async (item, i) => {
      const myItems = await MyItems.findFirst({
        where: {
          name: item.name,
          profile_id: profile.id,
        },
      });
      if (myItems) {
        await MyItems.update({
          where: {
            id: myItems.id,
          },
          data: {
            quantity: myItems.quantity + 1,
          },
        });
      } else {
        await MyItems.create({
          data: {
            name: item.name,
            quantity: 1,
            profile_id: profile.id,
          },
        });
      }
    });

    return res.status(200).json({ message: "Success claim reward" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const postArena = async (req, res) => {
  try {
    const arena = await Arena.create({
      data: {
        tier: 1,
        arena_challenge: {
          createMany: {
            data: [
              {
                challenge: "Login the game",
              },
              {
                challenge: "Win the match 1",
              },
              {
                challenge: "Win the match 2",
              },
              {
                challenge: "Play with pokemon grass",
              },
              {
                challenge: "Play with pokemon fire",
              },
              {
                challenge: "Play with pokemon water & fire",
              },
              {
                challenge: "Buy the pokemon on marketplace",
              },
            ],
          },
        },
      },
      include: {
        arena_challenge: true,
      },
    });

    return res.status(200).json({ arena });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  postArena,
  getArenaTier,
  claimRewardToBackpack,
  updateLoginReward
};
