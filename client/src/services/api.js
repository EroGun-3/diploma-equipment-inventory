import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Простая функция для тестирования
export const testConnection = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`);
    console.log('✅ Сервер отвечает:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Сервер недоступен:', error.message);
    return false;
  }
};

// Получить оборудование
export const getEquipment = async () => {
  try {
    const response = await axios.get(`${API_URL}/equipment`);
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка получения оборудования:', error.message);
    return [];
  }
};

// Используй в компоненте EquipmentMap.jsx
// Добавь в начало файла:
import { getEquipment } from '../services/api';

// И в компоненте EquipmentMap:
const [equipment, setEquipment] = useState([]);

useEffect(() => {
  loadEquipment();
}, []);

const loadEquipment = async () => {
  const data = await getEquipment();
  setEquipment(data);
};