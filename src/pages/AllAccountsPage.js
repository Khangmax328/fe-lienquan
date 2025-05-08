import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import './CategoryPage.css';
import Navbar from '../components/Navbar';

const API_URL = process.env.REACT_APP_API_URL;

function AllAccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rank, setRank] = useState('Tất cả rank');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isPending, setIsPending] = useState(false);
  const [sortPrice, setSortPrice] = useState('none');

  // Hàm fetch lại tài khoản
  const fetchAccounts = async (filters = {}, customPage = 1) => {
    try {
      setIsPending(true);
      setAccounts([]); // Đảm bảo xóa danh sách trước khi tải lại

      const params = {
        page: customPage,
        limit: 50,
        isSold: false, // Chỉ lấy account chưa bán
        ...filters, // Dùng filters nếu có, còn không sẽ dùng mặc định
      };

      const res = await axios.get(`${API_URL}/accounts/exclude-lucky`, { params });
      setAccounts(res.data.accounts || []);
      setTotalPages(res.data.totalPages);
      setPage(customPage);

      // Lưu vào sessionStorage sau khi fetch
      sessionStorage.setItem('accountsData', JSON.stringify({
        accounts: res.data.accounts,
        totalPages: res.data.totalPages,
        currentPage: customPage
      }));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách acc:', error);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    // Kiểm tra sessionStorage trước khi fetch
    const savedData = sessionStorage.getItem('accountsData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setAccounts(parsedData.accounts);
      setPage(parsedData.currentPage);
      setTotalPages(parsedData.totalPages);
    } else {
      fetchAccounts(); // Nếu không có dữ liệu lưu trữ, fetch mặc định
    }
  }, []);

  const handleSearch = () => {
    // Khi bấm tìm kiếm, áp dụng bộ lọc và tìm từ trang 1
    fetchAccounts({ minPrice, maxPrice, rank, sortPrice }, 1);
  };

  const handleRefresh = () => {
    // Khi làm mới, reset tất cả bộ lọc và trang về 1
    setMinPrice('');
    setMaxPrice('');
    setRank('Tất cả rank');
    setSortPrice('none');
    setPage(1); // Đảm bảo chuyển về trang 1 khi làm mới
    fetchAccounts({}, 1); // Truyền đối tượng rỗng để không áp dụng bộ lọc
  };

  return (
    <>
      <Navbar />
      <div className="category-page-container">
        <div className="category-wrapper">
          <div className="category-header-narrow">
            <h1 className="category-title">Danh Sách Tất Cả Tài Khoản</h1>
          </div>
          <div className="filter-container">
            <input
              type="number"
              placeholder="Giá tối thiểu"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Giá tối đa"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <select value={rank} onChange={(e) => setRank(e.target.value)}>
              <option>Tất cả rank</option>
              <option>Bạc</option>
              <option>Vàng</option>
              <option>Bạch Kim</option>
              <option>Kim Cương</option>
              <option>Tinh Anh</option>
              <option>Cao Thủ</option>
              <option>Thách Đấu</option>
            </select>

            <select value={sortPrice} onChange={(e) => setSortPrice(e.target.value)}>
              <option value="none">Tất cả giá</option>
              <option value="asc">Giá tăng dần</option>
              <option value="desc">Giá giảm dần</option>
            </select>
            <button onClick={handleSearch}>Tìm</button>
            <button onClick={handleRefresh}>Làm mới</button> {/* Gọi hàm làm mới */}
          </div>

          <div className="product-list">
            {isPending ? (
              <div className="spinner" />
            ) : (
              accounts.map((account) => (
                <ProductCard key={account._id} account={account} />
              ))
            )}
          </div>

          <div className="pagination">
            <button
              onClick={() => page > 1 && fetchAccounts({ minPrice, maxPrice, rank, sortPrice }, page - 1)}
              disabled={page === 1}
            >
              &laquo;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => fetchAccounts({ minPrice, maxPrice, rank, sortPrice }, p)}
                className={p === page ? 'active' : ''}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => page < totalPages && fetchAccounts({ minPrice, maxPrice, rank, sortPrice }, page + 1)}
              disabled={page === totalPages}
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AllAccountsPage;
