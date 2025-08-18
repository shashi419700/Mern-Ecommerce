import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Loader, { Skeleton } from "../components/loader";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/Api/ProductAPI";
import type { CartItem } from "../Types/type";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/Reducer/cardReducer";

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");

  const dispatch = useDispatch();

  const addToCardHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");

    dispatch(addToCart(cartItem));
  };

  if (isError) toast.error("Cannot Fetched the Products");
  return (
    <div className="home">
      <section></section>

      <h1>
        Latest Products
        <Link to={"/search"} className="findmore">
          More
        </Link>
      </h1>
      <main>
        <Skeleton width="80vm" />
        {isLoading ? (
          <Loader />
        ) : (
          data?.products.map((i) => (
            <ProductCard
              key={i._id}
              productId={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              handler={addToCardHandler}
              photo={i.photo}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
