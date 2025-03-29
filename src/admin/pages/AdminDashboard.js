// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { UserOutlined, FileTextOutlined } from '@ant-design/icons';
import { getPosts, getUsers } from '../utils/admin.utils';

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getUsers();
        const posts = await getPosts();
        setUserCount(users.length);
        setPostCount(posts.length);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Users"
              value={userCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Posts"
              value={postCount}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;