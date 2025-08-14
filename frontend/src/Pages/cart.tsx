import axios from "axios";
import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItemCard from "../Components/cart-item";
import type { CartReducerInitialState } from "../Types/Reducer-types";
import type { CartItem } from "../Types/type";
import {
  addToCart,
  calculatePrice,
  discountApplied,
  removeCartItem,
} from "../redux/Reducer/cardReducer";
import { server } from "../redux/store";

const Cart = () => {
  const dispatch = useDispatch();

  const { cartItems, subtotal, tax, total, shippingCharges, discount } =
    useSelector(
      (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
    );

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean | null>(
    null
  );

  const incrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };

  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };

  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  useEffect(() => {
    const { token, cancel } = axios.CancelToken.source();
    if (!couponCode.trim()) {
      setIsValidCouponCode(null);
      return;
    }

    const timeOutID = setTimeout(() => {
      axios
        .get(
          `${server}/app/v1/payment/discount`,
          {
            params: { coupon: couponCode },
          },
          { cancelToken: token }
        )
        .then((res) => {
          dispatch(discountApplied(res.data.discount));
          setIsValidCouponCode(true);
        })
        .catch(() => {
          dispatch(discountApplied(0));
          setIsValidCouponCode(false);
          dispatch(calculatePrice());
        });
    }, 500);

    return () => {
      clearTimeout(timeOutID);
      cancel();
      setIsValidCouponCode(false);
      dispatch(calculatePrice());
    };
  }, [couponCode]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div>
      <main className="cart">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <CartItemCard
              key={item.productId}
              cartItem={item}
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
            />
          ))
        ) : (
          <h1>No Items Added</h1>
        )}

        <aside>
          <p>Subtotal: ₹{subtotal}</p>
          <p>Shipping Charges: ₹{shippingCharges}</p>
          <p>Tax: ₹{tax}</p>
          <p>
            Discount: <em className="red">- ₹{discount}</em>
          </p>
          <p>
            <b>Total: ₹{total}</b>
          </p>

          <input
            type="text"
            placeholder="Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />

          {couponCode &&
            isValidCouponCode !== null &&
            (isValidCouponCode ? (
              <span className="green">
                ₹{discount} off using <code>{couponCode}</code>
              </span>
            ) : (
              <span className="red">
                Invalid coupon <VscError />
              </span>
            ))}

          {cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
        </aside>
      </main>
    </div>
  );
};

export default Cart;
