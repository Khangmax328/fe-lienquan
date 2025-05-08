import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import * as UserService from '../services/UserService'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './ChangePasswordPage.css'  /* Import CSS file ở đây */

const ChangePasswordPage = () => {
  const user = useSelector((state) => state.user)
  const [loading, setLoading] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      return setMessage('Mật khẩu xác nhận không khớp!')
    }

    setLoading(true) // 👉 Bắt đầu loading

    try {
      const token = user?.access_token
      await UserService.updatePassword({ oldPassword, newPassword }, token)
      setMessage('Đổi mật khẩu thành công!')
      setSuccess(true)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      setSuccess(false)
      setMessage(error?.response?.data?.message || 'Lỗi đổi mật khẩu!')
    }

    setLoading(false) // 👉 Tắt loading
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="form-container">
          <h2 className="title">ĐỔI MẬT KHẨU</h2>

          {message && (
            <div className={`message ${success ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Mật khẩu cũ:</label>
              <input
                className="input-field"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>

            <div className="form-group">
              <label>Mật khẩu mới:</label>
              <input
                className="input-field"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Nhập mật khẩu mới"
              />
            </div>

            <div className="form-group">
              <label>Xác nhận:</label>
              <input
                className="input-field"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Xác nhận mật khẩu mới"
              />
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? <div className="spinner"></div> : 'ĐỔI MẬT KHẨU'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ChangePasswordPage
