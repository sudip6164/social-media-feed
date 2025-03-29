// src/pages/admin/AdminLogin.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Card, message, App } from 'antd';
import { AdminContext } from '../context/admin.context';
import { checkAdminLogin } from '../../utils/admin.utils';

const AdminLogin = () => {
  const { _setAdmin } = useContext(AdminContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const adminData = await checkAdminLogin(values.email, values.password);
      if (adminData === null) {
        message.error({
          content: 'Invalid email or password',
          duration: 3,
          style: { marginTop: '20vh' },
        });
        localStorage.setItem('is_admin_login', '0');
      } else {
        message.success({
          content: 'Admin login successful',
          duration: 2,
          style: { marginTop: '20vh' },
        });
        _setAdmin(adminData);
        localStorage.setItem('is_admin_login', '1');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      }
    } catch (error) {
      message.error({
        content: 'An error occurred',
        duration: 3,
        style: { marginTop: '20vh' },
      });
    }
  };

  return (
    <App>
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
        <Card
          title={<h2 style={{ textAlign: 'center', margin: 0 }}>Admin Login</h2>}
          style={{ width: 400, boxShadow: '0 4px 8px rgba(106, 13, 173, 0.5)', borderRadius: '8px' }}
        >
          <Form
            name="admin-login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block style={{ height: '40px', fontSize: '16px' }}>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </App>
  );
};

export default AdminLogin;