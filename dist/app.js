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
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const uuid_1 = require("uuid");
// Routes
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const address_route_1 = __importDefault(require("./routes/address.route"));
class App {
    constructor(port) {
        this.port = port;
        this.settings = () => {
            this.app.set("port", this.port || process.env.PORT || 8080);
            this.app.use((0, cors_1.default)({
                origin: 'http://localhost:3000', // Usa el puerto del frontend si es distinto
                credentials: true, // Necesario para cookies en las respuestas CORS
            })); // Enable CORS for cross-origin requests
            dotenv_1.default.config(); // Initialize dotenv for environment variables
        };
        this.middlewares = () => {
            this.app.use(express_1.default.json());
            this.app.use(express_1.default.urlencoded({ extended: true })); // Enable parsing of URL-encoded bodies in requests
            this.app.use((0, morgan_1.default)("dev")); // Enable logging for development environment
            this.app.use((0, express_session_1.default)({
                genid: function () {
                    return (0, uuid_1.v4)(); // use uuid for session IDs
                },
                secret: 'JoselynElizabethEstradaBlanco10/04/2003', // Secreto para firmar la sesión
                resave: false,
                saveUninitialized: true,
                cookie: {
                    secure: false, // Si estás usando http (no https), debe ser false
                }
            }));
        };
        this.routes = () => {
            this.app.use("/api/v1/users", user_routes_1.default);
            this.app.use("/api/v1/products", product_routes_1.default);
            this.app.use("/api/v1/address", address_route_1.default);
            this.app.get("/", (req, res) => {
                res.send("API RESTful Node.js con Express");
            });
        };
        this.start = () => __awaiter(this, void 0, void 0, function* () {
            this.app.listen(this.app.get("port"), () => {
                console.log("Server running on http://localhost:" + this.app.get("port"));
            });
        });
        this.app = (0, express_1.default)();
        this.settings();
        this.middlewares();
        this.routes();
    }
}
exports.App = App;
