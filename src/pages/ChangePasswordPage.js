import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import * as UserService from '../services/UserService'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import './ChangePasswordPage.css'

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
    {/* <Header/> */}
    <Navbar/>
    <div style={{ padding: '30px', background: '#f5f5f5' }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: '#fff',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 className='order-history-title'>ĐỔI MẬT KHẨU</h2>

        {message && (
          <div style={{
            color: success ? 'green' : 'red',
            textAlign: 'center',
            marginBottom: '20px',
            fontWeight: 'bold'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleChangePassword}>
          <div style={{ marginBottom: '15px' }}>
            <label >Mật khẩu cũ:</label>
            <input className='labelcss'
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              placeholder="Nhập mật khẩu hiện tại"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label >Mật khẩu mới:</label>
            <input className='labelcss'
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Nhập mật khẩu mới"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Xác nhận:</label>
            <input className='labelcss'
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Xác nhận mật khẩu mới"
              style={inputStyle}
            />
          </div>

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? <div className="spinner"></div> : 'ĐỔI MẬT KHẨU'}
          </button>

        </form>
      </div>
    </div>
    <Footer/>
    </>
  )
}

const inputStyle = {
  width: '93%',
  padding: '10px',
  marginTop: '5px',
  borderRadius: '4px',
  border: '1px solid #ccc'
}

const buttonStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#1abc9c',
  border: '1px solid #1abc9c',
  color: 'white',
  fontWeight: 'bold',
  borderRadius: '4px',
  marginTop: '10px',
  cursor: 'pointer'
}

export default ChangePasswordPage
