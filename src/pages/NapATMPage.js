import React, { useEffect, useState } from 'react'
import './NapATMPage.css'
import { useSelector } from 'react-redux'
import Header from '../components/Header'
import Footer from '../components/Footer'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import Navbar from '../components/Navbar'

const NapATMPage = () => {
  const user = useSelector((state) => state.user)
  console.log("🌟 user redux:", user)

  const [paymentInfo, setPaymentInfo] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (user === undefined) return; // chờ Redux
  
    console.log("🧠 user redux:", user)
  
    if (!user || typeof user._id !== 'string') {
      Swal.fire({
        title: 'Thông báo',
        text: 'Quý khách vui lòng đăng nhập để tiếp tục!',
        icon: 'warning',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then(() => {
        navigate('/login')
      })
      return
    }
  
    // ✅ Gọi API nếu đã login
    const fetchPaymentInfo = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/payment-info`)
        const info = res.data[0]
        const transferNote = `NAP ${user._id.slice(-6)}`
        setPaymentInfo({ ...info, transferNote })
      } catch (error) {
        console.error('❌ Lỗi khi lấy thông tin nạp:', error)
      }
    }
  
    fetchPaymentInfo()
  }, [user, navigate])
  
  const handleConfirmTransfer = () => {
    Swal.fire({
      icon: 'success',
      title: 'Bạn đã xác nhận thành công!',
      showConfirmButton: false,
      timer: 2000
    })
  }
  

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `Đã sao chép: ${text}`,
      showConfirmButton: false,
      timer: 1500
    })
  }

  if (!paymentInfo) {
    return (
      <>
        {/* <Header /> */}
        <Navbar/>
        <div className="napatm-container">
          <h2>Đang tải thông tin nạp...</h2>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      {/* <Header /> */}
      <Navbar/>
      <div className="napatm-container">
        <h1 className="napatm-title">NẠP ATM - VÍ</h1>

        <div className="napatm-field">
          <label>Số tài khoản:</label>
          <div className="napatm-row">
            <input value={paymentInfo.accountNumber} disabled />
            <button className="copy-btn" onClick={() => handleCopy(paymentInfo.accountNumber)}>Copy</button>
          </div>
        </div>

        <div className="napatm-field">
          <label>Ngân Hàng:</label>
          <input value={paymentInfo.bankName} disabled />
        </div>

        <div className="napatm-field">
          <label>Họ và tên:</label>
          <input value={paymentInfo.fullName} disabled />
        </div>
        <div className="napatm-field">
          <label>Nội dung:</label>
          <div className="napatm-row">
            <input value={paymentInfo.transferNote} disabled />
            <button className="copy-btn" onClick={() => handleCopy(paymentInfo.transferNote)}>Copy</button>
          </div>
        </div>
        <div className="napatm-qr">
          <img src={paymentInfo.qrImage?.url} alt="QR Code" />
        </div>

        <div className="napatm-note">
          Nội dung chuyển tiền là <strong>{paymentInfo.transferNote}</strong> để được xử lí tự động
        </div>
        <div className="napatm-warning">
          Sau khi chuyển khoản xong vui lòng bấm xác nhận đã chuyển. Kiểm tra
        </div>

        <div className="napatm-confirm">
        <button onClick={handleConfirmTransfer}>Xác nhận đã chuyển khoản</button>

        </div>
      </div>
      <Footer />
    </>
  )
}

export default NapATMPage
