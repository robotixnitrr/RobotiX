import { neon } from "@neondatabase/serverless"

// Create a SQL client with the connection string from environment variables
export const sql = neon(process.env.DATABASE_URL!)

// Helper function to execute SQL queries with error handling
export async function query<T>(strings: TemplateStringsArray, ...values: any[]): Promise<T> {
  try {
    return (await sql(strings, ...values)) as T
  } catch (error) {
    console.error("Database query error:", error)
    throw new Error(`Database query failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}


// Create tables if they do not exist
async function initDb() {
  try {
    // Users table
    await query`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('assigner', 'assignee')),
        last_notification_read_at TIMESTAMP DEFAULT '1970-01-01',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      `

    // Tasks table
    await query`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('pending', 'in-progress', 'completed')),
        priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
        due_date DATE NOT NULL,
        assigner_id INTEGER NOT NULL REFERENCES users(id),
        assigner_name TEXT NOT NULL,
        assignee_id INTEGER NOT NULL REFERENCES users(id),
        assignee_name TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
    console.log("Database tables ensured.")
  } catch (err) {
    console.error("Error creating tables:", err)
  }
}

// Initialize database tables on module load
initDb().catch(e => {
  console.error("Failed to initialize database tables:", e);
});

export { initDb }
