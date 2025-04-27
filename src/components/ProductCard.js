import React from 'react'
import './ProductCard.css'
import { useNavigate } from 'react-router-dom'

function ProductCard({ account }) {
  const navigate = useNavigate() 
  const imgUrl = account.image?.url || '/default.jpg'  // ✅ Chỉ dùng image
  const handleViewDetails = () => {
    navigate(`/accountDetails/${account._id}`)  // ✅ chuyển sang trang chi tiết
  }
  return (
    <div className="product-card">
      <img src={imgUrl} alt={account.name} />
      <h3>{account.name}</h3>
      <div className="info-row">
        <span>Số Tướng: <span className="highlight-red">{account.champions}</span></span>
        <span>Số Skin: <span className="highlight-red">{account.skins}</span></span>
      </div>
      <div className="info-row">
        <span>Ngọc: <span className="highlight-red">{account.gems}</span></span>
        <span>Rank: <span className="highlight-red">{account.rank}</span></span>
      </div>


      <div className="footer">
        <span className="price-box">{account.price.toLocaleString()}đ</span>
        <button onClick={handleViewDetails} >CHI TIẾT</button>
      </div>
    </div>
  )
}

export default ProductCard
 