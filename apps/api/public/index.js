"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const uri = process.env.MONGODB_URL;
const allowedUrl = process.env.ALLOWED_URL;
const allowedUrlTest = process.env.ALLOWED_URL_TEST;
const allowedUrl2 = process.env.ALLOWED_URL_2;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    // origin: allowedUrl ? allowedUrl: allowedUrl2,
    origin: allowedUrl,
    methods: 'GET,POST',
    optionsSuccessStatus: 204,
}));
const client = new mongodb_1.MongoClient(uri);
client
    .connect()
    .then(() => {
    console.log('[Connected to MongoDB]');
})
    .catch((err) => {
    console.error('[Error connecting to MongoDB]: ', err);
});
app.post('/recommend', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { animeTags, animeId } = yield req.body;
    if (!animeTags || !animeTags.length || !animeId) {
        console.log(typeof animeId, typeof animeTags);
        return res.status(400).json({
            message: 'Please provide  AnimeTags, and the animeId to proceed with the body',
        });
    }
    try {
        const db = client.db();
        const animeColl = db.collection('anime');
        const animeIdObj = new mongodb_1.ObjectId(animeId);
        const queryAggr = [
            {
                $search: {
                    index: 'tags_anime',
                    autocomplete: { query: animeTags, path: 'tags' },
                },
            },
            {
                $match: {
                    _id: { $ne: animeIdObj },
                },
            },
            { $limit: 50 },
        ];
        const anime = yield animeColl.aggregate(queryAggr).toArray();
        res.json(anime);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong please try again',
        });
    }
}));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(process.env.NODE_ENV);
    const { searchParam } = req.query;
    const db = client.db();
    const AnimeColl = db.collection('anime');
    const query = [
        {
            $search: {
                index: 'synonyms_anime',
                autocomplete: { query: searchParam || 'A', path: 'synonyms' },
            },
        },
        { $limit: 15 },
        { $project: { _id: 1, title: 1, tags: 1, picture: 1 } },
    ];
    const anime = yield AnimeColl.aggregate(query).toArray();
    res.json(anime);
}));
app.listen(3000, () => {
    console.log('[SERVER RUNNIG ON]: 3000');
});
//# sourceMappingURL=index.js.map