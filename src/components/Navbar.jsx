import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../redux/userSlide'
import './Navbar.css'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const hideAuthButtons = ['/login', '/register', '/admin'].includes(location.pathname)
  const dropdownRef = useRef(null)

  // Ẩn/hiện Navbar khi cuộn
  useEffect(() => {
    const handleScroll = () => {
      const fixedPaths = ['/home', '/login', '/register']
      if (fixedPaths.includes(location.pathname)) {
        setShowNavbar(true) // Luôn hiện
      } else {
        if (window.scrollY > lastScrollY) {
          setShowNavbar(false)
        } else {
          setShowNavbar(true)
        }
        setLastScrollY(window.scrollY)
      }
    }
  
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, location.pathname])
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.classList.contains('menu-toggle')
      ) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    dispatch(logoutUser())
    navigate('/home')
  }

  const handleProfile = () => navigate('/profile')

  return (
    <header className={`nav-header ${showNavbar ? 'show' : 'hide'}`}>
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
            {!isMobile && (
              <button onClick={handleLogout} className="nav-btn">Đăng Xuất</button>
            )}
          </>
        )}
      </div>

      {isMobile && menuOpen && (
        <nav ref={dropdownRef} className="dropdown-menu">
          <Link to="/home">TRANG CHỦ</Link>
          <Link to="/banking">NẠP ATM - VÍ</Link>
          <Link to="/order-history">LỊCH SỬ MUA</Link>
          {user?.isAdmin && location.pathname !== '/admin' && (
            <Link to="/admin">QUẢN LÝ HỆ THỐNG</Link>
          )}
          {user?.email && (
            <a className="dropdown-link" onClick={handleLogout}>ĐĂNG XUẤT</a>
          )}
        </nav>
      )}
    </header>
  )
}

export default Navbar
