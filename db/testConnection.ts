// // test-connection.js

// import { neon } from "@neondatabase/serverless";
// import { Pool } from "@neondatabase/serverless"; // Import Pool class

// // Replace with your actual Neon Database connection string
// const connectionString = process.env.NEON_DATABASE_URL!;

// async function testConnection() {
//   try {
//     // Create a Neon Database connection pool
//     const pool = new Pool(neon(connectionString));

//     // Attempt a simple query to test connectivity
//     const result = await pool.query("SELECT 1 AS one");

//     if (result.rows.length > 0) {
//       console.log("Connection to Neon Database successful!");
//     } else {
//       console.error("No results returned from test query.");
//     }
//   } catch (error) {
//     console.error("Error connecting to Neon Database:", error);
//   } finally {
//     // Close the connection pool (optional, but recommended for production)
//     await pool.end();
//   }
// }

// testConnection();
