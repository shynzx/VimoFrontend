import { Pool, QueryResult, QueryResultRow } from 'pg';

export class DatabaseService {
  private static instance: DatabaseService | null = null;
  private pool: Pool | null = null;
  private isConnected = false;

  private constructor() {
    this.initializePool();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private initializePool(): void {
    if (process.env.DATA_MODE === 'demo') return;
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('Configura DATABASE_URL o selecciona DATA_MODE=demo explícitamente.');
    }

    this.pool = new Pool({ connectionString, max: 20, idleTimeoutMillis: 30000, connectionTimeoutMillis: 5000, statement_timeout: 5000 });
    this.pool.on('error', (error) => console.error('[DatabaseService] Error en conexión inactiva', error));
  }

  public async query<R extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[]
  ): Promise<QueryResult<R>> {
    if (!this.pool) {
      throw new Error('[DatabaseService] El pool de conexiones no ha sido inicializado');
    }
    return await this.pool.query<R>(text, params);
  }

  public async checkHealth(): Promise<boolean> {
    if (!this.pool) return false;
    try {
      const result = await this.pool.query('SELECT 1 AS healthy');
      this.isConnected = result.rows.length > 0;
      return this.isConnected;
    } catch {
      this.isConnected = false;
      return false;
    }
  }

  public async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.isConnected = false;
    }
  }
}
