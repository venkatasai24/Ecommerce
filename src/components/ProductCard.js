const ProductCard = ({ product }) => (
  <div className="product-card">
    <a href={`/product/${product.id}`}>
      <div className="product-card-inner">
        <img src={product.thumbnail} alt={product.title} />
        <p className="product-name">{product.title}</p>
      </div>
    </a>
  </div>
);

export default ProductCard;
