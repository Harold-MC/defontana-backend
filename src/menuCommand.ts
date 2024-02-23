import { ConnectionPool } from "mssql";
import { DatabaseService } from "./databaseService";

export class MenuCommand {
  constructor(private rl: any, private databaseService: DatabaseService) {}

  async showMenu(db: ConnectionPool) {
    console.log("\nElige una opción:");
    console.log("1. Obtener total de ventas de los ultimos 30 dias");
    console.log(
      "2. Obtener dia y hora en que se realizo la venta con el mayor monto"
    );
    console.log(
      "3. Obtener cual es el producto con mayor monto total de ventas"
    );
    console.log(
      "4. Obtener local con mayor monto de ventas y negocio con mayor cantidad de ventas"
    );
    console.log("5. Obtener marca con mayor margen de ganancias");
    console.log("6. Obtener producto que mas se vende por negocio");
    console.log("7. Salir");

    this.rl.question(
      "Introduce el número de tu elección: ",
      async (option: string) => {
        switch (option) {
          case "1": {
            const results = await this.databaseService.getTotalOfLastDays(30);
            console.log(
              `La cantidad de ventas de los ultimos 30 dias es: ${results.quantity} y el total: ${results.total} `
            );
            break;
          }
          case "2": {
            const results = await this.databaseService.getMaxSale();
            console.log(
              `La fecha y hora con el monto mas alto fue ${results.date} con un monto ${results.total}`
            );
            break;
          }
          case "3": {
            const results =
              await this.databaseService.getMaxAmountTotalProduct();
            console.log(
              `El producto con mayor total de ventas es ${results.product} con un monto ${results.total}`
            );
            break;
          }

          case "4": {
            const results1 =
              await this.databaseService.getBusinessWithMaxTotalSale();

            const results2 =
              await this.databaseService.getBusinessWithMaxCountSale();
            console.log(
              `El negocio con el mayor monto total de ventas es ${results1.business} con un monto de ${results1.total}. Y el negocio con la mayor cantidad de ventas es ${results2.business} con ${results2.quantity} ventas`
            );
            break;
          }
          case "5": {
            console.log("Espera algunos segundos...");
            const results = await this.databaseService.getBrandWithMaxProfits();
            console.log(
              `La marca con mayor margen de ganancias es ${results.brand} con unas ganancias de ${results.profits}`
            );
            break;
          }

          case "6": {
            const results =
              await this.databaseService.getProductWithHighestSaleByBusiness();
            console.log(
              "-----------------------------------------------------"
            );
            results.forEach((item) => {
              console.log(
                `Negocio: ${item.business} -> producto: ${item.product}`
              );
            });
            console.log(
              "-----------------------------------------------------"
            );
            break;
          }
          case "7":
            this.rl.close();
            db.close();
            return;
          default:
            console.log("Opción no válida, intenta de nuevo.");
        }

        await this.showMenu(db);
      }
    );
  }
}
