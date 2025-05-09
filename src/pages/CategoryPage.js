import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAllAccounts, getAllCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import './CategoryPage.css';
import Navbar from '../components/Navbar';

function CategoryPage() {
  const { id } = useParams();
  const [accounts, setAccounts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isPending, setIsPending] = useState(false);

  // Bộ lọc
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rank, setRank] = useState('Tất cả rank');
  const [sortPrice, setSortPrice] = useState('none');
  const [isLuckyCategory, setIsLuckyCategory] = useState(false);

  // Lấy lại dữ liệu từ sessionStorage khi trang load lại
  const fetchCategoryName = async () => {
    const savedCategoryName = sessionStorage.getItem(`categoryName-${id}`);
    const savedCategoryDescription = sessionStorage.getItem(`categoryDescription-${id}`);
    
    if (savedCategoryName && savedCategoryDescription) {
      setCategoryName(savedCategoryName);
      setCategoryDescription(savedCategoryDescription);
    } else {
      try {
        const allCats = await getAllCategories();
        const found = allCats.find((c) => c._id === id);
        if (found) {
          setCategoryName(found.name);
          setCategoryDescription(found.description || ''); // Cập nhật mô tả của danh mục
          sessionStorage.setItem(`categoryName-${id}`, found.name);  // Lưu tên vào sessionStorage
          sessionStorage.setItem(`categoryDescription-${id}`, found.description || '');  // Lưu mô tả vào sessionStorage
          setIsLuckyCategory(found.name.toLowerCase().includes('thử vận may'));
        }
      } catch (err) {
        console.error('Không lấy được tên hoặc mô tả category:', err);
      }
    }
  };

  const fetchAccounts = async (customPage = 1, filters = {}) => {
    setIsPending(true);
    try {
      const params = {
        type: id,
        page: customPage,
        limit: 50,
        minPrice: filters.minPrice || minPrice,
        maxPrice: filters.maxPrice || maxPrice,
        sortPrice: filters.sortPrice || sortPrice,
        rank: filters.rank || rank
      };

      const data = await getAllAccounts(params);
      setAccounts(data.accounts || []);
      setPage(data.currentPage);
      setTotalPages(data.totalPages);
      sessionStorage.setItem(`accounts-${id}`, JSON.stringify(data)); // Lưu dữ liệu vào sessionStorage
    } catch (err) {
      console.error('Lỗi lấy acc:', err);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    const savedData = sessionStorage.getItem(`accounts-${id}`);
    if (savedData) {
      const data = JSON.parse(savedData);
      setAccounts(data.accounts);
      setPage(data.currentPage);
      setTotalPages(data.totalPages);
    } else {
      fetchAccounts();
    }

    fetchCategoryName();

    // Lưu vị trí cuộn vào sessionStorage khi người dùng rời trang
    return () => {
      sessionStorage.setItem(`scrollPosition-${id}`, window.scrollY);
    };
  }, [id]);

  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem(`scrollPosition-${id}`);
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10));
    }
  }, [id]);

  const handleSearch = () => {
    fetchAccounts(1);
  };

  const handleRefresh = () => {
    // Reset các bộ lọc và trang về trang 1 ngay lập tức
    setMinPrice('');
    setMaxPrice('');
    setRank('Tất cả rank');
    setSortPrice('none');
    setPage(1); // Chuyển về trang 1 khi làm mới
    
    // Gọi lại API ngay lập tức từ trang 1 với bộ lọc đã reset
    fetchAccounts(1, { minPrice: '', maxPrice: '', rank: 'Tất cả rank', sortPrice: 'none' });
  };

  return (
    <>
      <Navbar />
      <div className="category-page-container">
        <div className="category-wrapper">
          <div className="category-header-narrow">
            <h1 className="category-title">Danh mục {categoryName}</h1>
            {categoryDescription && (
              <div className="category-description">
                <p>{categoryDescription}</p>
              </div>
            )}
            {isLuckyCategory && (
              <div className="lucky-description">
                {/* Các phần mô tả thử vận may */}
                {categoryName.toLowerCase().includes('20k') && (
                  <>
                    <p><strong>THỬ VẬN MAY LIÊN QUÂN 20K:</strong></p>
                    <p>– 100% Tài Khoản Đúng</p>
                    <p>– 100% Không Có SDT Và Không Có Gmail</p>
                    <p>– 100% Acc Từ 10 Tướng</p>
                    <p>– 50% Nhận Acc SIÊU KHỦNG</p>
                    <p style={{ fontStyle: 'italic', color: '#e60000' }} >
                      Lưu Ý ! Thử Vận May Chấp Nhận HÊN - XUI
                    </p>
                  </>
                )}
                 {categoryName.toLowerCase().includes('50k') && (
      <>
        <p><strong>THỬ VẬN MAY LIÊN QUÂN 50K:</strong></p>
        <p>– 100% Tài Khoản Đúng</p>
        <p>– 100% Trắng Thông Tin Không Có SDT Và Gmail</p>
        <p>– 100% Acc Từ 30 Tướng</p>
        <p>– 70% Nhận Acc SIÊU KHỦNG</p>
        <p style={{ fontStyle: 'italic', color: '#e60000' }}>
          Lưu Ý ! Thử Vận May Chấp Nhận HÊN - XUI
        </p>
      </>
    )}
    {categoryName.toLowerCase().includes('100k') && (
      <>
        <p><strong>THỬ VẬN MAY LIÊN QUÂN 100K:</strong></p>
        <p>– 100% Tài Khoản Đúng</p>
        <p>– 100% Đổi Được Thông Tin</p>
        <p>– 100% Acc Từ 40 Tướng</p>
        <p>– 70% Nhận Acc SIÊU KHỦNG</p>
      </>
    )}
    {categoryName.toLowerCase().includes('200k') && (
      <>
        <p><strong>THỬ VẬN MAY LIÊN QUÂN 200K:</strong></p>
        <p>– 100% Tài Khoản Đúng</p>
        <p>– 100% Trắng Thông Tin</p>
        <p>– 100% Acc Từ 50 Tướng</p>
        <p>– 80% Nhận Acc SIÊU KHỦNG</p>
      </>
    )}
    {categoryName.toLowerCase().includes('300k') && (
      <>
        <p><strong>THỬ VẬN MAY LIÊN QUÂN 300K:</strong></p>
        <p>– 100% Tài Khoản Đúng</p>
        <p>– 100% Acc đổi được thông tin</p>
        <p>– 100% Acc Từ 60 Tướng</p>
        <p>– 80% Nhận Acc SIÊU KHỦNG</p>
      </>
    )}
    {categoryName.toLowerCase().includes('500k') && (
      <>
        <p><strong>THỬ VẬN MAY LIÊN QUÂN 500K:</strong></p>
        <p>– 100% Tài Khoản Đúng</p>
        <p>– 100% Acc Từ 100 Tướng</p>
        <p>– 100% Acc đổi được thông tin</p>
        <p>– 80% Nhận Acc SIÊU KHỦNG</p>
      </>
    )}
              </div>
            )}
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
            {!isLuckyCategory && (
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
            )}

            <select value={sortPrice} onChange={(e) => setSortPrice(e.target.value)}>
              <option value="none">Sắp xếp giá</option>
              <option value="asc">Giá tăng dần</option>
              <option value="desc">Giá giảm dần</option>
            </select>
            <button onClick={handleSearch}>Tìm</button>
            <button onClick={handleRefresh}>Làm mới</button> {/* Gọi hàm làm mới */}
          </div>

          {isPending ? (
            <div className="spinner" />
          ) : (
            <div className="product-list">
              {accounts.map((acc) => (
                <ProductCard key={acc._id} account={acc} />
              ))}
            </div>
          )}

          <div className="pagination">
  <button onClick={() => fetchAccounts(page - 1)} disabled={page === 1}>
    &laquo;
  </button>

  {/* Hiển thị các trang hiện tại */}
  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const startPage = Math.max(1, page - 2); 
    const pageNumber = startPage + i;
    if (pageNumber <= totalPages) {
      return (
        <button 
          key={pageNumber} 
          className={page === pageNumber ? 'active' : ''} 
          onClick={() => fetchAccounts(pageNumber)}
        >
          {pageNumber}
        </button>
      );
    }
    return null;
  })}

  {/* Hiển thị nút tiếp theo */}
  <button onClick={() => fetchAccounts(page + 1)} disabled={page === totalPages}>
    &raquo;
  </button>

  {/* Thẻ span hiển thị tổng số trang, căn dưới và giữa */}
  <span className="page-info">{`Trang ${page} / ${totalPages}`}</span>
</div>



        </div>
      </div>
      <Footer />
    </>
  );
}

export default CategoryPage;
