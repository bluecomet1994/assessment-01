"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const routes_1 = require("./routes");
dotenv.config();
const app = express();
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/externalapi', routes_1.default);
app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));
//# sourceMappingURL=index.js.map