import sql from "mssql";

export async function initializeDatabase() {
  const config: sql.config = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER!,
    requestTimeout: 60000,
    options: {
      trustServerCertificate: true,
    },
  };

  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
    throw error;
  }
}
