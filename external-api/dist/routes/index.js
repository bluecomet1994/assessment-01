"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const PhotoController_1 = require("../controllers/PhotoController");
const router = express.Router();
router.get('/photos/:id', PhotoController_1.default.getById);
router.get('/photos', PhotoController_1.default.filter);
exports.default = router;
//# sourceMappingURL=index.js.map