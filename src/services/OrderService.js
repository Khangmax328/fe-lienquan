import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
})

// Tạo đơn hàng
export const createOrder = async ({ accountId, token }) => {
    console.log("⚠️ Token FE:", token) // ➕ thêm dòng này debug
    const res = await api.post(
      '/orders',
      { accountId },
      {
        headers: {
          Authorization: `Bearer ${token}`, // nhớ có chữ Bearer
        },
      }
    )
    return res.data
  }
  

// Lấy danh sách đơn hàng người dùng
export const getMyOrders = async (token) => {
  const res = await api.get('/orders/my', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data
}
// src/services/OrderService.js


export const getOrderDetails = async (id, token) => {
  const res = await api.get(`/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

export const deleteOrder = async (id, token) => {
    const res = await api.delete(`/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res.data
  }  // Trong UserService.js
  
  export const getUserInfo = async (token) => {
    const res = await axios.get('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  }
  