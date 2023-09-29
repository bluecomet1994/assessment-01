"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
class PhotoController {
    static async getById(req, res) {
        const requestId = req.params.id;
        try {
            const photoResponse = await axios_1.default.get(`${process.env.PHOTO_API}/${requestId}`);
            const _a = photoResponse.data, { albumId } = _a, photo = __rest(_a, ["albumId"]);
            const albumResponse = await axios_1.default.get(`${process.env.ALBUM_API}/${albumId}`);
            const _b = albumResponse.data, { userId } = _b, album = __rest(_b, ["userId"]);
            const userResponse = await axios_1.default.get(`${process.env.USER_API}/${userId}`);
            const userData = userResponse.data;
            res.status(200).json(Object.assign(Object.assign({}, photo), { album: Object.assign(Object.assign({}, album), { user: userData }) }));
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
        ;
    }
    ;
    static async filter(req, res) {
        const title = req.query['title'];
        const albumTitle = req.query['album.title'];
        const userEmail = req.query['album.user.email'];
        const limit = parseInt(req.query['limit'], 10);
        const offset = parseInt(req.query['offset'], 10);
        const defaultOffset = 0;
        const defaultLimit = 25;
        let oneApiData = [];
        try {
            const photoResponse = await axios_1.default.get(`${process.env.PHOTO_API}`);
            const albumResponse = await axios_1.default.get(`${process.env.ALBUM_API}`);
            const userResponse = await axios_1.default.get(`${process.env.USER_API}`);
            photoResponse.data.map(async (item) => {
                const { albumId } = item, photo = __rest(item, ["albumId"]);
                const _a = albumResponse.data.find((album) => album.id === albumId), { userId } = _a, album = __rest(_a, ["userId"]);
                const user = userResponse.data.find((user) => user.id === userId);
                oneApiData.push(Object.assign(Object.assign({}, photo), { album: Object.assign(Object.assign({}, album), { user }) }));
            });
            if (title) {
                oneApiData = oneApiData.filter((data) => data.title.includes(title));
            }
            if (albumTitle) {
                oneApiData = oneApiData.filter((data) => data.album.title.includes(albumTitle));
            }
            if (userEmail) {
                oneApiData = oneApiData.filter((data) => data.album.user.email === userEmail);
            }
            if (offset) {
                oneApiData = oneApiData.slice(offset, limit ? offset + limit : offset + defaultLimit);
            }
            else {
                oneApiData = oneApiData.slice(defaultOffset, limit ? limit : defaultLimit);
            }
            res.status(200).json(oneApiData);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
        ;
    }
    ;
}
exports.default = PhotoController;
;
//# sourceMappingURL=PhotoController.js.map