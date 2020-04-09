import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';


const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item(where: {id: $id }){
            id
            title
            description
            price
        }
    }
`;

const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
        $id: ID!,
        $title: String
        $description: String
        $price: Int
    ) {
        updateItem(
            id: $id
            title : $title
            description : $description
            price : $price
        ){
            id
        }
    }
`;

class UpdateItem extends Component {

    state = {
    };

    // ** This is a handy hadleChange event handler that handles different 
    // types of input and mirrors n inputs to state **

    // instance property that we bind a function to to keep state of 
    // input element and component in sync 
    handleChange = (e) => {
        const { name, type, value } = e.target
        const val = type === 'number' ? parseFloat(value) : value;

        this.setState({ [name]: val })

    };

    updateItem = async (e, updateItemMutation) => {
        e.preventDefault();
        console.log('Updating Item');
        console.log(this.state);

        const res = await updateItemMutation({
            variables: {
                id:  this.props.id,
                ...this.state, 
            }
        });

        console.log("UPDATED")
    }

    render() {
        return (
            <Query query={SINGLE_ITEM_QUERY} variables={{
                id: this.props.id
            }}>

                {({ data, loading, error }) => {
                    if(loading) return <p>Loading</p>
                    if(!data.item) return <p>No iteme found for the ID {this.props.id}</p>
                    return (
                        <Mutation mutation={UPDATE_ITEM_MUTATION}
                            variables={this.state}>
                            {/* The only child of a mutation or query can be a function (render prop pattern)*/}
                            {(updateItem, { loading, error }) => ( // This is an implicit return in JSX

                                // The following line shows how to pass the mutation/query method to a component method
                                <Form onSubmit={e => this.updateItem(e, updateItem)}>
                                    <Error error={error}></Error>
                                    <fieldset disabled={loading} aria-busy={loading}>
                                        <label htmlFor="title">
                                            Title
                                            <input type="text" id="title" name="title"
                                                placeholder="Title" required
                                                defaultValue={data.item.title}
                                                onChange={this.handleChange} />
                                        </label>
                                        <label htmlFor="title">
                                            Price
                                            <input type="number" id="price" name="price"
                                                placeholder="Price" required
                                                defaultValue={data.item.price}
                                                onChange={this.handleChange} />
                                        </label>
                                        <label htmlFor="title">
                                            Description
                                            <textarea id="description" name="description"
                                                placeholder="Enter A Description" required
                                                defaultValue={data.item.description}
                                                onChange={this.handleChange} />
                                        </label>
                            <button type="submit">Sav{loading ? 'ing ' : 'e '}Changes</button>
                                    </fieldset>
                                </Form>
                            )}
                        </Mutation>
                    )
                }}
            </Query>
        );
    }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION }