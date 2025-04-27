import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api'
})

export const createAccount = async (data, token) => {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'images') {
      for (let file of value) {
        formData.append('images', file)
      }
    } else if (key === 'image') {
      formData.append('image', value)
    } else {
      formData.append(key, value)
    }
  })

  const res = await api.post('/accounts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  })

  return res.data
}




// 🆕 Lấy chi tiết tài khoản theo ID
export const getAccountDetails = async (id) => {
  const response = await api.get(`/accounts/${id}`)
  return response.data
}


export const getAllAccountsForAdmin = async (token, params = {}) => {
  const response = await api.get('/accounts/admin', {
    headers: { Authorization: `Bearer ${token}` },
    params
  });
  return response.data;
}


export const deleteAccount = async (id, token) => {
  const response = await api.delete(`/accounts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateAccount = async (id, data, token) => {
  const response = await api.put(`/accounts/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
