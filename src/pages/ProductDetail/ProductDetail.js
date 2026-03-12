import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../utils/api';
import { useCart } from '../../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart! 🛒`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return null;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">

        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Products
        </button>

        <div className="product-detail-grid">
          {/* Image */}
          <div className="product-detail-image">
            {product.images && product.images.length > 0 ? (
              <img src={`http://localhost:5000/${product.images[0]}`} alt={product.name} />
            ) : (
              <div className="no-image-large">🔧</div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail-info">
            <p className="detail-category">{product.category}</p>
            <h1>{product.name}</h1>
            <p className="detail-brand">Brand: <strong>{product.brand}</strong></p>

            <div className="detail-price">
              Rs. {product.price.toLocaleString()}
            </div>

            <p className={`detail-stock ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
              {product.stock > 0 ? `✅ In Stock (${product.stock} available)` : '❌ Out of Stock'}
            </p>

            <p className="detail-description">{product.description}</p>

            {product.compatibleWith && product.compatibleWith.length > 0 && (
              <div className="compatible-with">
                <h4>Compatible With:</h4>
                <div className="compatible-tags">
                  {product.compatibleWith.map((bike, i) => (
                    <span key={i} className="tag">{bike}</span>
                  ))}
                </div>
              </div>
            )}

            {product.stock > 0 && (
              <div className="add-to-cart-section">
                <div className="quantity-selector">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  🛒 Add to Cart
                </button>
              </div>
            )}

            <div className="payment-info">
              <h4>Payment Methods:</h4>
              <div className="payment-tags">
                <span>💵 Cash on Delivery</span>
                <span>📱 EasyPaisa</span>
                <span>🏦 Bank Transfer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;