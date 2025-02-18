import express, {Application} from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import {v4 as uuidv4} from 'uuid';

// Routes
import ProductsRoutes from "./routes/product.routes.js";
import UserRoutes from "./routes/user.routes.js";
import AddressRoute from "./routes/address.route.js";
import CartRoutes from "./routes/cart.route.js";
import {PORT} from "./config/config.js";

export class App {
    private app: Application;
    constructor() {
        this.app = express();
        this.settings();
        this.middlewares();
        this.routes();
    }
    settings = () => {
        this.app.use(cors({
            origin: '*', // Usa el puerto del frontend si es distinto
            // credentials: true, Necesario para cookies en las respuestas CORS
            methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
            allowedHeaders: ['Content-Type', 'Authorization'],
        }));
        dotenv.config(); // Initialize dotenv for environment variables
    };
    middlewares = () => {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true })); // Enable parsing of URL-encoded bodies in requests
        this.app.use(morgan("dev")); // Enable logging for development environment
    };
    routes = () => {
        this.app.use("/api/v1/users", UserRoutes);
        this.app.use("/api/v1/products", ProductsRoutes);
        this.app.use("/api/v1/address", AddressRoute);
        this.app.use("/api/v1/cart", CartRoutes);
        this.app.get("/", (req, res) => {
            res.send("API RESTful Node.js con Express");
        });
    };

    start = async () => {
        this.app.listen(PORT, () => {
            console.log("Server running on http://localhost:" + PORT);
        });
    };
}