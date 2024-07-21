import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('incidencias.db');

export const setupDatabase = async () => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS incidencias (
      id INTEGER PRIMARY KEY NOT NULL, 
      titulo TEXT NOT NULL, 
      fecha TEXT NOT NULL, 
      descripcion TEXT NOT NULL, 
      foto TEXT, 
      audio TEXT
    );
  `);
};

export const addIncidencia = async (titulo, fecha, descripcion, foto, audio) => {
  await db.runAsync('INSERT INTO incidencias (titulo, fecha, descripcion, foto, audio) VALUES (?, ?, ?, ?, ?)', [titulo, fecha, descripcion, foto, audio]);
};

export const getIncidencias = async () => {
  return await db.getAllAsync('SELECT * FROM incidencias');
};

export const deleteAllIncidencias = async () => {
  await db.runAsync('DELETE FROM incidencias');
};
