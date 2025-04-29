import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'

import * as OrderService from '../services/OrderService'
import * as UserService from '../services/UserService'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './OrderHistoryPage.css'
import Navbar from '../components/Navbar'

const OrderHistoryPage = () => {
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const fetchMyOrders = async () => {
    const res = await OrderService.getMyOrders(user?.access_token)
    return res
  }

  const fetchBalanceHistory = async () => {
    const res = await UserService.getBalanceHistory(user?.access_token)
    return res
  }

  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: fetchMyOrders,
    enabled: !!user?.access_token,
  })

  const { data: history } = useQuery({
    queryKey: ['balance-history'],
    queryFn: fetchBalanceHistory,
    enabled: !!user?.access_token,
  })

  const handleDeleteOrder = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn chắc chắn?',
      text: 'Đơn hàng sẽ bị xóa khỏi lịch sử!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    })

    if (result.isConfirmed) {
      try {
        await OrderService.deleteOrder(id, user.access_token)
        await queryClient.invalidateQueries(['my-orders'])
        Swal.fire('Đã xóa!', 'Đơn hàng đã được xóa.', 'success')
      } catch (err) {
        Swal.fire('Lỗi', err.response?.data?.message || 'Xóa thất bại', 'error')
      }
    }
  }

  return (
    <>
      <Navbar/>
      <div className="order-history-container">
        <h1 className="order-history-title">LỊCH SỬ MUA TÀI KHOẢN</h1>

        {/* Loading đẹp */}
        {isLoading ? (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Tài khoản</th>
                <th>Mật khẩu</th>
                <th>Mã Authentication</th>
                <th>Giá</th>
                <th>Thời gian</th>
                <th>Chi tiết</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {orders?.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td>{order?.account?.username}</td>
                    <td>{order?.account?.password}</td>
                    <td>{order?.account?.authCode}</td>
                    <td>{order?.account?.price?.toLocaleString?.() || 0} đ</td>
                    <td>
                      {new Date(order?.paidAt).toLocaleTimeString()}<br />
                      {new Date(order?.paidAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button className="detail-btn" onClick={() => navigate(`/order-details/${order._id}`)}>Chi tiết</button>
                    </td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDeleteOrder(order._id)}>Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ color: 'gray', fontStyle: 'italic', fontSize: '20px' }}>
                    Bạn chưa mua tài khoản nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  )
}

export default OrderHistoryPage
