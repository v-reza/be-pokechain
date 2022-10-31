/* Import Module */
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const indexRouter = require("./routes/index");
const { allowedOrigins } = require("./config/rootConfig");

/* Application Use */
dotenv.config();
app.use(cors({ credentials: true, origin: allowedOrigins }));
app.use(cookieParser());
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.use(`/api/${process.env.API_VERSION}`, indexRouter);
/* Listen Application */
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
