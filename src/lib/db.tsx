import * as Crypto from "expo-crypto";
import * as SQLite from "expo-sqlite";

const categories = ["Work", "Personal", "Ideas", "Other"];

export interface Record {
  id: string;
  title: string;
  audioFilePath?: string;
  created_at?: number;
  category_id?: string;
  duration?: number;
}

export interface Category {
  id: string;
  name: string;
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
        `CREATE TABLE IF NOT EXISTS categories(
          id CHAR(32) PRIMARY KEY NOT NULL,
          name TEXT NOT NULL
        );`,
      );

      await this.db.execAsync(
        `CREATE TABLE IF NOT EXISTS records(
          id CHAR(32) PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          category_id CHAR(32) REFERENCES categories(id) ON DELETE SET NULL,
          audioFilePath TEXT,
          duration INTEGER,
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
    duration?: number | null,
    categoryId?: string | null,
  ): Promise<string> {
    if (!this.db) throw new Error("Db is not initialized");

    const newId = Crypto.randomUUID();

    await this.db.runAsync(
      "INSERT INTO records(id, title, audioFilePath, category_id, duration, created_at) VALUES (?, ?, ?, ?, ?, ?);",
      newId,
      title,
      audioFilePath ?? null,
      categoryId ?? null,
      duration ?? null,
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

  async getAllCategories(): Promise<Category[]> {
    if (!this.db) throw new Error("Db is not init");
    const query = `SELECT * FROM categories;`;
    const rows = await this.db.getAllAsync<Category>(query);
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
  async findRecordByDuration(duration: number): Promise<Record[]> {
    if (!this.db) throw new Error("Db is not init");

    const query = `SELECT * FROM records WHERE duration = ?;`;
    const rows = await this.db.getAllAsync<Record>(query, duration);
    return rows;
  }
  async findRecordByCategory(categoryId: string): Promise<Record[]> {
    if (!this.db) throw new Error("Db is not init");

    const query = `SELECT * FROM records WHERE category_id = ?;`;
    const rows = await this.db.getAllAsync<Record>(query, categoryId);
    return rows;
  }

  async resetDatabase(dbName: string) {
    await SQLite.deleteDatabaseAsync(dbName);
  }
}

export const dbManager = new DatabaseManager();
