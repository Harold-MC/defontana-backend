import { ConnectionPool } from "mssql";

export class DatabaseService {
  constructor(private dbConnection: ConnectionPool) {}

  async getTotalOfLastDays(
    days: number
  ): Promise<{ quantity: number; total: number }> {
    const result = await this.dbConnection.query(
      `select sum(Total) as total, count(*) as quantity from Venta where Fecha >= DATEADD(DAY, -${days}, GETDATE())`
    );
    return result.recordset[0];
  }

  async getMaxSale(): Promise<{ total: number; date: string }> {
    const result = await this.dbConnection.query(
      `select top 1 Total as total, Fecha as date 
      from Venta 
      order by total DESC`
    );
    return result.recordset[0];
  }

  async getMaxAmountTotalProduct(): Promise<{
    product: string;
    total: number;
  }> {
    const result = await this.dbConnection
      .query(`select p.Nombre as product, sum(vd.TotalLinea) as total from VentaDetalle vd 
    left join Producto p on p.ID_Producto = vd.ID_Producto  
    group by vd.ID_Producto, p.Nombre 
    order by sum(vd.TotalLinea) desc`);

    return result.recordset[0];
  }

  async getBusinessWithMaxTotalSale(): Promise<{
    total: number;
    business: string;
  }> {
    const result = await this.dbConnection
      .query(`select top 1 sum(Total) as total, l.Nombre as business from Venta v 
    left join [Local] l 
    on l.ID_Local  = v.ID_Local 
    group by v.ID_Local, l.Nombre
    order by 
        sum(v.Total) desc`);
    return result.recordset[0];
  }

  async getBusinessWithMaxCountSale(): Promise<{
    quantity: number;
    business: string;
  }> {
    const result = await this.dbConnection
      .query(`select count(*) as quantity, l.Nombre as business  from Venta v 
      left join [Local] l 
      on l.ID_Local  = v.ID_Local 
      group by v.ID_Local, l.Nombre
      order by 
          quantity desc`);
    return result.recordset[0];
  }

  async getBrandWithMaxProfits(): Promise<{ brand: string; profits: number }> {
    const result = await this.dbConnection
      .query(`select top 1 m.Nombre as brand, sum((vd.Cantidad * vd.Precio_Unitario) - (vd.Cantidad * p.Costo_Unitario)) as profits  from Venta v
      left join VentaDetalle vd on v.ID_Venta = vd.ID_Venta 
      left join Producto p on p.ID_Producto = vd.ID_Producto 
      left join Marca m on m.ID_Marca = p.ID_Marca
      group by m.Nombre  
      order by profits desc`);

    return result.recordset[0];
  }

  async getProductWithHighestSaleByBusiness(): Promise<
    { business: string; product: string }[]
  > {
    const result = await this.dbConnection
      .query(`select
      ll.Nombre as business,
      (
      select
        pivot_table.product
      from
        (
        select
          top 1
          p.Nombre as product,
          sum(vd.Cantidad) as quantity
        from
          VentaDetalle vd
        left join Venta v on
          v.ID_Venta = vd.ID_Venta
        left join Producto p on
          p.ID_Producto = vd.ID_Producto
        where
          v.ID_Local = ll.ID_Local 
        group by
          v.ID_Local,
          vd.ID_Producto,
          p.Nombre
        order by sum(vd.Cantidad) desc
        
          ) as pivot_table) as product
    from
      [Local] ll`);

    return result.recordset;
  }
}
