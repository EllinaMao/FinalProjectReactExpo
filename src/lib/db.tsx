import * as Crypto from "expo-crypto";
import * as SQLite from "expo-sqlite";

const defaultCategories = [
  { name: "Работа", assignedColor: "#f0ba08" },
  { name: "Личное", assignedColor: "#3b82f6" },
  { name: "Идеи", assignedColor: "#4ae270" },
  { name: "Другие", assignedColor: "#c93a46" },
];

export interface Record {
  id: string;
  title: string;
  audioFilePath?: string;
  created_at?: number;
  duration?: number;
  categories?: Category[];
}

export interface Category {
  id: string;
  name: string;
  assignedColor: string;
}

class DatabaseManager {
  private db: SQLite.SQLiteDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  async init() {
    if (this.db) {
      // console.log("БД уже инициализирована");
      return;
    }
    if (this.initPromise) {
      await this.initPromise;
      // console.log("БД в ожидании");
      return;
    }

    this.initPromise = (async () => {
      //WARNING - only for testing
      // await this.resetDatabase("records.db");
      this.db = await SQLite.openDatabaseAsync("records.db");

      await this.db.execAsync(
        `CREATE TABLE IF NOT EXISTS categories(
          id CHAR(32) PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          assignedColor TEXT NOT NULL
        );`,
      );

      await this.db.execAsync(
        `CREATE TABLE IF NOT EXISTS records(
          id CHAR(32) PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          audioFilePath TEXT,
          duration INTEGER,
          created_at INTEGER
        );`,
      );

      await this.db.execAsync(
        `CREATE TABLE IF NOT EXISTS record_categories(
          record_id CHAR(32) NOT NULL,
          category_id CHAR(32) NOT NULL,
          PRIMARY KEY (record_id, category_id),
          FOREIGN KEY (record_id) REFERENCES records(id) ON DELETE CASCADE,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        );`,
      );

      await this.seedCategories();
      // console.log("Таблица records создана или уже существует");
    })();

    await this.initPromise;
  }
  private async seedCategories() {
    if (!this.db) return;
    const existingCount = await this.db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM categories",
    );

    if (existingCount && existingCount.count === 0) {
      for (const cat of defaultCategories) {
        const catId = Crypto.randomUUID();
        await this.db.runAsync(
          "INSERT INTO categories (id, name, assignedColor) VALUES (?, ?, ?)",
          catId,
          cat.name,
          cat.assignedColor,
        );
      }
    }
  }

  async addRecord(
    title: string,
    audioFilePath?: string | null,
    duration?: number | null,
    categoryIds?: string[] | null,
  ): Promise<string> {
    if (!this.db) throw new Error("Db is not initialized");

    const newId = Crypto.randomUUID();

    await this.db.runAsync(
      "INSERT INTO records(id, title, audioFilePath, duration, created_at) VALUES (?, ?, ?, ?, ?);",
      newId,
      title,
      audioFilePath ?? null,
      duration ?? null,
      Date.now(),
    );

    if (categoryIds && categoryIds.length > 0) {
      for (const catId of categoryIds) {
        await this.db.runAsync(
          "INSERT INTO record_categories(record_id, category_id) VALUES (?, ?);",
          newId,
          catId,
        );
      }
    }

    return newId;
  }
  private async getCategoriesForRecord(recordId: string): Promise<Category[]> {
    if (!this.db) return [];
    const query = `
      SELECT c.* FROM categories c
      JOIN record_categories rc ON c.id = rc.category_id
      WHERE rc.record_id = ?;
    `;
    return await this.db.getAllAsync<Category>(query, recordId);
  }

  async getAllRecords(): Promise<Record[]> {
    if (!this.db) throw new Error("Db is not init");
    const query = `SELECT * FROM records ORDER BY created_at DESC;`;
    const rows = await this.db.getAllAsync<Record>(query);

    for (let record of rows) {
      record.categories = await this.getCategoriesForRecord(record.id);
    }

    return rows;
  }

  async getAllCategories(): Promise<Category[]> {
    if (!this.db) throw new Error("Db is not init");
    const query = `SELECT * FROM categories;`;
    const rows = await this.db.getAllAsync<Category>(query);
    return rows;
  }
  async getRecordById(id: string): Promise<Record | null> {
    if (!this.db) throw new Error("Db is not init");
    const record = await this.db.getFirstAsync<Record>(
      "SELECT * FROM records WHERE id = ?;",
      id,
    );
    if (record) {
      record.categories = await this.getCategoriesForRecord(record.id);
    }
    return record;
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
  async updateRecord(id: string, title: string, categoryIds: string[]) {
    if (!this.db) throw new Error("Db is not init");
    await this.db.runAsync(
      "UPDATE records SET title = ? WHERE id = ?",
      title,
      id,
    );
    await this.db.runAsync(
      "DELETE FROM record_categories WHERE record_id = ?",
      id,
    );

    for (const catId of categoryIds) {
      await this.db.runAsync(
        "INSERT INTO record_categories(record_id, category_id) VALUES (?, ?);",
        id,
        catId,
      );
    }
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

    const query = `
      SELECT r.* FROM records r
      JOIN record_categories rc ON r.id = rc.record_id
      WHERE rc.category_id = ?;
    `;
    const rows = await this.db.getAllAsync<Record>(query, categoryId);
    return rows;
  }

  private async resetDatabase(dbName: string) {
    await SQLite.deleteDatabaseAsync(dbName);
  }
}

export const dbManager = new DatabaseManager();
