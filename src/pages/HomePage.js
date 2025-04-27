import React, { useEffect, useState } from 'react'
import { getAllAccounts } from '../services/api'
import ProductCard from '../components/ProductCard'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../App.css' 
import './HomePage.css'

function HomePage() {
  const [accounts, setAccounts] = useState([])
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [rank, setRank] = useState('Tất cả rank')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortPrice, setSortPrice] = useState('none')
  const [isPending, setIsPending] = useState(false)

  const fetchAccounts = async (filters = {}, customPage = 1) => {
    try {
      setIsPending(true)
      setAccounts([])

      const params = {
        rank: rank !== 'Tất cả rank' ? rank : '',
        page: customPage,
        limit: 50,
        ...filters
      }

      const data = await getAllAccounts(params)
      // console.log('👉 Tổng acc:', data.total)
      // console.log('👉 Danh sách acc:', data.accounts)

      setAccounts(data.accounts || [])
      setTotalPages(data.totalPages)
      setPage(customPage)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách acc:', error)
    } finally {
      setIsPending(false)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  const handleSearch = () => {
    const filters = {
      minPrice,
      maxPrice,
      rank: rank !== 'Tất cả rank' ? rank : '',
      sortPrice: sortPrice !== 'none' ? sortPrice : ''
    }
    fetchAccounts(filters, 1)
  }

  return (
    <>
      <Header />
      <div style={{ padding: '10px 20px' }}>
        <h1>Danh Sách Nick</h1>
        <div className="main-wrapper">
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
            <option value="none">Sắp xếp giá</option>
            <option value="asc">Giá tăng dần</option>
            <option value="desc">Giá giảm dần</option>
          </select>
          <button style={{cursor:'pointer'}} onClick={handleSearch}>Tìm</button>
        </div>

        <div className="product-list">
        <div className="product-list">
          {isPending ? (
            <div className="spinner" />
          ) : (
            accounts.map((account) => (
              <ProductCard key={account._id} account={account} />
            ))
          )}
        </div>

        </div>
        </div>
        {/* Phân trang */}
        <div className="pagination">
            {/* Mũi tên lùi */}
            <button
              onClick={() => {
                if (page > 1) {
                  fetchAccounts({
                    minPrice,
                    maxPrice,
                    rank: rank !== 'Tất cả rank' ? rank : '',
                    sortPrice: sortPrice !== 'none' ? sortPrice : ''
                  }, page - 1)
                }
              }}
              disabled={page === 1}
            >
              &laquo;
            </button>

            {/* Các số trang */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => fetchAccounts({
                  minPrice,
                  maxPrice,
                  rank: rank !== 'Tất cả rank' ? rank : '',
                  sortPrice: sortPrice !== 'none' ? sortPrice : ''
                }, p)}
                className={p === page ? 'active' : ''}
              >
                {p}
              </button>
            ))}

            {/* Mũi tên tiến */}
            <button
              onClick={() => {
                if (page < totalPages) {
                  fetchAccounts({
                    minPrice,
                    maxPrice,
                    rank: rank !== 'Tất cả rank' ? rank : '',
                    sortPrice: sortPrice !== 'none' ? sortPrice : ''
                  }, page + 1)
                }
              }}
              disabled={page === totalPages}
            >
              &raquo;
            </button>
          </div>



      </div>
      <Footer />
    </>
  )
}

export default HomePage
