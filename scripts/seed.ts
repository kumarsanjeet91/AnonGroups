import { connectToDatabase } from "../src/lib/db";
import { seedDefaultGroups } from "../src/server/seed";

async function main() {
  await connectToDatabase();
  await seedDefaultGroups();
  console.log("Default AnonGroups groups are ready.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
