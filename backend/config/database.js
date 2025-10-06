import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Create Sequelize instance
export const sequelize = new Sequelize(
  process.env.DB_NAME || "specora_db",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "postgres",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Test database connection
export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully");
    
    // Sync models in development (create tables if they don't exist)
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("✅ Database models synchronized");
    }
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
    process.exit(1);
  }
}

export default sequelize;
