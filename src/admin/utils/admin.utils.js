// src/utils/admin.utils.js
import axios from "axios";

const ADMIN_API_URL = "http://localhost:4000/admins";
const USER_API_URL = "http://localhost:4000/users";
const POST_API_URL = "http://localhost:4000/posts";

export const checkAdminLogin = async (email, password) => {
  const response = await axios.get(`${ADMIN_API_URL}?email=${email}&password=${password}`);
  if (response.data.length === 0) {
    return null;
  }
  return response.data[0];
};

export const getUsers = async () => {
  const response = await axios.get(USER_API_URL);
  return response.data;
};

export const deleteUser = async (id) => {
  await axios.delete(`${USER_API_URL}/${id}`);
};

export const getPosts = async () => {
  const response = await axios.get(POST_API_URL);
  return response.data;
};

export const deletePost = async (id) => {
  await axios.delete(`${POST_API_URL}/${id}`);
};

export const getPostById = async (postId) => {
  const response = await fetch(`http://localhost:4000/posts/${postId}`);
  if (!response.ok) throw new Error('Post not found');
  return response.json();
};

export const updatePost = async (postId, updatedData) => {
  const response = await fetch(`http://localhost:4000/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) throw new Error('Failed to update post');
  return response.json();
};