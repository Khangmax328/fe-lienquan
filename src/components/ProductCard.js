import React from 'react';
import './ProductCard.css';
import { useNavigate } from 'react-router-dom';

function ProductCard({ account }) {
  const navigate = useNavigate();
  const imgUrl = account.image?.url || '/default.jpg';

  const handleViewDetails = () => {
    navigate(`/accountDetails/${account._id}`);
  };

  // Hàm kiểm tra: nếu = 0 hoặc = '' thì trả "Bí mật"
  const displayValue = (value) => {
    return value === 0 || value === '' ? 'Bí mật' : value;
  };

  return (
    <>
    <div className="product-card">
      <img src={imgUrl} alt={account.name} />
      <h3>{account.name}</h3>

      <div className="info-row">
        <span>
          Số Tướng: <span className="highlight-red">{displayValue(account.champions)}</span>
        </span>
        <span>
          Số Skin: <span className="highlight-red">{displayValue(account.skins)}</span>
        </span>
      </div>

      <div className="info-row">
        <span>
          Ngọc: <span className="highlight-red">{displayValue(account.gems)}</span>
        </span>
        <span>
          Rank: <span className="highlight-red">{displayValue(account.rank)}</span>
        </span>
      </div>

      <div className="footer">
        <span className="price-box">{account.price.toLocaleString()}đ</span>
        <button onClick={handleViewDetails}>CHI TIẾT</button>
      </div>
    </div>
    </>
  );
}

export default ProductCard;
