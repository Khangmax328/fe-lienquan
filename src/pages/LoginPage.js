import React, { useState } from 'react'
import './LoginPage.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../services/UserService'
import { useDispatch } from 'react-redux'
import { updateUser } from '../redux/userSlide'
import Navbar from '../components/Navbar'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await UserService.loginUser({ email, password })
      const token = res.data.token // ✅ đúng field
      localStorage.setItem('access_token', token)

      // Gọi API lấy thông tin người dùng
      const userRes = await UserService.getUserDetails(token)

      // Lưu user vào redux
      dispatch(updateUser({ ...userRes.data, access_token: token }))

      navigate('/home')
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Đăng nhập thất bại')
    }
  }

  return (
    <>
      {/* <Header /> */}
      <Navbar/>
      <div className="login-container">
        <h2>Đăng nhập hệ thống</h2>
        {errorMessage && <div className="login-error">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className="remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />
            Ghi nhớ
          </label>

          <button type="submit" className="btn-login">Đăng nhập</button>

          <div className="login-separator">- HOẶC -</div>

          <button
            type="button"
            className="btn-register"
            onClick={() => navigate('/register')}
          >
            Tạo tài khoản
          </button>
        </form>
      </div>
      <Footer />
    </>
  )
}

export default LoginPage
