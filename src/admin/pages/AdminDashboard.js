import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { UserOutlined, FileTextOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { getPosts, getUsers } from '../utils/admin.utils';

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [userChartData, setUserChartData] = useState([]);
  const [postChartData, setPostChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getUsers();
        const posts = await getPosts();

        setUserCount(users.length);
        setPostCount(posts.length);

        setUserChartData(processChartData(users, 'joined'));
        setPostChartData(processChartData(posts, 'createdAt'));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  // Function to process user/posts data into chart format
  const processChartData = (data, dateField) => {
    const dateMap = {};

    data.forEach(item => {
      const date = new Date(item[dateField]).toISOString().split('T')[0]; // Extract YYYY-MM-DD
      dateMap[date] = (dateMap[date] || 0) + 1;
    });

    return Object.keys(dateMap).map(date => ({
      date,
      count: dateMap[date]
    }));
  };

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

      {/* User Growth Chart */}
      <Card title="User Growth Over Time" className="mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userChartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="count" stroke="#3f8600" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Post Creation Chart */}
      <Card title="Posts Created Over Time" className="mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={postChartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="count" stroke="#cf1322" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default AdminDashboard;
