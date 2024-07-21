import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('incidencias.db');

export const setupDatabase = async () => {
  try {
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
  } catch (error) {
    console.error('Error setting up database:', error);
  }
};

export const addIncidencia = async (titulo, fecha, descripcion, foto, audio) => {
  try {
    await db.runAsync('INSERT INTO incidencias (titulo, fecha, descripcion, foto, audio) VALUES (?, ?, ?, ?, ?)', [titulo, fecha, descripcion, foto, audio]);
  } catch (error) {
    console.error('Error adding incidencia:', error);
  }
};

export const getIncidencias = async () => {
  try {
    const result = await db.getAllAsync('SELECT * FROM incidencias');
    return result;
  } catch (error) {
    console.error('Error getting incidencias:', error);
    return [];
  }
};

export const deleteAllIncidencias = async () => {
  try {
    await db.runAsync('DELETE FROM incidencias');
  } catch (error) {
    console.error('Error deleting all incidencias:', error);
  }
};
