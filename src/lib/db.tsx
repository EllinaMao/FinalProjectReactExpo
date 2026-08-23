import * as Crypto from "expo-crypto";
import * as SQLite from "expo-sqlite";

export interface Record {
  id: string;
  title: string;
  audioFilePath?: string;
  created_at?: number;
  length?: number;
}

class DatabaseManager {
  private db: SQLite.SQLiteDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  async init() {
    if (this.db) {
      console.log("БД уже инициализирована");
      return;
    }
    if (this.initPromise) {
      await this.initPromise;
      console.log("БД в ожидании");
      return;
    }

    this.initPromise = (async () => {
      //WARNING - only for testing
      await this.resetDatabase("records.db");
      this.db = await SQLite.openDatabaseAsync("records.db");

      await this.db.execAsync(
        `CREATE TABLE IF NOT EXISTS records(
          id CHAR(32) PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          audioFilePath TEXT,
          length INTEGER,
          created_at INTEGER
        );`,
      );
      console.log("Таблица records создана или уже существует");
    })();

    await this.initPromise;
  }

  async addRecord(
    title: string,
    audioFilePath?: string | null,
    length?: number | null,
  ): Promise<string> {
    if (!this.db) throw new Error("Db is not initialized");

    const newId = Crypto.randomUUID();

    await this.db.runAsync(
      "INSERT INTO records(id, title, audioFilePath, length, created_at) VALUES (?, ?, ?, ?, ?);",
      newId,
      title,
      audioFilePath ?? null,
      length ?? null,
      Date.now(),
    );

    console.log("Record added with ID:", newId);
    return newId;
  }

  async getAllRecords(): Promise<Record[]> {
    if (!this.db) throw new Error("Db is not init");

    const query = `SELECT * FROM records ORDER BY created_at DESC;`;

    const rows = await this.db.getAllAsync<Record>(query);
    console.log("Records retrieved: ", rows.length);

    return rows;
  }

  async deleteRecord(id: string) {
    if (!this.db) throw new Error("Db is not init");

    await this.db.runAsync("DELETE FROM records WHERE id = ?", id);
    console.log("Record deleted with ID:", id);
  }

  async updateRecordTitle(id: string, title: string) {
    if (!this.db) throw new Error("Db is not init");

    await this.db.runAsync(
      "UPDATE records SET title = ? WHERE id = ?",
      title,
      id,
    );
    console.log("Record updated with ID:", id);
  }
  async getRecordById(id: string): Promise<Record | null> {
    if (!this.db) throw new Error("Db is not init");

    const row = await this.db.getFirstAsync<Record>(
      "SELECT * FROM records WHERE id = ?;",
      id,
    );

    return row;
  }
  async findRecordByName(title: string): Promise<Record | null> {
    if (!this.db) throw new Error("Db is not init");

    const query = `SELECT * FROM records WHERE title = ? LIMIT 1;`;
    const rows = await this.db.getAllAsync<Record>(query, title);
    return rows.length > 0 ? rows[0] : null;
  }
  async findRecordByLength(length: number): Promise<Record[]> {
    if (!this.db) throw new Error("Db is not init");

    const query = `SELECT * FROM records WHERE length = ?;`;
    const rows = await this.db.getAllAsync<Record>(query, length);
    return rows;
  }
  async resetDatabase(dbName: string) {
    await SQLite.deleteDatabaseAsync(dbName);
  }
}

export const dbManager = new DatabaseManager();
