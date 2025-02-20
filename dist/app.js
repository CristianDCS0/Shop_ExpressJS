var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
// Routes
import ProductsRoutes from "./routes/product.routes.js";
import UserRoutes from "./routes/user.routes.js";
import AddressRoute from "./routes/address.route.js";
import CartRoutes from "./routes/cart.route.js";
import { PORT } from "./config/config.js";
export class App {
    constructor() {
        this.settings = () => {
            this.app.use(cors({
                origin: 'https://shop-react-two.vercel.app', // Usa el host del frontend si es distinto utiliza cookies
                credentials: true, // Necesario para cookies en las respuestas CORS
            }));
            dotenv.config(); // Initialize dotenv for environment variables
        };
        this.middlewares = () => {
            this.app.use(express.json());
            this.app.use(cookieParser());
            this.app.use(express.urlencoded({ extended: true })); // Enable parsing of URL-encoded bodies in requests
            this.app.use(morgan("dev")); // Enable logging for development environment
        };
        this.routes = () => {
            this.app.use("/api/v1/users", UserRoutes);
            this.app.use("/api/v1/products", ProductsRoutes);
            this.app.use("/api/v1/address", AddressRoute);
            this.app.use("/api/v1/cart", CartRoutes);
            this.app.get("/", (req, res) => {
                res.send("API RESTful Node.js con Express");
            });
        };
        this.start = () => __awaiter(this, void 0, void 0, function* () {
            this.app.listen(PORT, () => {
                console.log("Server running on http://localhost:" + PORT);
            });
        });
        this.app = express();
        this.settings();
        this.middlewares();
        this.routes();
    }
}
