import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../redux/userSlide'
import './Navbar.css'


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const user = useSelector((state) => state.user)
  const hideAuthButtons = ['/login', '/register', '/admin'].includes(location.pathname)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.classList.contains('menu-toggle') // 👈 thêm điều kiện này
      ) {
        setMenuOpen(false);
      }
      
    }
  
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  const handleLogout = () => {
    localStorage.removeItem('access_token')
    dispatch(logoutUser())
    navigate('/home')
  }

  const handleProfile = () => {
    navigate('/profile')
  }

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <header className="nav-header">
      <div className="nav-left">
        {isMobile && (
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        )}
        <Link to="/home">
          <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" className="logo" />
        </Link>
      </div>

      {!isMobile && (
        <div className="header-center">
          <a href="/home" className="nav-item">TRANG CHỦ</a>
          {/* <a href="/HOME" className="nav-item">VÒNG QUAY MAY MẮN</a> */}
          <a href="/banking" className="nav-item">NẠP ATM - VÍ</a>
          <a href="/order-history" className="nav-item">LỊCH SỬ MUA</a>
          <a href="/profile" className="nav-item">QUẢN LÍ TÀI KHOẢN</a>

        </div>
      )}

<div className="nav-right">
  {!user?.email ? (
    <>
      {!hideAuthButtons && (
        <>
          <Link to="/login" className="nav-btn">Đăng Nhập</Link>
          <Link to="/register" className="nav-btn">Đăng Ký</Link>
        </>
      )}
    </>
  ) : (
    <>
      {!isMobile && user.isAdmin && location.pathname !== '/admin' && (
          <button onClick={() => navigate('/admin')} className="manage-btn">
            Quản lý hệ thống
          </button>
        )}

      <button onClick={handleProfile} className="nav-btn">
        {user.username} - ${user.balance?.toLocaleString() || 0}
      </button>

      {/* THÊM nút Đăng Xuất nếu đang ở PC */}
      {!isMobile && (
        <button onClick={handleLogout} className="nav-btn">
          Đăng Xuất
        </button>
      )}
    </>
  )}
</div>


      {isMobile && menuOpen && (
        <nav ref={dropdownRef} className="dropdown-menu">
          <Link to="/home">TRANG CHỦ</Link>
          <Link to="/transactions">LỊCH SỬ GIAO DỊCH</Link>
          <Link to="/banking">NẠP ATM - VÍ</Link>
          <Link to="/order-history">LỊCH SỬ MUA</Link>
          {(user?.isAdmin && location.pathname !== '/admin') && (
            <Link to="/admin">QUẢN LÝ HỆ THỐNG</Link>
          )}

          {/* Đăng xuất styled như các mục khác */}
          {user?.email && (
            <a className="dropdown-link" onClick={handleLogout}>ĐĂNG XUẤT</a>
          )}
        </nav>
      )}


    </header>
  )
}

export default Navbar
