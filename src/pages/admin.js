import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

import * as AccountService from '../services/AccountService';
import * as UserService from '../services/UserService';
import * as uploadService from '../services/uploadService';

import { useSelector } from 'react-redux';

import * as CategoryService from '../services/CategoryService'
import api from '../services/api'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function AdminDashboard() {
  const [showDeletePaymentConfirm, setShowDeletePaymentConfirm] = useState(false);
const [isDeletingPayment, setIsDeletingPayment] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [sortUserDate, setSortUserDate] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [searchUsername, setSearchUsername] = useState('');
const [isDeleting, setIsDeleting] = useState(false);
  const user = useSelector((state) => state.user);
  const [selectedTab, setSelectedTab] = useState('accounts');
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [filterSoldStatus, setFilterSoldStatus] = useState('all');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [editAccount, setEditAccount] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [types, setTypes] = useState([])
  const [showAddType, setShowAddType] = useState(false)
  const [newTypeName, setNewTypeName] = useState('')
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [categoryToast, setCategoryToast] = useState('')
  const [categoryChanged, setCategoryChanged] = useState(false);
  const [showUserConfirm, setShowUserConfirm] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [userPage, setUserPage] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
const [userTotalPages, setUserTotalPages] = useState(1);
const [newCategoryImage, setNewCategoryImage] = useState(null);
const [isAddingCategory, setIsAddingCategory] = useState(false);
const [isSavingPayment, setIsSavingPayment] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '', type: '', price: '', champions: '', skins: '', gems: '',
    username: '', password: '', authCode: '', rank: '',
    image: null, images: [],
  })
  const [isUpdating, setIsUpdating] = useState(false);
  const [typeList, setTypeList] = useState([])
  const [editUser, setEditUser] = useState(null);
  const userLogin = useSelector((state) => state.user);
  const limit = 50;
  const [soldAccountsPage, setSoldAccountsPage] = useState(1);
const soldAccountsPerPage = 50;
const [showSidebar, setShowSidebar] = useState(false);
const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
const soldAccounts = accounts.filter(acc => acc.isSold);
const totalSoldPages = Math.ceil(soldAccounts.length / soldAccountsPerPage);
const displayedSoldAccounts = soldAccounts.slice(
  (soldAccountsPage - 1) * soldAccountsPerPage,
  soldAccountsPage * soldAccountsPerPage
);
const [paymentInfo, setPaymentInfo] = useState(null);
const [editPayment, setEditPayment] = useState(false);
const [qrFile, setQrFile] = useState(null);
  const handleCloseCategoryManager = async () => {
    if (categoryChanged) {
      try {
        const refreshedTypes = await CategoryService.getAllCategories();
        setTypeList(refreshedTypes);
  
        // 🔥 Cập nhật lại danh sách tài khoản sau khi sửa/xóa loại
        await fetchData(); 
      } catch (err) {
        console.error('Lỗi khi load lại dữ liệu:', err);
      }
      setCategoryChanged(false);
    }
    setShowCategoryManager(false);
  };
  
  const handleDeletePayment = async () => {
    setIsDeletingPayment(true);
    try {
      await api.delete(`/payment-info/${paymentInfo._id}`, {
        headers: { Authorization: `Bearer ${user.access_token}` },
      });
      setPaymentInfo(null);
      setToastMessage('✅ Đã xoá thông tin');
    } catch (err) {
      console.error('Lỗi xoá:', err);
      setToastMessage('❌ Lỗi khi xoá thông tin');
    }
    setIsDeletingPayment(false);
    setShowDeletePaymentConfirm(false);
    setTimeout(() => setToastMessage(''), 2000);
  };
  

  const fetchData = async (page = 1, usernameFilter = '') => {
    try {
      if (user?.isAdmin) {
        const data = await AccountService.getAllAccountsForAdmin(user.access_token, {
          page,
          limit: 50,
          username: usernameFilter
        });
        setAccounts(data.accounts);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách acc:', error);
    }
  };
  useEffect(() => {
    console.log('Tab hiện tại:', selectedTab);
  }, [selectedTab]);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    fetchData(currentPage, searchUsername);
  }, [currentPage, searchUsername]);
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await CategoryService.getAllCategories()
        setTypeList(res) // hoặc res.categories tuỳ vào BE
      } catch (err) {
        console.error('Lỗi lấy loại acc:', err)
      }
    }
  
    fetchData()
    fetchTypes()
  }, [])
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await UserService.getAllUsers(user.access_token)
        const userArray = Array.isArray(res) ? res : res.users
        setUsers(userArray || [])
      } catch (err) {
        console.error('Lỗi khi lấy user:', err)
      }
    }
  
    fetchUsers()
  }, [])
  
  const fetchUsers = async (page = 1) => {
    try {
      const res = await UserService.getUsersWithPagination(user.access_token, page, 10, searchEmail);
      let userArray = Array.isArray(res.users) ? res.users : [];
  
      if (sortUserDate === 'asc') {
        userArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else {
        userArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
  
      setUsers(userArray);
      setUserPage(res.currentPage);
      setUserTotalPages(res.totalPages);
    } catch (err) {
      console.error('Lỗi khi lấy user:', err);
    }
  };
  
  useEffect(() => {
    fetchUsers(userPage);
  }, [searchEmail, sortUserDate, userPage]);
  

  
  
//   useEffect(() => {
//     fetchData();
//   }, []);
const handleUpdateUser = async () => {
  try {
    await UserService.updateUser(editUser._id, {
      isAdmin: editUser.isAdmin,
      balance: editUser.balance,
    }, user.access_token);

    setToastMessage('✅ Cập nhật user thành công!');
    setEditUser(null);
    fetchUsers();
  } catch (err) {
    console.error('Lỗi cập nhật user:', err);
    setToastMessage('❌ Lỗi khi cập nhật user!');
  }
  setTimeout(() => setToastMessage(''), 1500);
};




  const handleAskDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };
  const handleAskDeleteUser = (id) => {
    setDeleteUserId(id);
    setShowUserConfirm(true);
  };
  const handleUpdateAccount = async () => {
    setIsUpdating(true);
    try {
      const updatedData = { ...editAccount };
  
      // Nếu ảnh là File, mới upload
      if (editAccount.image instanceof File) {
        const uploaded = await uploadService.uploadSingleImage(editAccount.image, user.access_token);
        updatedData.image = uploaded; // ✅ giữ nguyên object { url, public_id }
      }
      
      
  
      if (Array.isArray(editAccount.images) && editAccount.images[0] instanceof File) {
        const uploaded = await uploadService.uploadMultipleImages(editAccount.images, user.access_token);
        // 🔧 Fix: gói mỗi url thành object
        updatedData.images = uploaded.map(img => ({ url: img.url }));
      }
      
      
  
      await AccountService.updateAccount(editAccount._id, updatedData, user.access_token);
      setEditAccount(null);
      fetchData();
  
      setToastMessage('Đã cập nhật tài khoản thành công!');
      setTimeout(() => setToastMessage(''), 1500);
    } catch (err) {
      console.error('Lỗi khi cập nhật:', err);
      setToastMessage('Lỗi khi cập nhật!');
      setTimeout(() => setToastMessage(''), 1500);
    }
    setIsUpdating(false); // 👉 dừng loading
  setTimeout(() => setToastMessage(''), 1500);
  };
  
  const handleCreateAccount = async () => {
    setIsCreating(true); // nếu đang dùng spinner loading
  
    try {
      await AccountService.createAccount(newAccount, user.access_token);
      setToastMessage('Tạo acc thành công!');
      setShowCreateModal(false);
      fetchData();
  
      // ✅ Reset form sau khi tạo xong
      setNewAccount({
        name: '', type: '', price: '', champions: '', skins: '', gems: '',
        username: '', password: '', authCode: '', rank: '',
        image: null, images: [],
      });
    } catch (err) {
      setToastMessage('Tạo acc thất bại!');
      console.error(err);
    }
  
    setIsCreating(false); // dừng spinner
    setTimeout(() => setToastMessage(''), 1500);
  };
  
  
  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const res = await api.get('/payment-info');
        if (res.data?.length > 0) {
          setPaymentInfo(res.data[0]); // chỉ có 1
        } else {
          setPaymentInfo(null);
        }
      } catch (err) {
        console.error('Lỗi lấy payment info:', err);
      }
    };
    fetchPaymentInfo();
  }, []);
  
  
  const confirmDeleteUser = async () => {
    try {
      await UserService.deleteUser(deleteUserId, user.access_token);
      setShowUserConfirm(false);
      setDeleteUserId(null);
  
      // Reload user list
      const res = await UserService.getAllUsers(user.access_token);
      const userArray = Array.isArray(res) ? res : res.users;
      setUsers(userArray || []);
  
      setToastMessage('✅ Đã xoá user thành công!');
      setTimeout(() => setToastMessage(''), 1500);
    } catch (err) {
      setToastMessage('❌ Lỗi khi xoá user!');
      setTimeout(() => setToastMessage(''), 2000);
      console.error('Lỗi xoá user:', err);
    }
  };
  
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await AccountService.deleteAccount(deleteId, user.access_token);
      setShowConfirm(false);
      setDeleteId(null);
      fetchData();
      setToastMessage('Đã xoá tài khoản thành công!');
    } catch (err) {
      setToastMessage('Lỗi khi xoá!');
    }
    setTimeout(() => setToastMessage(''), 1500);
    setIsDeleting(false);
  };
  
  
  

const handleDeleteUser = async (id) => {
  try {
    await UserService.deleteUser(id, user.access_token);
    fetchData();
  } catch (err) {
    console.error('Lỗi xoá user:', err.response?.data || err.message);
  }
};

  

  return (
    <>
    {/* <Header /> */}
    <Navbar/>
    {isMobile && (
          <button className="menu-toggle1" onClick={() => setShowSidebar(!showSidebar)}>
            ☰ Menu
          </button>
        )}
    <div className="admin-container">
      <div className={`sidebar ${showSidebar ? 'show' : ''}`} >
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)} // 👉 Bấm ra ngoài thì tắt sidebar
        ></div>
      )}
       
         <h3
              className={selectedTab === 'accounts' ? 'active-tab' : ''}
              onClick={() => {
                setSelectedTab('accounts');
                if (isMobile)
                setShowSidebar(false);} // 👈 thêm dòng này
              }
            >
              Tài khoản game
            </h3>
        <p style={{marginLeft: '10px', fontWeight:'bold'}}>Quản lí tất cả tài khoản</p>
        
        <h3 className={selectedTab === 'users' ? 'active-tab' : ''} onClick={() =>{ setSelectedTab('users');if (isMobile)  setShowSidebar(false)}}>Người dùng</h3>
        <p style={{marginLeft: '10px', fontWeight:'bold'}} >Sửa, xoá user</p>
        <h3
          className={selectedTab === 'payment' ? 'active-tab' : ''}
          onClick={() => {
            setSelectedTab('payment');
            if (isMobile) setShowSidebar(false);
          }}
        >
          Quản lý ATM - Ví
        </h3>
        <p style={{marginLeft: '10px', fontWeight:'bold'}}>Cài đặt thông tin chuyển khoản</p>

        {/* <h3 className={selectedTab === 'accounts' ? 'active-tab' : ''} onClick={() => setSelectedTab('accounts')}>Tài khoản game</h3>
         */}
        <h3 className={selectedTab === 'revenue' ? 'active-tab' : ''} onClick={() =>{ setSelectedTab('revenue'); if (isMobile) setShowSidebar(false) }}>Doanh thu</h3>
        <p style={{marginLeft: '10px', fontWeight:'bold'}} >Xem thống kê doanh thu</p>
      </div>
      
 
      <div key={selectedTab} className="main-content">
        {selectedTab === 'accounts' && (
          <div className='tab-accounts'>
            <div className="header-section">
            <h2 className='heading-section'> Quản lý tài khoản game </h2>
            <div className="action-buttons">
              <button  className="create-btn" onClick={() => setShowCreateModal(true)}>Tạo tài khoản</button>
              <button className="create-btn" onClick={() => setShowCategoryManager(true)}>Quản lý loại</button>
              
              </div>
            </div>
              <div style={{ marginBottom: '10px' }}>
                
          </div>
          <div className="filter-row">
            <label className="filter-label">Lọc theo trạng thái:</label>
            <select
              className="filter-select"
              value={filterSoldStatus}
              onChange={(e) => setFilterSoldStatus(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="sold">Đã bán</option>
              <option value="unsold">Chưa bán</option>
            </select>
            <input 
              type="text"
              className="search-username"
              placeholder="Tìm theo username..."
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
            />
          </div>


            <table className="accounts-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên</th>
                  <th>Loại</th>
                  <th>Giá</th>
                  <th>Tướng</th>
                  <th>Skin</th>
                  <th>Ngọc</th>
                  <th>Rank</th>
                  <th>Đã bán</th>
                  {user?.isAdmin && (
                    <>
                      <th>Username</th>
                      <th>Password</th>
                      <th>Mã xác thực</th>
                    </>
                  )}
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {accounts
                  .filter((acc) => {
                    if (filterSoldStatus === 'sold') return acc.isSold === true;
                    if (filterSoldStatus === 'unsold') return acc.isSold === false;
                    return true;
                  })
                  .map((acc, index) => (
                    <tr key={acc._id}>
                      <td>{(currentPage - 1) * limit + index + 1}</td>
                      <td>{acc.name}</td>
                      <td>{acc.type?.name || '—'}</td>
                      <td>{acc.price.toLocaleString()}₫</td>
                      <td>{acc.champions}</td>
                      <td>{acc.skins}</td>
                      <td>{acc.gems}</td>
                      <td>{acc.rank}</td>
                      <td style={{ color: acc.isSold ? 'green' : 'red', fontWeight: 'bold' }}>
                        {acc.isSold ? '✔️' : '✖️'}
                      </td>
                      {user?.isAdmin && (
                        <>
                          <td>{acc.username}</td>
                          <td>{acc.password}</td>
                          <td>{acc.authCode || '—'}</td>
                        </>
                      )}
                      <td>
                      <button style={{marginBottom:'5px'}} onClick={() => setEditAccount(acc)}>Sửa</button>
                        <button onClick={() => handleAskDelete(acc._id)}>Xoá</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="pagination-controls">
  <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
    Trang trước
  </button>
  <span>Trang {currentPage} / {totalPages}</span>
  <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
    Trang sau
  </button>
</div>
          </div>
        )}

        {selectedTab === 'users' && (
                    <div className="tab-users">
                      <h2 className='heading-section'>Quản lý người dùng</h2>

                      <div className="filter-row">
                      <select
                        value={sortUserDate}
                        onChange={(e) => setSortUserDate(e.target.value)}
                      >
                        <option value="desc">Ngày tạo: Mới nhất</option>
                        <option value="asc">Ngày tạo: Cũ nhất</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Tìm theo email..."
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                      />
                    
                    </div>


                      <table className="users-table" >
                        <thead>
                          <tr>
                            <th className="user-stt">STT</th>
                            <th >Tên</th>
                            <th className="user-email">Email</th>
                            <th>Role</th>
                            <th className="user-balance">Số dư</th>
                            <th>Ngày tạo</th>
                            <th className="user-action">Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user, index) => (
                            <tr key={user._id}>
                                <td className="user-stt">{(currentPage - 1) * limit + index + 1}</td>
                              <td >{user.username}</td>
                              <td className="user-email">{user.email}</td>
                              <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                              <td className="user-balance" >{user.balance?.toLocaleString() || '0'}₫</td>
                              <td>{new Date(user.createdAt).toLocaleString()}</td>
                              <td className="user-action">
                                <button onClick={() => setEditUser(user)}>Sửa</button>
                                {user._id !== userLogin._id && (
                                  <button onClick={() => handleAskDeleteUser(user._id)}>Xoá</button>
                                )}


                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="pagination-controls">
          <button onClick={() => setUserPage((p) => Math.max(p - 1, 1))} disabled={userPage === 1}>
            Trang trước
          </button>
          <span>Trang {userPage} / {userTotalPages}</span>
          <button onClick={() => setUserPage((p) => Math.min(p + 1, userTotalPages))} disabled={userPage === userTotalPages}>
            Trang sau
          </button>
        </div>

                    </div>
                  )}
          
            {selectedTab === 'revenue' && (
              <div className="tab-revenue">
                <h2 className='heading-section'>Thống kê doanh thu</h2>

                <div className="revenue-summary">
                    <p><strong>Tổng số acc đã bán:</strong> {soldAccounts.length}</p>
                    <p><strong>Tổng doanh thu:</strong> {soldAccounts.reduce((total, acc) => total + acc.price, 0).toLocaleString()}₫</p>
                  </div>

                  <table>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Tên</th>
                        <th>Loại</th>
                        <th>Giá</th>
                        <th>Rank</th>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Mã xác thực</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedSoldAccounts.map((acc, index) => (
                        <tr key={acc._id}>
                          <td>{(soldAccountsPage - 1) * soldAccountsPerPage + index + 1}</td>
                          <td>{acc.name}</td>
                          <td>{acc.type?.name || '—'}</td>
                          <td>{acc.price.toLocaleString()}₫</td>
                          <td>{acc.rank}</td>
                          <td>{acc.username}</td>
                          <td>{acc.password}</td>
                          <td>{acc.authCode || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="pagination-controls">
                    <button onClick={() => setSoldAccountsPage(p => Math.max(p - 1, 1))} disabled={soldAccountsPage === 1}>
                      Trang trước
                    </button>
                    <span>Trang {soldAccountsPage} / {totalSoldPages}</span>
                    <button onClick={() => setSoldAccountsPage(p => Math.min(p + 1, totalSoldPages))} disabled={soldAccountsPage === totalSoldPages}>
                      Trang sau
                    </button>
                  </div>
              </div>
            )}

{selectedTab === 'payment' && (
  <div className="tab-payment">
    <h2 className='heading-section'>Quản lý ATM - Ví</h2>

    {paymentInfo ? (
      <div className="payment-box">
              <p><strong>Ngân hàng:</strong> <span style={{ color: 'red', fontWeight:'bold' }}>{paymentInfo.bankName}</span></p>
              <p><strong>Chủ tài khoản:</strong> <span style={{ color: 'red', fontWeight:'bold' }}>{paymentInfo.fullName}</span></p>
              <p><strong>Số tài khoản:</strong> <span style={{ color: 'red', fontWeight:'bold' }}>{paymentInfo.accountNumber}</span></p>

                {/* <p><strong>Nội dung chuyển khoản:</strong> {paymentInfo.transferNote}</p> */}
                {paymentInfo.qrImage?.url && (
                  <img src={paymentInfo.qrImage.url} alt="QR code" style={{ maxWidth: '200px', marginTop: '10px' }} />
                )}
                <div style={{ marginTop: '10px' }}>
                  <button class="btn-ok" style={{background:'blue'}} onClick={() => setEditPayment(true)}>Sửa</button>
                  <button
                      className="btn-ok"
                      style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
                      onClick={() => setShowDeletePaymentConfirm(true)}
                    >
                      Xoá
                    </button>

                </div>
              </div>
            ) : (
              <div>
                <h4>Chưa có thông tin nạp tiền nào.</h4>
                <button className='btn-ok' style={{background:'blue', fontWeight:'bold'}} onClick={() => setEditPayment(true)}>+ Tạo mới</button>
              </div>
            )}

          {editPayment && (
            <div className="edit-modal">
              <div className="edit-payment-box">
                <span className="modal-close" onClick={() => setEditPayment(false)}>✖</span> 
                <h3>Sửa thông tin</h3>

                <label>Ngân hàng:</label>
                <input
                  value={paymentInfo?.bankName || ''}
                  onChange={(e) =>
                    setPaymentInfo({ ...paymentInfo, bankName: e.target.value })
                  }
                />
                <label>Chủ tài khoản:</label>
                <input
                  value={paymentInfo?.fullName || ''}
                  onChange={(e) =>
                    setPaymentInfo({ ...paymentInfo, fullName: e.target.value })
                  }
                />
                <label>Số tài khoản:</label>
                <input
                  value={paymentInfo?.accountNumber || ''}
                  onChange={(e) =>
                    setPaymentInfo({ ...paymentInfo, accountNumber: e.target.value })
                  }
                />

                <label>Ảnh QR mới:</label>
                <input type="file" onChange={(e) => setQrFile(e.target.files[0])} />

                <div className="modal-actions">
                <button 
                onClick={async () => {
                  setIsSavingPayment(true);
                  try {
                    const formData = new FormData();
                    formData.append('bankName', paymentInfo.bankName);
                    formData.append('fullName', paymentInfo.fullName);
                    formData.append('accountNumber', paymentInfo.accountNumber);
                    if (qrFile) formData.append('qrImage', qrFile);
                
                    const config = {
                      headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.access_token}`,
                      },
                    };
                
                    if (paymentInfo._id) {
                      await api.put(`/payment-info/${paymentInfo._id}`, formData, config);
                    } else {
                      const res = await api.post('/payment-info', formData, config);
                      setPaymentInfo(res.data.data);
                    }
                
                    setToastMessage('✅ Đã lưu thông tin');
                    setEditPayment(false);
                  } catch (err) {
                    console.error('Lỗi khi lưu:', err);
                    setToastMessage('❌ Lỗi khi lưu thông tin');
                  }
                  setIsSavingPayment(false);
                  setTimeout(() => setToastMessage(''), 2000);
                }}
                
                 className="btn-ok" disabled={isSavingPayment}>
                {isSavingPayment ? 'Đang lưu...' : 'Lưu'}
              </button>
                  <button className="btn-cancel" onClick={() => setEditPayment(false)}>Huỷ</button>
                </div>
              </div>
            </div>
          )}


          </div>
        )}

      </div>

      {/* Modal xác nhận xoá */}
      {showConfirm && (
  <div className="confirm-modal">
    <div className="confirm-box">
      {isDeleting ? (
        <div className="spinner-center" />
      ) : (
        <>
          <p>Bạn có chắc muốn xoá tài khoản này không?</p>
          <div className="modal-actions">
            <button className="btn-ok" onClick={confirmDelete}>Đồng ý</button>
            <button className="btn-cancel" onClick={() => setShowConfirm(false)}>Huỷ</button>
          </div>
        </>
      )}
    </div>
  </div>
)}

      {/* {toastMessage && (    
  <div className="toast-message">{toastMessage}</div>
)} */}
    </div>
    {editAccount && (
  <div className="edit-modal">
    <div className="edit-box">
      <span className="modal-close" onClick={() => setEditAccount(null)}>✖</span>
      <h3 style={{ color: 'red', fontWeight: '700', border: '2px solid blue' }}>Sửa tài khoản</h3>

      {toastMessage && <div className="toast-message">{toastMessage}</div>}

      <label>Tên:</label>
      <input value={editAccount.name} onChange={(e) => setEditAccount({ ...editAccount, name: e.target.value })} />

      <label>Rank:</label>
      <select
        style={{ cursor: 'pointer' }}
        value={editAccount.rank}
        onChange={(e) => setEditAccount({ ...editAccount, rank: e.target.value })}
      >
        <option value="">-- Chọn rank --</option>
        <option value="Bạc">Bạc</option>
        <option value="Vàng">Vàng</option>
        <option value="Bạch Kim">Bạch Kim</option>
        <option value="Kim Cương">Kim Cương</option>
        <option value="Tinh Anh">Tinh Anh</option>
        <option value="Cao Thủ">Cao Thủ</option>
        <option value="Thách Đấu">Thách Đấu</option>
      </select>

      <label>Loại:</label>
      <select
        style={{ cursor: 'pointer' }}
        value={editAccount.type}
        onChange={(e) => {
          const value = e.target.value;
          if (value === '__new') {
            setShowAddType(true);
            setEditAccount({ ...editAccount, type: '' });
          } else {
            setShowAddType(false);
            setEditAccount({ ...editAccount, type: value });
          }
        }}
      >
        <option value="">-- Chọn loại --</option>
        {typeList.map((type) => (
          <option key={type._id} value={type._id}>{type.name}</option>
        ))}
      </select>

      <label>Giá:</label>
      <input type="number" value={editAccount.price} onChange={(e) => setEditAccount({ ...editAccount, price: e.target.value })} />

      <label>Tướng:</label>
      <input type="number" value={editAccount.champions} onChange={(e) => setEditAccount({ ...editAccount, champions: e.target.value })} />

      <label>Skin:</label>
      <input type="number" value={editAccount.skins} onChange={(e) => setEditAccount({ ...editAccount, skins: e.target.value })} />

      <label>Ngọc:</label>
      <input type="number" value={editAccount.gems} onChange={(e) => setEditAccount({ ...editAccount, gems: e.target.value })} />

      <label>Username:</label>
      <input value={editAccount.username} onChange={(e) => setEditAccount({ ...editAccount, username: e.target.value })} />

      <label>Password:</label>
      <input value={editAccount.password} onChange={(e) => setEditAccount({ ...editAccount, password: e.target.value })} />

      <label>Mã xác thực:</label>
      <input value={editAccount.authCode || ''} onChange={(e) => setEditAccount({ ...editAccount, authCode: e.target.value })} />

      <label>Đã bán:</label>
      <select value={editAccount.isSold} onChange={(e) => setEditAccount({ ...editAccount, isSold: e.target.value === 'true' })}>
        <option value="false">Chưa bán</option>
        <option value="true">Đã bán</option>
      </select>

      <label>Ảnh đại diện:</label>
      <input type="file" onChange={(e) => setEditAccount({ ...editAccount, image: e.target.files[0] })} />
      <p style={{ fontSize: '13px', fontStyle: 'italic' }}>(Nếu không chọn ảnh mới, sẽ giữ ảnh cũ)</p>

      <label>Ảnh chi tiết (nhiều):</label>
      <input type="file" multiple onChange={(e) => setEditAccount({ ...editAccount, images: Array.from(e.target.files) })} />
      <p style={{ fontSize: '13px', fontStyle: 'italic' }}>(Không chọn sẽ giữ ảnh chi tiết cũ)</p>

      <div className="modal-actions">
        <button className="btn-ok" style={{ marginRight: '-10px' }} onClick={handleUpdateAccount} disabled={isUpdating}>
          {isUpdating ? 'Đang cập nhật...' : 'Lưu'}
        </button>
        <button className="btn-cancel" onClick={() => setEditAccount(null)}>Huỷ</button>
      </div>
    </div>
  </div>
)}


{showCreateModal && (
  <div className="edit-modal">
    <div className="edit-box">
      <span className="modal-close" onClick={() => setShowCreateModal(false)}>✖</span>
      <h3 style={{ color: 'red', fontWeight: '700', border: '2px solid blue' }}>Tạo tài khoản</h3>

      {toastMessage && (
        <div className="toast-message">{toastMessage}</div>
      )}

      <label>Tên:</label>
      <input value={newAccount.name} onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })} />

      {/* Chọn loại */}
      <label>Loại:</label>
      <select
        style={{ cursor: 'pointer' }}
        value={newAccount.type}
        onChange={(e) => {
          const selectedTypeId = e.target.value
          const selectedType = typeList.find((type) => type._id === selectedTypeId)

          if (selectedType?.name) {
            let updatedAccount = { ...newAccount, type: selectedTypeId }
            const name = selectedType.name.toLowerCase()

            if (name.includes('thử vận may 20k')) {
              updatedAccount = { ...updatedAccount, champions: 0, skins: 0, gems: 0, price: 20000 }
            } else if (name.includes('thử vận may 50k')) {
              updatedAccount = { ...updatedAccount, champions: 0, skins: 0, gems: 0, price: 50000 }
            } else if (name.includes('thử vận may 100k')) {
              updatedAccount = { ...updatedAccount, champions: 0, skins: 0, gems: 0, price: 100000 }
            } else if (name.includes('thử vận may 200k')) {
              updatedAccount = { ...updatedAccount, champions: 0, skins: 0, gems: 0, price: 200000 }
            } else if (name.includes('thử vận may 300k')) {
              updatedAccount = { ...updatedAccount, champions: 0, skins: 0, gems: 0, price: 300000 }
            } else if (name.includes('thử vận may 500k')) {
              updatedAccount = { ...updatedAccount, champions: 0, skins: 0, gems: 0, price: 500000 }
            }

            setShowAddType(false)
            setNewAccount(updatedAccount)
          } else {
            if (selectedTypeId === '__new') {
              setShowAddType(true)
              setNewAccount({ ...newAccount, type: '' })
            } else {
              setShowAddType(false)
              setNewAccount({ ...newAccount, type: selectedTypeId })
            }
          }
        }}
      >
        <option value="">-- Chọn loại --</option>
        {typeList.map((type) => (
          <option key={type._id} value={type._id}>{type.name}</option>
        ))}
      </select>

      {/* Thêm loại mới nếu cần */}
      {showAddType && (
        <div style={{ marginTop: '10px' }}>
          <label>Nhập loại mới:</label>
          <input
            style={{ width: '100%', marginBottom: '6px' }}
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            placeholder="Ví dụ: Acc VIP SIÊU CẤP"
          />
          <button
            style={{
              backgroundColor: 'green',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={async () => {
              try {
                const formData = new FormData();
                formData.append('name', newTypeName);
                formData.append('image', newCategoryImage);

                const res = await api.post('/categories', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.access_token}`,
                  },
                });

                setTypeList((prev) => [...prev, res.data.category]);
                setNewTypeName('');
                setNewCategoryImage(null);
                setToastMessage('✅ Thêm loại thành công');
              } catch (err) {
                setToastMessage('❌ Lỗi khi thêm loại');
                console.error(err);
              }
            }}
          >
            Tạo loại
          </button>
        </div>
      )}

      <label>Giá:</label>
      <input type="number" value={newAccount.price} onChange={(e) => setNewAccount({ ...newAccount, price: e.target.value })} />

      <label>Tướng:</label>
      <input type="number" value={newAccount.champions} onChange={(e) => setNewAccount({ ...newAccount, champions: e.target.value })} />

      <label>Skin:</label>
      <input type="number" value={newAccount.skins} onChange={(e) => setNewAccount({ ...newAccount, skins: e.target.value })} />

      <label>Ngọc:</label>
      <input type="number" value={newAccount.gems} onChange={(e) => setNewAccount({ ...newAccount, gems: e.target.value })} />

      {/* Rank sửa thành select */}
      <label>Rank:</label>
      <select
        style={{ cursor: 'pointer' }}
        value={newAccount.rank}
        onChange={(e) => setNewAccount({ ...newAccount, rank: e.target.value })}
      >
        <option value="">-- Chọn rank --</option>
        <option value="Bạc">Bạc</option>
        <option value="Vàng">Vàng</option>
        <option value="Bạch Kim">Bạch Kim</option>
        <option value="Kim Cương">Kim Cương</option>
        <option value="Tinh Anh">Tinh Anh</option>
        <option value="Cao Thủ">Cao Thủ</option>
        <option value="Thách Đấu">Thách Đấu</option>
      </select>

      <label>Username:</label>
      <input value={newAccount.username} onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })} />

      <label>Password:</label>
      <input value={newAccount.password} onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })} />

      <label>Mã xác thực:</label>
      <input value={newAccount.authCode} onChange={(e) => setNewAccount({ ...newAccount, authCode: e.target.value })} />

      <label>Ảnh đại diện:</label>
      <input type="file" onChange={(e) => setNewAccount({ ...newAccount, image: e.target.files[0] })} />
      <p style={{ fontSize: '13px', fontStyle: 'italic' }}>
        (Ảnh này sẽ là ảnh đại diện acc sau khi tạo)
      </p>

      <label>Ảnh chi tiết (nhiều):</label>
      <input type="file" multiple onChange={(e) => setNewAccount({ ...newAccount, images: Array.from(e.target.files) })} />
      <p style={{ fontSize: '13px', fontStyle: 'italic' }}>
        (Các ảnh này sẽ được hiển thị ở phần chi tiết tài khoản)
      </p>

      <div className="modal-actions">
        <button
          style={{ marginRight: '-10px' }}
          className="btn-ok"
          onClick={handleCreateAccount}
          disabled={isCreating}
        >
          {isCreating ? 'Đang tạo...' : 'Tạo'}
        </button>
        <button className="btn-cancel" onClick={() => setShowCreateModal(false)}>Huỷ</button>
      </div>
    </div>
  </div>
)}


{showCategoryManager && (
  <div className="edit-modal">
    
    <div className="edit-box">
    <span className="modal-close" onClick={ handleCloseCategoryManager }>✖</span>

      <h3 style={{ color: 'green', fontWeight: 'bold', borderBottom: '2px solid #ccc' }}>Quản lý loại tài khoản</h3>
    {categoryToast && (
  <div className="toast-message" style={{ marginTop: '10px' }}>{categoryToast}</div>
)}

      {/* Danh sách loại */}
      <ul>
        {typeList.map((type) => (
          <li key={type._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
            <input
              value={type.name}
              onChange={(e) => {
                const newName = e.target.value;
                setTypeList((prev) =>
                  prev.map((t) => (t._id === type._id ? { ...t, name: newName } : t))
                );
              }}
              style={{ flex: 1, marginRight: '8px' }}
            />
            <button
              style={{ marginRight: '4px', backgroundColor: '#007bff', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor:'pointer' }}
              onClick={async () => {
                try {
                  const res = await api.put(`/categories/${type._id}`, { name: type.name }, {
                    headers: { Authorization: `Bearer ${user.access_token}` },
                  });
                  setCategoryToast('✅ Đã cập nhật loại thành công!')
                  setCategoryChanged(true);
                  setTimeout(() => setCategoryToast(''), 1500)
                } catch (err) {
                  setCategoryToast('❌ Lỗi cập nhật loại!')
                }
              }}
            >
              Lưu
            </button>
            <button
              style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px',cursor:'pointer' }}
              onClick={async () => {
                try {
                  await api.delete(`/categories/${type._id}`, {
                    headers: { Authorization: `Bearer ${user.access_token}` },
                  });
                  setTypeList((prev) => prev.filter((t) => t._id !== type._id));
                  setCategoryToast('Đã xoá loại thành công!')
                    setTimeout(() => setCategoryToast(''), 1500)
                } catch (err) {
                    setCategoryToast('❌ Lỗi xoá loại!')
                }
              }}
            >
              Xoá
            </button>
          </li>
        ))}
      </ul>

      {/* Thêm loại mới */}
      <div style={{ marginTop: '16px' }}>
        <input
          placeholder="Nhập loại mới"
          value={newTypeName}
          onChange={(e) => setNewTypeName(e.target.value)}
          style={{ width: '100%', marginBottom: '8px' }}
        />
        <input type="file" onChange={(e) => setNewCategoryImage(e.target.files[0])} />

        <button
  disabled={isAddingCategory}
  style={{
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: isAddingCategory ? 'not-allowed' : 'pointer'
  }}
  onClick={async () => {
    setIsAddingCategory(true); // Bắt đầu loading
    try {
      const formData = new FormData();
      formData.append('name', newTypeName);
      formData.append('image', newCategoryImage); // phải là File

      const res = await api.post('/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.access_token}`,
        },
      });

      const newCat = res.data.category;
      setTypeList((prev) => [...prev, newCat]);
      setNewTypeName('');
      setNewCategoryImage(null);
      setShowAddType(false);
      setToastMessage('✅ Thêm loại thành công!');
    } catch (err) {
      setToastMessage('❌ Lỗi khi thêm loại!');
      console.error(err);
    }
    setIsAddingCategory(false); // Kết thúc loading
    setTimeout(() => setToastMessage(''), 1500);
  }}
>
  {isAddingCategory ? 'Đang thêm...' : 'Thêm loại'}
</button>

      </div>

      <div className="modal-actions" style={{ marginTop: '16px' }}>
        <button className="btn-cancel" onClick={handleCloseCategoryManager}>Đóng</button>
      </div>
    </div>
  </div>
)}

{showUserConfirm && (
  <div className="confirm-modal">
    <div className="confirm-box">
      <p>Bạn có chắc muốn xoá người dùng này không?</p>
      <div className="modal-actions">
        <button className="btn-ok" onClick={confirmDeleteUser}>Đồng ý</button>
        <button className="btn-cancel" onClick={() => setShowUserConfirm(false)}>Huỷ</button>
      </div>
    </div>
  </div>
)}
{editUser && (
  <div className="edit-modal">
    <div className="edit-box">
      <span className="modal-close" onClick={() => setEditUser(null)}>✖</span>
      <h3>Sửa người dùng</h3>

      {/* Chỉ cho sửa Role nếu không phải chính mình */}
      {editUser._id !== user._id && (
        <>
          <label>Role:</label>
          <select
            value={editUser.isAdmin ? 'Admin' : 'User'}
            onChange={(e) =>
              setEditUser({ ...editUser, isAdmin: e.target.value === 'Admin' })
            }
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </>
      )}

      <label>Số dư:</label>
      <input
        type="number"
        value={editUser.balance}
        onChange={(e) =>
          setEditUser({ ...editUser, balance: e.target.value })
        }
      />

      <div className="modal-actions">
        <button className="btn-ok" onClick={handleUpdateUser}>Lưu</button>
        <button className="btn-cancel" onClick={() => setEditUser(null)}>Huỷ</button>
      </div>
    </div>
  </div>
)}
{isCreating && (
  <div className="fullscreen-spinner">
    <div className="spinner"></div>
  </div>
)}
{isUpdating && (
  <div className="loading-overlay">
    <div className="spinner"></div>
  </div>
)}
{showDeletePaymentConfirm && (
  <div className="confirm-modal">
    <div className="confirm-box">
      {isDeletingPayment ? (
        <div className="spinner-center" />
      ) : (
        <>
          <p>Bạn có chắc muốn xoá thông tin nạp tiền này không?</p>
          <div className="modal-actions">
            <button className="btn-ok" onClick={handleDeletePayment}>Đồng ý</button>
            <button className="btn-cancel" onClick={() => setShowDeletePaymentConfirm(false)}>Huỷ</button>
          </div>
        </>
      )}
    </div>
  </div>
)}

{toastMessage && (
  <div className="toast-message">{toastMessage}</div>
)}
  <Footer/>

</>
  );
}

export default AdminDashboard;
