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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, accountRes, topBuyersRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/categories`),
          axios.get(`${process.env.REACT_APP_API_URL}/accounts`),
          axios.get(`${process.env.REACT_APP_API_URL}/user/top-buyers`),
        ]);
        setCategories(categoryRes.data);
        setAccounts(accountRes.data.accounts);
        setTopBuyers(topBuyersRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const countByCategoryFromNonLuck = (catId) => {
    return accounts.filter((acc) => {
      const accTypeId = typeof acc.type === 'object' ? acc.type._id : acc.type;
      return accTypeId === catId && !acc.isSold;
    }).length;
  };

  const danhMucLienQuan = categories.filter((cat) => !cat.name.toLowerCase().includes('thử vận may'));

  const thuVanMay = categories.filter((cat) => {
    const countAcc = accounts.filter((acc) => {
      const accTypeId = typeof acc.type === 'object' ? acc.type._id : acc.type;
      return accTypeId === cat._id && !acc.isSold;
    }).length;
    return cat.name.toLowerCase().includes('thử vận may') && countAcc > 0;
  });

  const totalNonLuckAccounts = accounts.length - thuVanMay.reduce((count, cat) => count + accounts.filter((acc) => acc.type._id === cat._id && !acc.isSold).length, 0);

  if (loading) {
    return <div className="loading-overlay"><div className="spinner"></div></div>;
  }

  return (
    <>
      <Navbar />
      <div className="landing-container">
        {/* Banner hiển thị TOP MUA ACC */}
        <div className="banner-section" style={{ backgroundImage: `url(${banner})` }}>
          <div className="banner-overlay">
            <div className="top-buyers-box">
              <div className="top-buyers-header">TOP MUA ACC</div>
              <ul className="top-buyers-list">
                {topBuyers.map((user, index) => (
                  <li key={user._id} className="buyer-item">
                    <span className={`buyer-rank-icon rank-${index + 1}`}>{index + 1}</span>
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

        {/* DANH MỤC LIÊN QUÂN */}
        <h2 className="section-title">DANH MỤC LIÊN QUÂN</h2>
        <div className="card-grid">
          {/* Tất cả tài khoản */}
          <div className="category-card" onClick={() => navigate('/allAccounts')}>
            <img src={allAcc} alt="Tất cả tài khoản" className="card-image" />
            <div className="card-name">Tất cả tài khoản</div>
            <div className="card-count">
              Số Tài Khoản Hiện Có: <strong>{totalNonLuckAccounts}</strong>
            </div>
            <button className="btn-view">XEM TẤT CẢ</button>
          </div>

          {/* Các danh mục khác */}
          {danhMucLienQuan.map((cat) => (
            <div
              key={cat._id}
              className="category-card"
              onClick={() => navigate(`/category/${cat._id}`, { state: { refresh: true } })} // Chuyển trạng thái để ép reload
            >
              <img src={cat.image?.url} alt={cat.name} className="card-image" />
              <div className="card-name">{cat.name}</div>
              <div className="card-count">
                Số Tài Khoản Hiện Có: <strong>{countByCategoryFromNonLuck(cat._id)}</strong>
              </div>
              <button className="btn-view">XEM TẤT CẢ</button>
            </div>
          ))}
        </div>

        {/* THỬ VẬN MAY */}
        <h2 className="section-title">THỬ VẬN MAY</h2>
        <div className="card-grid">
          {thuVanMay.map((cat) => (
            <div
              key={cat._id}
              className="category-card"
              onClick={() => navigate(`/category/${cat._id}`, { state: { refresh: true } })}
            >
              <img src={cat.image?.url} alt={cat.name} className="card-image" />
              <div className="card-name">{cat.name}</div>
              <div className="card-count">
                Số Tài Khoản Hiện Có: <strong>{accounts.filter((acc) => acc.type._id === cat._id && !acc.isSold).length}</strong>
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
