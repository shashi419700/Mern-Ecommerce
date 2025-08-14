import { User, type CartItem, type ShippingInfo } from "./type";

export interface UserReducerInitalState {
  user: User | null;
  loading: boolean;
}
export interface CartReducerInitialState {
  loading: boolean;
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  shippingInfo: ShippingInfo;
  coupon: string | undefined;
}
