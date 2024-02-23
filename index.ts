import { bootstrap } from "./src/app";
const dotenv = require("dotenv");

dotenv.config();

bootstrap()
  .then(() => {
    console.log("Aplicación iniciada!");
  })
  .catch((error) => {
    console.error("Error al iniciar la aplicación:", error);
  });
