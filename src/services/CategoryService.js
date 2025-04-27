import axios from 'axios'
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  })
export const getAllCategories = async () => {
  const res = await api.get('/categories')
  return res.data
}
