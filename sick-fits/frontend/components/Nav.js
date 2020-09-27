import Link from "next/link";
import NavStyles from "./styles/NavStyles";
import User from "./User";
import Signout from "./Signout";

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
