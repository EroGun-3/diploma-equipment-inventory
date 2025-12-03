import React from 'react';
import { Layout, Typography, Row, Col } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import EquipmentMap from './components/EquipmentMap';
import './App.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', padding: '0 20px' }}>
        <Row align="middle" justify="space-between">
          <Col>
           <Title level={2} style={{ color: 'white', margin: '15px 0' }}>
             📊 Инвентаризация оборудования "Центр Информационных технологий"
          </Title>
          </Col>
          <Col>
            <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Ставропольский край</Text>
          </Col>
        </Row>
      </Header>
      
      <Content style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <EquipmentMap />
      </Content>
    </Layout>
  );
}

export default App;