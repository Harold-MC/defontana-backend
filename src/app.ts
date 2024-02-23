import readline from "readline";
import { initializeDatabase } from "./databaseConfig";
import { DatabaseService } from "./databaseService";
import { MenuCommand } from "./menuCommand";

export async function bootstrap() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const dbConnection = await initializeDatabase();
  const databaseService = new DatabaseService(dbConnection);
  const menu = new MenuCommand(rl, databaseService);

  setTimeout(() => menu.showMenu(dbConnection), 500);
}
