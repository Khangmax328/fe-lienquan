import React from 'react'
import './Footer.css'
import zaloIcon from '../assets/zalo.webp'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-box">
          <p>
            Chuyên bán ACC game Liên Quân, Free Fire, PUBG Mobile và có phần Thử Vận May nếu may mắn quý khách sẽ có cơ hội nhận được acc vip.
            Shop giao dịch hoàn toàn tự động 24/24, với đội CSKH nhiệt tình và thân thiện sẽ làm hài lòng quý khách.
          </p>
        </div>
        <div className="footer-box">
          <p>
            Chúng tôi làm việc một cách chuyên nghiệp, uy tín, nhanh chóng và luôn đặt quyền lợi của bạn lên hàng đầu. 
            Với tiêu chí Khách Hàng Là Trên Hết, Shop Chúng Tôi Sẽ Mang Đến Khách Hàng Những Trải Nghiệm Ưng Ý Nhất.
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 Copyright <strong style={{ color: 'red' }}>shopkhanglienquan.com</strong></span>
      </div>
      {/* <div className="footer-bottom">
       <span style={{fontWeight: 'bold'}}>Mọi chi tiết xin vui lòng liên hệ: 0946.896.304</span>
      </div> */}
      <div className="footer-bottom">
        <span style={{ fontWeight: 'bold' }}>
          Mọi chi tiết xin vui lòng liên hệ: 0946.896.304
        </span>
        <a
          href="https://zalo.me/0946896304"  // ✅ link Zalo
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: '10px' }}
        >
          <img src={zaloIcon} alt="Zalo" style={{ height: '28px', verticalAlign: 'middle' }} />
        </a>
      </div>
    </footer>
  )
}

export default Footer
