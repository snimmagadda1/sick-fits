import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from '../components/ErrorMessage';


const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String
    ) {
        createItem(
            title : $title
            description : $description
            price : $price
            image : $image
            largeImage : $largeImage
        ){
            id
        }
    }
`;

class CreateItem extends Component {

    state = {
        title: '',
        description: '',
        image: '',
        largeImage: '',
        price: 1000,
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

    uploadFile = async e => {
        console.log('uploading file...');
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'sickfits');

        const res = await fetch('https://api.cloudinary.com/v1_1/funsaizedcloud/image/upload', {
            method: 'POST',
            body: data,
        });
        const file = await res.json();
        console.log(file);
        this.setState({
            image: file.secure_url,
            largeImage: file.eager[0].secure_url,
        });
    };

    render() {
        return (
            <Mutation mutation={CREATE_ITEM_MUTATION}
                variables={this.state}>
                {(createItem, { loading, error, called, data }) => (

                    <Form onSubmit={async (e) => {
                        // Stop the form from submitting (URL bar)
                        e.preventDefault();
                        // Call the mutation 
                        const response = await createItem();
                        // Change them to the single item page 
                        Router.push({
                            pathname: '/item',
                            query: { id: response.data.createItem.id },
                        })
                    }}>
                        <Error error={error}></Error>
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor="file">
                                Image
                                <input type="file" id="file" name="file"
                                    placeholder="Upload an image" required
                                    onChange={this.uploadFile} />
                                {this.state.image && (
                                    <img width="200" src={this.state.image} alt="Upload Preview" />
                                )}
                            </label>
                            <label htmlFor="title">
                                Title
                                <input type="text" id="title" name="title"
                                    placeholder="Title" required
                                    value={this.state.title}
                                    onChange={this.handleChange} />
                            </label>
                            <label htmlFor="title">
                                Price
                                <input type="number" id="price" name="price"
                                    placeholder="Price" required
                                    value={this.state.price}
                                    onChange={this.handleChange} />
                            </label>
                            <label htmlFor="title">
                                Description
                                <textarea id="description" name="description"
                                    placeholder="Enter A Description" required
                                    value={this.state.description}
                                    onChange={this.handleChange} />
                            </label>
                            <button type="submit">Submit</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION }