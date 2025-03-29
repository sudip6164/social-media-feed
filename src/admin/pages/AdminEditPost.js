import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Upload, message, Card, Descriptions, Spin } from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { getPostById, updatePost } from '../utils/admin.utils';

const { TextArea } = Input;

const AdminEditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPostById(postId);
        setPost(postData);
        form.setFieldsValue({
          content: postData.content,
        });
        if (postData.image) {
          setImageUrl(postData.image);
          setFileList([{
            uid: '-1',
            name: 'post-image',
            status: 'done',
            url: postData.image,
          }]);
        }
      } catch (error) {
        message.error('Failed to load post data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, form]);

  const handleBeforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    return isImage;
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
      };
      reader.readAsDataURL(newFileList[0].originFileObj);
    } else {
      setImageUrl(post?.image || '');
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      let image = post?.image || '';
      
      // If new image was uploaded
      if (fileList.length > 0 && fileList[0].originFileObj) {
        image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(fileList[0].originFileObj);
        });
      }

      const updatedPost = {
        ...post,
        content: values.content,
        image: image,
      };

      await updatePost(postId, updatedPost);
      message.success('Post updated successfully');
      navigate('/admin/manage-posts');
    } catch (error) {
      message.error('Failed to update post');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !post) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/admin/manage-posts')}
        style={{ marginBottom: 16 }}
      >
        Back to Posts
      </Button>

      <Card title="Edit Post" bordered={false}>
        <Descriptions bordered column={1} style={{ marginBottom: 24 }}>
          <Descriptions.Item label="Username">{post.username}</Descriptions.Item>
          <Descriptions.Item label="Headline">{post.headline}</Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(post.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Likes">{post.likes}</Descriptions.Item>
          <Descriptions.Item label="Comments">{post.comments}</Descriptions.Item>
          <Descriptions.Item label="Shares">{post.shares}</Descriptions.Item>
        </Descriptions>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            content: post.content,
          }}
        >
          <Form.Item
            name="content"
            label="Post Content"
            rules={[{ required: true, message: 'Please enter post content' }]}
          >
            <TextArea rows={4} placeholder="What's on your mind?" />
          </Form.Item>

          <Form.Item label="Post Image">
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={handleBeforeUpload}
            onChange={handleChange}
            maxCount={1}
            accept="image/*"
            showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Change Image</div>
            </div>
          </Upload>
          </Form.Item>

          {imageUrl && (
            <div style={{ marginBottom: 24, textAlign: 'center' }}>
              <img
                src={imageUrl}
                alt="Current post"
                style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
              />
            </div>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Post
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminEditPost;