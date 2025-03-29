import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';  
import { getUsers, deleteUser } from '../utils/admin.utils';
import defaultProfilePic from '../../assets/img/defaultProfile.jpg';

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const columns = [
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
    {
      title: 'Profile Picture',
      dataIndex: 'profilePic',
      key: 'profilePic',
      render: (profilePic) =>
        profilePic ? (
          <img src={profilePic} alt="Profile Pic" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
        ) : (
          <img src={defaultProfilePic} alt="Profile Pic" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
        ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}  
              style={{ borderRadius: 6, padding: '4px 12px' }}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Manage Users</h1>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
        style={{ background: '#fff', borderRadius: 8 }}
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ padding: '10px 20px' }}>
              <p><strong>Headline:</strong> {record.headline}</p>
              <p><strong>Bio:</strong> {record.bio}</p>
              <p><strong>Date of Birth:</strong> {record.dob}</p>
              <p><strong>Joined:</strong> {record.joined}</p>
              <p><strong>Followers:</strong> {record.followerCount}</p>
              <p><strong>Following:</strong> {record.followingCount}</p>
              <p><strong>Post Count:</strong> {record.postCount}</p>
              <p><strong>Followers List:</strong> {record.followers.length > 0 ? record.followers.join(', ') : "No Followers"}</p>
              <p><strong>Following List:</strong> {record.following.length > 0 ? record.following.join(', ') : "Not Following Anyone"}</p>
            </div>
          ),
          rowExpandable: (record) => true,
        }}
      />
    </div>
  );
};

export default AdminManageUsers;
