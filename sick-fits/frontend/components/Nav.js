import Link from "next/link";
import NavStyles from "./styles/NavStyles";
import User from "./User";
import Signout from "./Signout";
import { Mutation } from "react-apollo";
import { TOGGLE_CART_MUTATION } from "./Cart";
import CartCount from "./CartCount";

const Nav = () => (
  <User>
    {/* Double destructure of payload -> data -> me into top level var me */}
    {({ data: { me } }) => (
      <NavStyles>
        <Link href="/items ">
          <a>Shop</a>
        </Link>
        {me && (
          <>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
            <Link href="/orders ">
              <a>Orders</a>
            </Link>
            <Link href="/me">
              <a>Account</a>
            </Link>
            <Signout></Signout>
            {/* With a few lines of code we can expose this toggle
                functionality anywhere within the app... 
                no prop drilling */}
            <Mutation mutation={TOGGLE_CART_MUTATION}>
              {(toggleCart) => <button onClick={toggleCart}>My Cart <CartCount count={me.cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)}></CartCount></button>}
            </Mutation>
          </>
        )}

        {!me && (
          <Link href="/signup">
            <a>Signup</a>
          </Link>
        )}
      </NavStyles>
    )}
  </User>
);

export default Nav;
