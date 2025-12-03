const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключаемся к БД
const dbPath = path.join(__dirname, 'database', 'equipment.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Ошибка подключения к БД:', err.message);
  } else {
    console.log('✅ Подключение к SQLite успешно');
  }
});

// Тестовый маршрут для проверки
app.get('/', (req, res) => {
  res.send('Сервер инвентаризации оборудования работает!');
});

// Маршрут здоровья
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Сервер работает',
    timestamp: new Date().toISOString()
  });
});

// Получить всё оборудование
app.get('/api/equipment', (req, res) => {
  db.all('SELECT * FROM equipment', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Получить статистику
app.get('/api/equipment/stats', (req, res) => {
  db.all('SELECT status, COUNT(*) as count FROM equipment GROUP BY status', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api/equipment`);
});