const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a SQLite (crea el archivo database.db dentro de la carpeta backend)
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) console.error('Error al conectar a SQLite', err.message);
    else console.log('Conectado a la base de datos SQLite.');
});

// Crear tablas de usuarios y de tareas
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        userId INTEGER
    )`);
});

// --- RUTAS DE AUTENTICACIÓN ---
app.post('/api/register', (req, res) => {
    const { email, password, role } = req.body;
    const userRole = role || 'operator';
    db.run(`INSERT INTO users (email, password, role) VALUES (?, ?, ?)`, [email, password, userRole], function(err) {
        if (err) return res.status(400).json({ error: "El correo ya está registrado." });
        res.json({ id: this.lastID, email, role: userRole });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(401).json({ error: "Credenciales incorrectas." });
        res.json({ id: row.id, email: row.email, role: row.role });
    });
});

// --- RUTAS DE TAREAS ---
app.get('/api/tasks', (req, res) => {
    db.all("SELECT * FROM tasks", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Guardar tarea asignada al usuario
app.post('/api/tasks', (req, res) => {
    const { title, content, priority, tag, date, userId } = req.body;
    const query = `INSERT INTO tasks (title, content, priority, tag, date, userId) VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [title, content, priority, tag, date, userId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, title, content, priority, tag, date, userId });
    });
});

app.delete('/api/tasks/:id', (req, res) => {
    db.run(`DELETE FROM tasks WHERE id = ?`, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deletedID: req.params.id });
    });
});
// Obtener solo las tareas del usuario logueado
app.get('/api/tasks/:userId', (req, res) => {
    const { userId } = req.params;
    db.all("SELECT * FROM tasks WHERE userId = ?", [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});


app.listen(5000, () => console.log(`Backend corriendo en http://localhost:5000`));