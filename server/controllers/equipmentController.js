const db = require('../database/init');

class EquipmentController {
  // Получить всё оборудование
  static getAll(req, res) {
    db.all('SELECT * FROM equipment ORDER BY created_at DESC', [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  }

  // Получить оборудование по ID
  static getById(req, res) {
    const { id } = req.params;
    db.get('SELECT * FROM equipment WHERE id = ?', [id], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: 'Оборудование не найдено' });
        return;
      }
      res.json(row);
    });
  }

  // Создать новое оборудование
  static create(req, res) {
    const {
      name, type, model, serial_number, latitude, longitude,
      address, description, status, responsible_person, department,
      purchase_date, last_maintenance_date
    } = req.body;

    db.run(`
      INSERT INTO equipment 
      (name, type, model, serial_number, latitude, longitude, address, 
       description, status, responsible_person, department, purchase_date, last_maintenance_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name, type, model, serial_number, latitude, longitude, address,
      description, status || 'active', responsible_person, department,
      purchase_date, last_maintenance_date
    ], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        message: 'Оборудование добавлено'
      });
    });
  }

  // Обновить оборудование
  static update(req, res) {
    const { id } = req.params;
    const {
      name, type, model, serial_number, latitude, longitude,
      address, description, status, responsible_person, department,
      purchase_date, last_maintenance_date
    } = req.body;

    db.run(`
      UPDATE equipment SET
      name = ?, type = ?, model = ?, serial_number = ?, 
      latitude = ?, longitude = ?, address = ?, description = ?,
      status = ?, responsible_person = ?, department = ?,
      purchase_date = ?, last_maintenance_date = ?
      WHERE id = ?
    `, [
      name, type, model, serial_number, latitude, longitude, address,
      description, status, responsible_person, department,
      purchase_date, last_maintenance_date, id
    ], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Оборудование не найдено' });
        return;
      }
      res.json({ message: 'Оборудование обновлено' });
    });
  }

  // Удалить оборудование
  static delete(req, res) {
    const { id } = req.params;
    db.run('DELETE FROM equipment WHERE id = ?', [id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Оборудование не найдено' });
        return;
      }
      res.json({ message: 'Оборудование удалено' });
    });
  }

  // Поиск оборудования
  static search(req, res) {
    const { query } = req.query;
    const searchQuery = `%${query}%`;
    
    db.all(`
      SELECT * FROM equipment 
      WHERE name LIKE ? OR type LIKE ? OR model LIKE ? 
      OR serial_number LIKE ? OR address LIKE ?
      ORDER BY created_at DESC
    `, [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  }

  // Получить статистику
  static getStats(req, res) {
    const queries = {
      total: 'SELECT COUNT(*) as count FROM equipment',
      byStatus: 'SELECT status, COUNT(*) as count FROM equipment GROUP BY status',
      byType: 'SELECT type, COUNT(*) as count FROM equipment GROUP BY type',
      byDepartment: 'SELECT department, COUNT(*) as count FROM equipment GROUP BY department'
    };

    const results = {};
    let completed = 0;
    const totalQueries = Object.keys(queries).length;

    Object.entries(queries).forEach(([key, query]) => {
      db.all(query, [], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        results[key] = rows;
        completed++;
        
        if (completed === totalQueries) {
          res.json(results);
        }
      });
    });
  }
}

module.exports = EquipmentController;