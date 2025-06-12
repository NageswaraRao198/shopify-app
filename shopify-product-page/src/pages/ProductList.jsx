import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

const SHOPIFY_DOMAIN = "storeofakki.myshopify.com";
const ACCESS_TOKEN = "e1b45a7ff82218d49e35b0cb2d56390a";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
        const query = `
        {
          products(first: 10) {
            edges {
              node {
                id
                title
                description
                images(first: 1) {
                  edges {
                    node {
                      src
                    }
                  }
                }
                variants(first: 1) {
                  edges {
                    node {
                      id
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
        `;
        
  
      try {
        const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-04/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN,
          },
          body: JSON.stringify({ query }),
        });
  
        const json = await res.json();
        console.log("Shopify API response:", json); // 👈 Check this in browser console
  
        if (json.errors) {
          console.error("GraphQL Errors:", json.errors);
        }
  
        const productEdges = json.data?.products?.edges ?? [];
        if (productEdges.length === 0) {
          console.warn("⚠️ No products returned from API");
        }
  
        const products = productEdges.map(edge => edge.node);
        setProducts(products);
      } catch (err) {
        console.error("❌ Failed to fetch Shopify products:", err);
      }
    };
  
    fetchProducts();
  }, []);
  

  return (
    <div>
      <h1>Products</h1>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;
