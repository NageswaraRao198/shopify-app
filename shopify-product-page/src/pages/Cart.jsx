import { useCart } from "../context/CartContext";
import { useState } from "react";

const SHOPIFY_DOMAIN = "storeofakki.myshopify.com";
const ACCESS_TOKEN = "e1b45a7ff82218d49e35b0cb2d56390a";

function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.quantity * parseFloat(item.price), 0).toFixed(2);

  const handleCheckout = async () => {
    setLoading(true);
  
    const lines = cart.map(item => ({
      merchandiseId: item.id, // variant ID
      quantity: item.quantity
    }));
  
    const query = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
  
    const variables = {
      input: {
        lines
      }
    };
  
    try {
      const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-04/graphql.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
        },
        body: JSON.stringify({ query, variables })
      });
  
      const json = await res.json();
      console.log("🧾 Shopify Cart Checkout Response:", JSON.stringify(json, null, 2));
  
      const userErrors = json.data?.cartCreate?.userErrors;
      if (userErrors?.length > 0) {
        console.error("❌ Shopify Cart Errors:", userErrors);
        alert(`Error: ${userErrors[0].message}`);
        setLoading(false);
        return;
      }
  
      const checkoutUrl = json.data?.cartCreate?.cart?.checkoutUrl;
      if (!checkoutUrl) {
        throw new Error("Checkout URL missing.");
      }
  
      window.location.href = checkoutUrl;
  
    } catch (err) {
      console.error("❌ Cart checkout failed:", err);
      alert("Checkout failed.");
      setLoading(false);
    }
  };
  
  
  

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <p>{item.title}</p>
              <p>Price: ₹{item.price}</p>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
              />
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}
          <h3>Total: ₹{total}</h3>
          <button onClick={handleCheckout} disabled={loading}>
            {loading ? "Redirecting..." : "Proceed to Checkout"}
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
