import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CountUp from 'react-countup'
import './ProfilePage.css'
import Navbar from '../components/Navbar'


const ProfilePage = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)

  return (
    <>
    {/* <Header /> */}
    <Navbar/>
    <div className="profile-container">
  <div className="profile-box">
    <h2 className="order-history-title">THÔNG TIN TÀI KHOẢN</h2>
    <div className="profile-info">
      <p><strong>UID:</strong> {user?._id || '...'}</p>
      <p><strong>Tên tài khoản: </strong> {user?.username}</p>
      <p><strong>Gmail:</strong> {user?.email}</p>
      <p>
      <strong>Số dư tài khoản: </strong>
  <span className="profile-balance">
    <CountUp
      end={user?.balance || 0}
      duration={1.2}
      separator="."
      suffix="đ"
    />
  </span>
  <button className="btn-topup" onClick={() => navigate('/banking')}>Nạp thêm</button>
      </p>
      <p><strong>Số dư kim cương:</strong> {user?.diamond || 0}</p>
      <p><strong>Số dư quân huy:</strong> {user?.coin || 0}</p>
      <p><strong>Ngày tham gia:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '...'}</p>
    </div>

    <div style={{ textAlign: 'center' }}>
      <a href="/change-password" className="change-password-link">Đổi mật khẩu</a>
    </div>
  </div>
</div>
    <Footer />
    </>
  )
}

export default ProfilePage
