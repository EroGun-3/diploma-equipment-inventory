const express = require('express');
const cors = require('cors');
const path = require('path');
const equipmentRoutes = require('./routes/equipmentRoutes');

// Инициализируем БД
require('./database/init');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы (если нужно)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/equipment', equipmentRoutes);

// Базовая проверка работы API
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Сервер инвентаризации оборудования работает',
    timestamp: new Date().toISOString()
  });
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📊 API доступно по адресу: http://localhost:${PORT}/api`);
  console.log(`🔍 Проверка здоровья: http://localhost:${PORT}/api/health`);
  console.log(`🗃️  Оборудование: http://localhost:${PORT}/api/equipment`);
});