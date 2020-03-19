import React, { Component } from 'react';
import { Query } from 'react-apollo'; // Render prop via Apollo (they also have a high ordered component)
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from './Item';

const ALL_ITEMS_QUERY = gql`
    query ALL_ITEMS_QUERY {
        items {
        id
        title
        price
        description
        image
        largeImage
    }
}
`;

const Center = styled.div`
    text-align: center;
`;
const ItemsList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 60px;
    max-width: ${props => props.theme.maxWidth}
`;

export default class Items extends Component {
    render(){
        return(
            <Center>
                <Query query={ALL_ITEMS_QUERY}>
                    {({data, error, loading}) =>{
                        console.log(data)
                        if(loading) return <p>Loading...</p>
                        if(error) return <p>Error: {error.message}</p>
                        return <ItemsList>
                            {data.items.map(item => <Item key={item.id} item={item}></Item>)}
                        </ItemsList>
                    }}
                </Query>
            </Center>
        )
    }
}