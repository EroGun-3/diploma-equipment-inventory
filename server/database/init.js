const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Путь к файлу БД
const dbPath = path.join(__dirname, 'equipment.db');

// Создаём подключение к БД
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Ошибка подключения к БД:', err.message);
  } else {
    console.log('✅ Подключение к SQLite успешно');
    initializeDatabase();
  }
});

// Инициализация таблиц
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS equipment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      model TEXT,
      serial_number TEXT UNIQUE,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      address TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'active',
      responsible_person TEXT,
      department TEXT,
      purchase_date TEXT,
      last_maintenance_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Ошибка создания таблицы equipment:', err.message);
    } else {
      console.log('✅ Таблица equipment создана/проверена');
      seedDatabase();
    }
  });
}

// Заполняем тестовыми данными (Ставрополь)
function seedDatabase() {
  const equipmentData = [
    {
      name: 'Серверный шкаф Dell PowerEdge',
      type: 'Сервер',
      model: 'PowerEdge R740',
      serial_number: 'DEL-2023-001',
      latitude: 45.0520,
      longitude: 41.9740,
      address: 'ул. Ленина, 415, Ставрополь',
      description: 'Основной серверный шкаф с оборудованием ЦОД',
      status: 'active',
      responsible_person: 'Иванов И.И.',
      department: 'ИТ-отдел',
      purchase_date: '2023-01-15'
    },
    {
      name: 'Рабочая станция HP Z4',
      type: 'Компьютер',
      model: 'Z4 G4',
      serial_number: 'HP-2023-045',
      latitude: 45.0380,
      longitude: 41.9650,
      address: 'ул. Серова, 23, Ставрополь',
      description: 'Мощная рабочая станция для графических приложений',
      status: 'active',
      responsible_person: 'Петров П.П.',
      department: 'Дизайн-отдел',
      purchase_date: '2023-03-20'
    },
    {
      name: 'Цветной МФУ Xerox',
      type: 'Принтер',
      model: 'VersaLink C7000',
      serial_number: 'XRX-2022-078',
      latitude: 45.0470,
      longitude: 41.9630,
      address: 'ул. Пирогова, 56, Ставрополь',
      description: 'Цветной лазерный многофункциональный принтер',
      status: 'maintenance',
      responsible_person: 'Сидоров С.С.',
      department: 'Бухгалтерия',
      purchase_date: '2022-11-10',
      last_maintenance_date: '2024-01-15'
    },
    {
      name: 'Ноутбуки Lenovo ThinkPad',
      type: 'Ноутбук',
      model: 'ThinkPad X1 Carbon',
      serial_number: 'LEN-2023-120',
      latitude: 45.0433,
      longitude: 41.9695,
      address: 'ул. Ленина, 300, Ставрополь',
      description: 'Парк ноутбуков для мобильных сотрудников (15 шт.)',
      status: 'active',
      responsible_person: 'Алексеев А.А.',
      department: 'Отдел продаж',
      purchase_date: '2023-06-05'
    },
    {
      name: 'Маршрутизатор Cisco',
      type: 'Сетевое оборудование',
      model: 'Catalyst 9300',
      serial_number: 'CIS-2023-033',
      latitude: 45.0360,
      longitude: 41.9680,
      address: 'ул. Серова, 45, Ставрополь',
      description: 'Основной маршрутизатор для управления сетью',
      status: 'active',
      responsible_person: 'Смирнов С.С.',
      department: 'Сетевой отдел',
      purchase_date: '2023-02-28'
    }
  ];

  // Проверяем, есть ли уже данные
  db.get('SELECT COUNT(*) as count FROM equipment', (err, row) => {
    if (err) {
      console.error('Ошибка проверки данных:', err.message);
      return;
    }

    if (row.count === 0) {
      console.log('📥 Заполняем БД тестовыми данными...');
      
      const stmt = db.prepare(`
        INSERT INTO equipment 
        (name, type, model, serial_number, latitude, longitude, address, 
         description, status, responsible_person, department, purchase_date, last_maintenance_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      equipmentData.forEach(item => {
        stmt.run([
          item.name, item.type, item.model, item.serial_number,
          item.latitude, item.longitude, item.address, item.description,
          item.status, item.responsible_person, item.department,
          item.purchase_date, item.last_maintenance_date || null
        ]);
      });

      stmt.finalize();
      console.log('✅ Тестовые данные добавлены');
    } else {
      console.log(`✅ В БД уже есть ${row.count} записей`);
    }
  });
}

module.exports = db;