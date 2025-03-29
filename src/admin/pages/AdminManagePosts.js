import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Space, Tag } from 'antd';
import { DeleteOutlined, LikeOutlined, CommentOutlined, ShareAltOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';  // ✅ Use useNavigate instead of Navigate
import { deletePost, getPosts } from '../utils/admin.utils';

const AdminManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();  // ✅ Initialize useNavigate

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
    {
      title: 'Headline',
      dataIndex: 'headline',
      key: 'headline',
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      width: 200,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) =>
        image ? (
          <img src={image} alt="Post" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
        ) : (
          <span>No Image</span>
        ),
    },
    {
      title: 'Stats',
      key: 'stats',
      render: (_, record) => (
        <Space>
          <Tag icon={<LikeOutlined />} color="blue">{record.likes} Likes</Tag>
          <Tag icon={<CommentOutlined />} color="green">{record.comments} Comments</Tag>
          <Tag icon={<ShareAltOutlined />} color="purple">{record.shares} Shares</Tag>
        </Space>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/manage-posts/edit/${record.id}`)}  // ✅ Correct usage
            style={{ borderRadius: 6, padding: '4px 12px' }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this post?"
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
      <h1 style={{ marginBottom: 24 }}>Manage Posts</h1>
      <Table
        columns={columns}
        dataSource={posts}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
        style={{ background: '#fff', borderRadius: 8 }}
      />
    </div>
  );
};

export default AdminManagePosts;
