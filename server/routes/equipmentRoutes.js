const express = require('express');
const EquipmentController = require('../controllers/equipmentController');

const router = express.Router();

// Основные CRUD операции
router.get('/', EquipmentController.getAll);
router.get('/stats', EquipmentController.getStats);
router.get('/search', EquipmentController.search);
router.get('/:id', EquipmentController.getById);
router.post('/', EquipmentController.create);
router.put('/:id', EquipmentController.update);
router.delete('/:id', EquipmentController.delete);

module.exports = router;