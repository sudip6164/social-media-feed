import axios from "axios";

const API_URL = "http://localhost:4000/posts"; // Note: Works with db.json via json-server

export const getPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createPost = async (postData) => {
  let imageBase64 = "";
  if (postData.image) {
    imageBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(postData.image);
    });
  }

  const dataToSend = {
    userId: postData.userId,
    username: postData.username,
    role: postData.role,
    createdAt: postData.createdAt,
    content: postData.content,
    image: imageBase64,
    likes: postData.likes,
    comments: postData.comments,
    shares: postData.shares,
    likedBy: postData.likedBy || [],
  };

  const response = await axios.post(API_URL, dataToSend);
  return response.data;
};

export const updatePost = async (id, postData) => {
  const response = await axios.patch(`${API_URL}/${id}`, postData);
  return response.data;
};

export const deletePost = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

export const getPostsByUser = async (userId) => {
  const response = await axios.get(`${API_URL}?userId=${userId}`);
  return response.data;
};