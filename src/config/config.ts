const PORT = process.env.PORT || 8080;

// config db
const DB = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'express_react',
    connectionLimit: 10
};

export { PORT, DB };