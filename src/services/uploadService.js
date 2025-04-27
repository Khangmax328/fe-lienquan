// services/uploadService.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
});

// uploadSingleImage trả về object { url, public_id }
export const uploadSingleImage = async (file, token) => {
    const formData = new FormData();
    formData.append('image', file);
  
    const res = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  
    return res.data; // ✅ return object { url, public_id }
  };
  

export const uploadMultipleImages = async (files, token) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));

  const res = await api.post('/upload/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


export const uploadCategoryWithImage = async ({ name, imageFile, token }) => {
  const formData = new FormData();
  formData.append('name', name);           // ✅ text
  formData.append('image', imageFile);     // ✅ file

  const res = await api.post('/categories', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.category;
};
