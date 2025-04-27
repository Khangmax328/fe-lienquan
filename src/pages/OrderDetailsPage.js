import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import * as OrderService from '../services/OrderService'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './OrderDetailsPage.css'
import Navbar from '../components/Navbar'

const OrderDetailsPage = () => {
  const { id } = useParams()
  const user = useSelector((state) => state.user)

  const fetchOrder = async () => {
    const res = await OrderService.getOrderDetails(id, user?.access_token)
    return res?.order
  }

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-details', id],
    queryFn: fetchOrder,
    enabled: !!id && !!user?.access_token
  })

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    toast.success(`Đã sao chép: ${text}`, {
      position: 'top-center',
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
    })
  }

  if (isLoading) return <div>Loading...</div>
  if (!order) return <div>Không tìm thấy đơn hàng</div>

  const paidTime = new Date(order.paidAt)

  return (
    <>
      {/* <Header /> */}
      <Navbar/>
      <div className="order-details-container">
        <h1 className="order-details-title">CHI TIẾT TÀI KHOẢN</h1>
        <p className="order-id">#{order._id}</p>

        <table className="account-table">
          <thead>
            <tr>
              <th>Tài khoản</th>
              <th>Mật khẩu</th>
              <th>Mã code</th>
              <th>Giá</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          {/* <tbody>
            <tr>
              <td className="red">
                {order.account.username}
                <button style={{background:'blue'}} className="copy-btn" onClick={() => handleCopy(order.account.username)}>Copy</button>
              </td>
              <td className="red">
                {order.account.password}
                <button style={{background:'blue'}} className="copy-btn" onClick={() => handleCopy(order.account.password)}>Copy</button>
              </td>
              <td className="red">
                {order.account.authCode || 'Không có'}
                {order.account.authCode && (
                  <button style={{background:'blue'}} className="copy-btn" onClick={() => handleCopy(order.account.authCode)}>Copy</button>
                )}
              </td>
              <td className="red">{order.account.price.toLocaleString()} ₫</td>
              <td className="red">
                {paidTime.toLocaleTimeString('vi-VN')}<br />
                {paidTime.toLocaleDateString('vi-VN')}
              </td>
            </tr>
          </tbody> */}
          <tbody>
  <tr>
    <td className="red" data-label="Tài khoản">
      <div className="td-content">
        <div className="info-text">{order.account.username}</div>
        <button className="copy-btn" onClick={() => handleCopy(order.account.username)}>Copy</button>
      </div>
    </td>
    <td className="red" data-label="Mật khẩu">
      <div className="td-content">
        <div className="info-text">{order.account.password}</div>
        <button className="copy-btn" onClick={() => handleCopy(order.account.password)}>Copy</button>
      </div>
    </td>
    <td className="red" data-label="Mã code">
      <div className="td-content">
        <div className="info-text">{order.account.authCode || 'Không có'}</div>
        {order.account.authCode && (
          <button className="copy-btn" onClick={() => handleCopy(order.account.authCode)}>Copy</button>
        )}
      </div>
    </td>
    <td className="red" data-label="Giá">
      {order.account.price.toLocaleString()} ₫
    </td>
    <td className="red" data-label="Thời gian">
      {paidTime.toLocaleTimeString('vi-VN')}<br />
      {paidTime.toLocaleDateString('vi-VN')}
    </td>
  </tr>
</tbody>


        </table>
      </div>
      <Footer />
      <ToastContainer />
    </>
  )
}

export default OrderDetailsPage
