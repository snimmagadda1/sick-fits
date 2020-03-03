import React, { Component } from 'react';
import Header from '../components/Header';
import Meta from '../components/Header';
import styled, { ThemeProvider, injectGlobal } from 'styled-components'; // Uses react context API (allows for less prop drilling)

// a theme is just a constant that we can reference throughout the app (think sass)

const theme = {
    red: '#FF0000',
    black: '#393939',
    grey: '#3A3A3A',
    lightgrey: '#E1E1E1',
    offWhite: '#EDEDED',
    maxWidth: '1000px',
    bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)', // Box shadow
};

const StyledPage = styled.div`
    background: white; 
    color: black;
`;

const Inner = styled.div`
    max-width: ${props => props.theme.maxWidth};
    margin : 0 auto;
    padding: 2rem;
    background: ${props => props.theme.red};
`;


class Page extends Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <StyledPage>
                    <Meta />
                    <Header />
                    <Inner>
                        {this.props.children}
                    </Inner>
                </StyledPage>
            </ThemeProvider>
        );
    }
}

export default Page;