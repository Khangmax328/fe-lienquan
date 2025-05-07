import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAllAccounts, getAllCategories } from '../services/api'
import ProductCard from '../components/ProductCard'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './CategoryPage.css';
import Navbar from '../components/Navbar'

function CategoryPage() {
  const { id } = useParams()
  const [accounts, setAccounts] = useState([])
  const [categoryName, setCategoryName] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isPending, setIsPending] = useState(false)

  // Bộ lọc
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [rank, setRank] = useState('Tất cả rank')
  const [sortPrice, setSortPrice] = useState('none')
  const [isLuckyCategory, setIsLuckyCategory] = useState(false)


  const fetchAccounts = async (customPage = 1) => {
    setIsPending(true)
    try {
      const params = {
        type: id,
        page: customPage,
        limit: 50,
        minPrice,
        maxPrice,
        sortPrice: sortPrice !== 'none' ? sortPrice : '',
        rank: rank !== 'Tất cả rank' ? rank : ''
      }

      const data = await getAllAccounts(params)
      setAccounts(data.accounts || [])
      setPage(data.currentPage)
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error('Lỗi lấy acc:', err)
    } finally {
      setIsPending(false)
    }
  }

  const fetchCategoryName = async () => {
    try {
      const allCats = await getAllCategories()
      const found = allCats.find((c) => c._id === id)
      if (found) {
        setCategoryName(found.name)
        setIsLuckyCategory(found.name.toLowerCase().includes('thử vận may'))
      }
    } catch (err) {
      console.error('Không lấy được tên category:', err)
    }
  }

  useEffect(() => {
    fetchAccounts()
    fetchCategoryName()
  }, [id])

  const handleSearch = () => {
    fetchAccounts(1)
  }

 
  return (
    <>
      {/* <Header /> */}
      <Navbar/>
      <div className="category-page-container">
        <div className="category-wrapper">
        <div className="category-header-narrow">
          <h1 className="category-title">Danh mục {categoryName}</h1>
          {isLuckyCategory && (
  <div className="lucky-description">
    {categoryName.toLowerCase().includes('20k') && (
      <>
        <p><strong>THỬ VẬN MAY LIÊN QUÂN 20K:</strong></p>
        <p>– 100% Tài Khoản Đúng</p>
        <p>– 100% Không Có SDT Và Không Có Gmail</p>
        <p>– 100% Acc Từ 10 Tướng</p>
        <p>– 50% Nhận Acc SIÊU KHỦNG</p>
        <p style={{ fontStyle: 'italic', color: '#e60000' }}>
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
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} className={page === i + 1 ? 'active' : ''} onClick={() => fetchAccounts(i + 1)}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => fetchAccounts(page + 1)} disabled={page === totalPages}>
              &raquo;
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
  
}

export default CategoryPage