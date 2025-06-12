import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const variant = product.variants.edges[0].node;

  return (
    <div className="product-card" style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
      <img
        src={product.images.edges[0]?.node.src}
        alt={product.title}
        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
      />
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <p>Price: {variant.price.currencyCode} {variant.price.amount}</p>
      <button onClick={() =>
        addToCart({
          id: variant.id,
          title: product.title,
          price: variant.price.amount
        })
        
      }>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
