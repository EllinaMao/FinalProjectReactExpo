import * as Crypto from "expo-crypto";
import * as SQLite from "expo-sqlite";

export interface Record {
  id: string;
  title: string;
  audioFilePath?: string;

  created_at?: number;
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
      this.db = await SQLite.openDatabaseAsync("records.db");
      await this.db
        .execAsync(
          `CREATE TABLE IF NOT EXISTS records(
          id CHAR(32) PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          audioFilePath TEXT,
          created_at INTEGER DEFAULT(unixepoch())
        );`,
        )
        .then(() => {
          console.log("Таблица records создана или уже существует");
        });
    })();
    await this.initPromise;
  }

  async addRecord(record: Record) {
    if (!this.db) throw new Error("Db is not initialized");

    const result = await this.db
      .runAsync(
        "INSERT INTO records(id, title, audioFilePath, created_at) VALUES (?, ?, ?, ?);",
        Crypto.randomUUID(),
        record.title,
        record.audioFilePath ? record.audioFilePath : null,
        Date.now(),
      )
      .then((result) => {
        console.log("Record added with ID:", result.lastInsertRowId);
        return result.lastInsertRowId;
      });
  }

  async addRecord2(title: string, audioFilePath?: string) {
    if (!this.db) throw new Error("Db is not initialized");

    const result = await this.db
      .runAsync(
        "INSERT INTO records(id, title, audioFilePath, created_at) VALUES (?, ?, ?, ?);",
        Crypto.randomUUID(),
        title,
        audioFilePath ? audioFilePath : null,
        Date.now(),
      )
      .then((result) => {
        console.log("Record added with ID:", result.lastInsertRowId);
        return result;
      });

    return result.lastInsertRowId;
  }

  async getAllRecords(): Promise<Record[]> {
    if (!this.db) throw new Error("Db is not init");

    const query = `SELECT * FROM records ORDER BY title;`;
    const rows = await this.db.getAllAsync<Record>(query).then((rows) => {
      console.log("Records retrieved: ", rows.length);
      return rows;
    });

    return rows;
  }

  async deleteRecord(id: string) {
    if (!this.db) throw new Error("Db is not init");

    await this.db.runAsync("DELETE FROM records WHERE id = ?", id).then(() => {
      console.log("Record deleted with ID:", id);
    });
  }

  async updateRecordTitle(id: string, title: string) {
    if (!this.db) throw new Error("Db is not init");

    await this.db
      .runAsync("UPDATE records SET title = ? WHERE id = ?", title, id)
      .then(() => {
        console.log("Record updated with ID:", id);
      });
  }
}

export const dbManager = new DatabaseManager();
