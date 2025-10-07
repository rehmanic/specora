import sequelize from "./config/database.js";

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully");
    
    await sequelize.sync({ alter: true });
    console.log("✅ Database models synchronized");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}

testConnection();
