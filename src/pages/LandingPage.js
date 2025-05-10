import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LandingPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import banner from '../assets/banner.png';
import bia1 from '../assets/bia1.png';
import allAcc from '../assets/allacc.jpg';

function LandingPage() {
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [topBuyers, setTopBuyers] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ thêm loading
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra nếu đã có dữ liệu trong sessionStorage thì không cần tải lại
    const storedCategories = sessionStorage.getItem('categories');
    const storedAccounts = sessionStorage.getItem('accounts');
    const storedTopBuyers = sessionStorage.getItem('topBuyers');

    if (storedCategories && storedAccounts && storedTopBuyers) {
      setCategories(JSON.parse(storedCategories));
      setAccounts(JSON.parse(storedAccounts));
      setTopBuyers(JSON.parse(storedTopBuyers));
      setLoading(false);
    } else {
      // Fetch lại dữ liệu nếu chưa có trong sessionStorage
      const fetchData = async () => {
        try {
          const [categoryRes, accountRes, topBuyersRes] = await Promise.all([
            axios.get(`${process.env.REACT_APP_API_URL}/categories`),
            axios.get(`${process.env.REACT_APP_API_URL}/accounts/getall`),
            axios.get(`${process.env.REACT_APP_API_URL}/user/top-buyers`),
          ]);
          setCategories(categoryRes.data);
          setAccounts(accountRes.data.accounts);
          setTopBuyers(topBuyersRes.data);

          // Lưu dữ liệu vào sessionStorage để tránh tải lại
          sessionStorage.setItem('categories', JSON.stringify(categoryRes.data));
          sessionStorage.setItem('accounts', JSON.stringify(accountRes.data.accounts));
          sessionStorage.setItem('topBuyers', JSON.stringify(topBuyersRes.data));
        } catch (err) {
          console.error('Lỗi khi tải dữ liệu:', err);
        } finally {
          setLoading(false); // ✅ fetch xong mới tắt loading
        }
      };

      fetchData();
    }
  }, []); // Chỉ chạy 1 lần khi component mount


  useEffect(() => {
  // Kiểm tra xem trang có được tải lại hay không (refresh)
  if (window.performance.navigation.type === 1) { // Type 1 = Refresh
    const fetchData = async () => {
      try {
        const [categoryRes, accountRes, topBuyersRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/categories`),
          axios.get(`${process.env.REACT_APP_API_URL}/accounts/getall`),
          axios.get(`${process.env.REACT_APP_API_URL}/user/top-buyers`),
        ]);
        
        setCategories(categoryRes.data);
        setAccounts(accountRes.data.accounts);
        setTopBuyers(topBuyersRes.data);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  } else {
    setLoading(false); // Nếu không phải refresh, không cần fetch lại dữ liệu
  }

  // Lưu lại vị trí cuộn khi người dùng rời khỏi trang
  return () => {
    sessionStorage.setItem('scrollPosition', window.scrollY);
  };
}, []); // Chỉ chạy 1 lần khi component mount

  // Hàm tính số tài khoản chưa bán trong từng danh mục
  const countByCategoryFromNonLuck = (catId) => {
    return accounts.filter(acc => {
      if (!acc.type) return false;
      const accTypeId = typeof acc.type === 'object' ? acc.type._id : acc.type;
      return accTypeId === catId && !acc.isSold;
    }).length;
  };

  // Lọc các danh mục không phải "Thử vận may"
  const danhMucLienQuan = categories.filter(cat => !cat.name.toLowerCase().includes('thử vận may'));

  // Lọc các danh mục thuộc "Thử vận may"
  const thuVanMay = categories.filter(cat => {
    const countAcc = accounts.filter(acc => {
      if (!acc.type) return false;
      const accTypeId = typeof acc.type === 'object' ? acc.type._id : acc.type;
      return accTypeId === cat._id && !acc.isSold;
    }).length;
    return cat.name.toLowerCase().includes('thử vận may') && countAcc > 0;
  });

  // Tính tổng số tài khoản
  const totalAccounts = accounts.length;

  // Tính tổng số tài khoản trong mục "Thử vận may"
  const totalLuckAccounts = thuVanMay.reduce((count, cat) => {
    return count + accounts.filter(acc => {
      if (!acc.type) return false;
      const accTypeId = typeof acc.type === 'object' ? acc.type._id : acc.type;
      return accTypeId === cat._id && !acc.isSold;
    }).length;
  }, 0);

  // Tính số tài khoản không thuộc "Thử vận may"
  const totalNonLuckAccounts = totalAccounts - totalLuckAccounts;

  // Lưu vị trí cuộn khi người dùng rời trang
  useEffect(() => {
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition, 10));
    }

    return () => {
      sessionStorage.setItem('scrollPosition', window.scrollY);
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="landing-container">
        <div className="banner-section" style={{ backgroundImage: `url(${banner})` }}>
          <div className="banner-overlay">
            <div className="top-buyers-box">
              <div className="top-buyers-header">TOP MUA ACC</div>
              <ul className="top-buyers-list">
                {topBuyers.map((user, index) => (
                  <li key={user._id} className="buyer-item">
                    <span className={`buyer-rank-icon rank-${index + 1}`}>
                      {index + 1}
                    </span>
                    <span className="buyer-name">{user.username}</span>
                    <span className="buyer-money">{user.totalSpent.toLocaleString()}đ</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="banner-right">
              <img src={bia1} alt="Banner" className="banner-right-image" />
            </div>
          </div>
        </div>

        <h2 className="section-title">DANH MỤC LIÊN QUÂN</h2>
        <div className="card-grid">
          <div className="category-card" onClick={() => navigate('/allAccounts')}>
            <img src={allAcc} alt="Tất cả tài khoản" className="card-image" />
            <div className="card-name">Tất cả tài khoản</div>
            <div className="card-count">
              Số Tài Khoản Hiện Có: <strong>{totalNonLuckAccounts}</strong>
            </div>
            <button className="btn-view">XEM TẤT CẢ</button>
          </div>

          {danhMucLienQuan.map((cat) => (
            <div key={cat._id} className="category-card" onClick={() => navigate(`/category/${cat._id}`)}>
              <img src={cat.image?.url} alt={cat.name} className="card-image" />
              <div className="card-name">{cat.name}</div>
              <div className="card-count">
                Số Tài Khoản Hiện Có: <strong>{countByCategoryFromNonLuck(cat._id)}</strong>
              </div>
              <button className="btn-view">XEM TẤT CẢ</button>
            </div>
          ))}
        </div>

        <h2 className="section-title">THỬ VẬN MAY</h2>
        <div className="card-grid">
          {thuVanMay.map((cat) => (
            <div key={cat._id} className="category-card" onClick={() => navigate(`/category/${cat._id}`)}>
              <img src={cat.image?.url} alt={cat.name} className="card-image" />
              <div className="card-name">{cat.name}</div>
              <div className="card-count">
                Số Tài Khoản Hiện Có: <strong>{
                  accounts.filter(acc => {
                    if (!acc.type) return false;
                    const accTypeId = typeof acc.type === 'object' ? acc.type._id : acc.type;
                    return accTypeId === cat._id && !acc.isSold;
                  }).length
                }</strong>
              </div>
              <button className="btn-view">XEM TẤT CẢ</button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LandingPage;
