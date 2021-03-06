import Nav from './Nav'
import Link from 'next/link'
import styled from 'styled-components'
import Router from 'next/router';
import NProgress from 'nprogress';
import Cart from './Cart';
import Search from './Search';

// This is used for the route change visualization of loading
// No HTML/css needed!
Router.onRouteChangeStart =  () => {
    NProgress.start();
    console.log("onRouteChangeStart triggered")
}
Router.onRouteChangeComplete = () => {
    NProgress.done()
    console.log("onRouteChangeComplete triggered")
}  
Router.onRouteChangeError =  () => {
    NProgress.done()
    console.log("onRouteChangeError triggered")
}

// With styled-components you put media queries inside of the selectors you want them to apply to
// i.e can put inside of <a> tag, etc
const Logo = styled.h1`
    font-size: 4rem;
    margin-left: 2rem;
    position: relative;
    z-index: 2;
    transform: skew(-7deg);
    a{
        padding: 0.5rem 1rem;
        background: ${props => props.theme.red};
        color: white;
        text-transform: uppercase;
        text-decoration: none;
    }
    @media (max-width: 1300px) { 
        margin: 0;
        text-align: center;
    }
`;

const StyledHeader = styled.header`
    .bar {
        border-bottom: 10px solid ${props => props.theme.black};
        display: grid;
        grid-template-columns: auto 1fr;
        justify-content: space-between;
        align-items: stretch;
        @media (max-width: 1300px) { 
            grid-template-columns: 1fr;
            justify-content: center;
        }
    }
    .sub-bar {
        display: grid;
        grid-template-columns: 1fr auto;
        border-bottom: 1px solid ${props => props.theme.lightgrey}
    }
`;

const Header = () => (
    <StyledHeader>
        <div className="bar">
            <Logo> 
                <Link href="/">
                    <a>Sick fits</a>
                </Link>
            </Logo>
            <Nav />
        </div>
        <div className="sub-bar">
           <Search/>
        </div>
        <Cart></Cart>
    </StyledHeader>
)

export default Header;