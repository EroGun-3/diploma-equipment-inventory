import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, Tag } from 'antd';
import 'leaflet/dist/leaflet.css';

// Импортируем иконки маркеров Leaflet
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Фиксим иконки для Leaflet
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Стили для контейнера карты
const mapStyle = {
  height: '600px',
  width: '100%',
  borderRadius: '8px',
  border: '1px solid #d9d9d9',
  marginTop: '20px'
};

// Координаты Ставрополя
const STAVROPOL_CENTER = [45.0428, 41.9734];

// Оборудование на улицах Ставрополя
const stavropolEquipment = [
  { 
    id: 1, 
    name: 'Серверный шкаф Dell', 
    type: 'Сервер', 
    position: [45.036354, 41.9415566], // ул. Ленина
    address: 'ул. Ленина, 392Б',
    description: 'Основной серверный шкаф с оборудованием ЦОД',
    status: 'active',
    icon: '📡'
  },
  { 
    id: 2, 
    name: 'Рабочая станция HP', 
    type: 'Компьютер', 
    position: [45.029240, 41.975284], // ул. Серова
    address: 'ул. Серова, 2Б',
    description: 'Мощная рабочая станция для графических приложений',
    status: 'active',
    icon: '🖥️'
  },
  { 
    id: 3, 
    name: 'Цветной МФУ Xerox', 
    type: 'Принтер', 
    position: [45.010717, 41.916288], // ул. Пирогова
    address: 'ул. Пирогова, 18/6',
    description: 'Цветной лазерный многофункциональный принтер',
    status: 'maintenance',
    icon: '🖨️'
  },
];

// Функция для цвета статуса
const getStatusColor = (status) => {
  switch(status) {
    case 'active': return 'green';
    case 'inactive': return 'gray';
    case 'maintenance': return 'orange';
    case 'broken': return 'red';
    default: return 'blue';
  }
};

// Функция для текста статуса
const getStatusText = (status) => {
  switch(status) {
    case 'active': return 'В работе';
    case 'inactive': return 'Не активен';
    case 'maintenance': return 'На обслуживании';
    case 'broken': return 'Неисправен';
    default: return status;
  }
};

function EquipmentMap() {
  return (
    <div>
      <h2 style={{ marginBottom: '10px' }}>🗺️ Карта оборудования ЦИТ в Ставрополе</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Оборудование на улицах Ленина, Серова и Пирогова
      </p>
      
      <MapContainer 
        center={STAVROPOL_CENTER} 
        zoom={15} 
        style={mapStyle}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {stavropolEquipment.map(equipment => (
          <Marker key={equipment.id} position={equipment.position}>
            <Popup>
              <Card 
                size="small" 
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{equipment.icon}</span>
                    <span>{equipment.name}</span>
                  </div>
                }
                style={{ width: 250 }}
              >
                <p><strong>Тип:</strong> {equipment.type}</p>
                <p><strong>Адрес:</strong> {equipment.address}</p>
                <p><strong>Описание:</strong> {equipment.description}</p>
                <p>
                  <strong>Статус:</strong> 
                  <Tag color={getStatusColor(equipment.status)} style={{ marginLeft: '8px' }}>
                    {getStatusText(equipment.status)}
                  </Tag>
                </p>
              </Card>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Список оборудования:</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '10px', 
          marginTop: '10px' 
        }}>
          {stavropolEquipment.map(item => (
            <Card 
              key={item.id} 
              size="small"
              style={{ borderLeft: `4px solid ${getStatusColor(item.status)}` }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <div>
                  <strong>{item.name}</strong>
                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                    {item.address}
                  </p>
                  <Tag color={getStatusColor(item.status)}>
                    {getStatusText(item.status)}
                  </Tag>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EquipmentMap;