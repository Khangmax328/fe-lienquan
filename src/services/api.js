import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
})

// export const getAllAccounts = () => api.get('/accounts')
export const getAccountById = (id) => api.get(`/accounts/${id}`)


export const getAllAccounts = (params) =>
  api.get('/accounts', { params }).then(res => res.data)

export default api;

export const getAllCategories = async () => {
  const res = await api.get('/categories')
  return res.data
}
