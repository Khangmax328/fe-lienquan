import React, { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './SignUpPage.css'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../services/UserService'
import Navbar from '../components/Navbar'

const SignUpPage = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false) // ✅ Thêm loading
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      Swal.fire('Lỗi', 'Mật khẩu xác nhận không khớp!', 'error')
      return
    }

    try {
      setIsLoading(true) // 👉 bật loading
      const res = await registerUser({ username, email, password, confirmPassword })
      Swal.fire('Thành công', 'Tạo tài khoản thành công!', 'success')
      navigate('/login')
    } catch (err) {
      Swal.fire('Lỗi', err?.response?.data?.message || 'Lỗi khi đăng ký', 'error')
    } finally {
      setIsLoading(false) // 👉 tắt loading
    }
  }

  return (
    <>
      {/* <Header /> */}
      <Navbar />
      <div className="signup-container">
        <h2>Đăng ký thành viên</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
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
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn-signup" disabled={isLoading}>
            {isLoading ? (
              <div className="spinner"></div> // 👉 Nếu loading thì hiện spinner
            ) : (
              'Đăng ký'
            )}
          </button>

          <div className="signup-separator">- Bạn đã có tài khoản -</div>
          <button type="button" className="btn-register" onClick={() => navigate('/login')}>
            Đăng nhập
          </button>
        </form>
      </div>
      <Footer />
    </>
  )
}

export default SignUpPage
