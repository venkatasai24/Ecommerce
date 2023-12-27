const ProductCard = ({ product }) => (
  <div data-aos="zoom-in">
    <div className="product-card">
      <a href={`/product/${product.id}`}>
        <div className="product-card-inner">
          <img src={product.thumbnail} alt={product.title} loading="lazy" />
          <p className="product-name">{product.title}</p>
        </div>
      </a>
    </div>
  </div>
);

export default ProductCard;
