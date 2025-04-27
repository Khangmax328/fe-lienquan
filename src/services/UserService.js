// src/services/UserService.js
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api', // fallback nếu chưa set .env
})

// Đăng nhập
export const loginUser = async (data) => {
  return await api.post('/auth/login', data)
}

// Đăng ký
export const registerUser = async (data) => {
  return await api.post('/auth/register', data)
}

// 🆕 Lấy thông tin người dùng sau khi login
export const getUserDetails = async (token) => {
    return await api.get('/user/me', {
      headers: {
        Authorization: `Bearer ${token}`
      } 
    });
};
export const updatePassword = async (data, token) => {
    return await api.put('/user/update-password', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
  
  export const getBalanceHistory = async (token) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/balance-history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res.data
  }
  export const getAllUsers = async (token) => {
    const res = await api.get('/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  };
  
  export const deleteUser = async (id, token) => {
    await api.delete(`/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };
  
  
  
  export const updateUser = async (id, userData, token) => {
    const res = await api.put(`/admin/users/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  };
  export const getUsersWithPagination = async (token, page, limit, email = '') => {
    const res = await api.get(`/admin/users?page=${page}&limit=${limit}&email=${email}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  };
  