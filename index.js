/* Import Module */
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path")
const dotenv = require("dotenv")
const indexRouter = require("./routes/index");

/* Application Use */
dotenv.config()
app.use(cors());
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.use(`/api/${process.env.API_VERSION}`, indexRouter);
/* Listen Application */
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
