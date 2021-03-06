import withApollo from 'next-with-apollo'; // TODO what does this do? Something w/ SSSR
import ApolloClient from 'apollo-boost';
import { endpoint } from '../config';
import { LOCAL_STATE_QUERY } from '../components/Cart';

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
        },
        headers,
      });
    },
    clientState : {
      resolvers: {
        Mutation: {
          toggleCart(_, variables, { cache }) {
            // 1. read cartOpen from cache 
            const { cartOpen } = cache.readQuery({
              query: LOCAL_STATE_QUERY,
            });
            console.log('The value of cartOpen is ', cartOpen);

            // 2. swap value 
            const data = {
              data: { cartOpen: !cartOpen }
            }; 
            cache.writeData(data);
            return data;
          }
        },
      },
      defaults: {
        cartOpen: false,
      },
    },
  });
}

export default withApollo(createClient);
