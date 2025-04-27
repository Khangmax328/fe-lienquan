import React from 'react'
import './Header.css'
import logo from '../assets/logo.png'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../redux/userSlide'

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const user = useSelector((state) => state.user)
  const hideAuthButtons = ['/login', '/register', '/admin'].includes(location.pathname)

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    dispatch(logoutUser())
    navigate('/home')
  }
  const handleProfile =()=>{
    navigate('/profile')

  }

  return (
    <div className="header">
      <div onClick={()=>navigate('/home')} style={{cursor: 'pointer'}} className="header-left">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="header-center">
        <a href="/home" className="nav-item">TRANG CHỦ</a>
        <a href="/nap-history" className="nav-item">LỊCH SỬ GIAO DỊCH</a>
        <a href="/banking" className="nav-item">NẠP ATM - VÍ</a>
        <a href="/order-history" className="nav-item">LỊCH SỬ MUA</a>
      </div>

      <div className="header-right">
        {!user?.email ? (
          <>
            <button
              onClick={() => navigate('/login')}
              className={`login-btn ${hideAuthButtons ? 'hidden' : ''}`}
            >
              Đăng Nhập
            </button>
            <button
              onClick={() => navigate('/register')}
              className={`register-btn ${hideAuthButtons ? 'hidden' : ''}`}
            >
              Đăng ký
            </button>
          </>
        ) : (
          <>
          {user.isAdmin && (
              <button onClick={() => navigate('/admin')}
              className={`manage-btn ${hideAuthButtons ? 'hidden' : ''}`}
               >
                Quản lý
              </button>
            )}

            <button onClick={handleProfile} className="login-btn">
              {user.username} - ${user.balance?.toLocaleString() || 0}
            </button>
            <button onClick={handleLogout} className="register-btn">Đăng xuất</button>
          </>
        )}
      </div>
    </div>
  )
}

export default Header
