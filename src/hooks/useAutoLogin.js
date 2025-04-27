// src/hooks/useAutoLogin.js
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateUser } from '../redux/userSlide'
import * as UserService from '../services/UserService'

const useAutoLogin = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return

    const fetchUser = async () => {
      try {
        const userRes = await UserService.getUserDetails(token)
        dispatch(updateUser({ ...userRes.data, access_token: token }))
      } catch (err) {
        console.error('Auto login failed:', err)
        localStorage.removeItem('access_token') // Token sai thì xoá luôn
      }
    }

    fetchUser()
  }, [dispatch])
}

export default useAutoLogin
