const { seedRoles } = require("./roleSeeder");
const { seedUsers } = require("./userSeeder");

const runSeeders = async () => {
  try {
    console.log("Starting database seeding...");

    await seedRoles();

    await seedUsers();

    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Database seeding failed:", error);
    throw error;
  }
};

module.exports = { runSeeders };
