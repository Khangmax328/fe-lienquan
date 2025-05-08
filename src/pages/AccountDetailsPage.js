import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import * as AccountService from '../services/AccountService'
import * as OrderService from '../services/OrderService'
import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '../redux/userSlide'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner' // ✅ import spinner đẹp
import './AccountDetailsPage.css'

const AccountDetailsPage = () => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)

  const { data: account, isLoading } = useQuery({
    queryKey: ['account-details', id],
    queryFn: () => AccountService.getAccountDetails(id),
    enabled: !!id,
  })

  // const handleBuyNow = async () => {
  //   if (!user?.access_token) {
  //     Swal.fire({
  //       icon: 'warning',
  //       title: 'Quý khách vui lòng đăng nhập!',
  //       confirmButtonText: 'Đăng nhập',
  //       allowOutsideClick: false,
  //     }).then(() => {
  //       navigate('/login')
  //     })
  //     return
  //   }

  //   const result = await Swal.fire({
  //     title: 'Xác nhận mua',
  //     text: `Bạn chắc chắn muốn mua acc này với giá ${account.price.toLocaleString()}đ?`,
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonText: 'MUA NGAY',
  //   })

  //   if (result.isConfirmed) {
  //     try {
  //       const res = await OrderService.createOrder({
  //         accountId: account._id,
  //         token: user.access_token,
  //       })
  //       // Swal.fire('Thành công!', 'Tài khoản đã được mua.', 'success')
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Thành công!',
  //         text: 'Tài khoản đã được mua.',
  //         timer: 1500,  // Tự động đóng sau 2 giây
  //         showConfirmButton: false,
  //       })
  //       dispatch(updateUser({ ...user, balance: user.balance - account.price }))
  //       navigate(`/order-details/${res.order._id}`)
  //     } catch (err) {
  //       Swal.fire('Lỗi', err?.response?.data?.message || 'Lỗi khi mua tài khoản', 'error')
  //     }
  //   }
  // }
  const handleBuyNow = async () => {
    if (!user?.access_token) {
      Swal.fire({
        icon: 'warning',
        title: 'Quý khách vui lòng đăng nhập!',
        confirmButtonText: 'Đăng nhập',
        allowOutsideClick: false,
      }).then(() => {
        navigate('/login');
      });
      return;
    }
  
    const result = await Swal.fire({
      title: 'Xác nhận mua',
      text: `Bạn chắc chắn muốn mua acc này với giá ${account.price.toLocaleString()}đ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'MUA NGAY',
    });
  
    if (result.isConfirmed) {
      try {
        // Gọi API tạo đơn hàng
        const res = await OrderService.createOrder({
          accountId: account._id,
          token: user.access_token,
        });
  
        // Hiển thị thông báo thành công
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Tài khoản đã được mua.',
          timer: 1500,  // Tự động đóng sau 1.5 giây
          showConfirmButton: false,
        }).then(() => {
          // Sau khi thông báo đóng, chuyển hướng sang trang chi tiết đơn hàng
          dispatch(updateUser({ ...user, balance: user.balance - account.price }));
          navigate(`/order-details/${res.order._id}`);
        });
      } catch (err) {
        Swal.fire('Lỗi', err?.response?.data?.message || 'Lỗi khi mua tài khoản', 'error');
      }
    }
  };
  
  if (isLoading) return <LoadingSpinner /> // ✅ Loading đẹp
  if (!account) return <div>Không tìm thấy tài khoản</div>

  const displayValue = (value) => {
    return value === 0 || value === '' ? 'Bí mật' : value
  }

  return (
    <div>
      <Navbar />
      <div className="account-details-container">
        <h1 className="account-title">THÔNG TIN TÀI KHOẢN</h1>
        <p className="account-id">#{account._id}</p>

        <div className="account-info">
          <div className="account-info-item">Nick <span>{displayValue(account.name)}</span></div>
          <div className="account-info-item">Rank <span>{displayValue(account.rank)}</span></div>
          <div className="account-info-item">Tướng <span>{displayValue(account.champions)}</span></div>
          <div className="account-info-item">Trang phục <span>{displayValue(account.skins)}</span></div>
          <div className="account-info-item">Ngọc <span>{displayValue(account.gems)}</span></div>
        </div>

        <div className="account-price">GIÁ: {account.price.toLocaleString()} ₫</div>
        <p className="account-contact">Mọi thắc mắc vui lòng liên hệ Zalo: <strong>0946 869 304</strong></p>

        <div className="account-buttons">
          <button className="buy-now" onClick={handleBuyNow}>MUA NGAY</button>
        </div>

        <div className="account-image-section">
          <h3>Hình ảnh chi tiết</h3>
          {account.image?.url && (
            <img src={account.image.url} alt="Main" className="account-image" />
          )}
          {account.images?.map((img, index) => (
            <img key={index} src={img.url} alt={`Detail ${index}`} className="account-image" />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AccountDetailsPage
