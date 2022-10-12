/* Import Module */
const express = require("express");
const app = express();
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());


app.get("/", async (req, res) => {
    const { user: User } = prisma;
    const { email, username } = req.body;
    const user = await User.create({
      data: {
        email: req.body.email,
        username: "username",
        role: req.body.role,
        password: req.body.password,
        profile: {
          create: {
            fullName: "fullName",
            mypokemon: {
              create: {
                name: "pokemon name",
                url: "string url"
              }
            }
          },
        }
      },
      include: {
        profile: {
          include: {
            mypokemon: true,
          }
        }
      }
    });
    // const user = await User.findMany({
    //   include: {
    //     profile: true
    //   }
    // })
    return res.json(user);
  
});

const port = process.env.PORT || 5000;
/* Listen Application */
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
