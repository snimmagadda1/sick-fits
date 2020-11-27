import React from "react";
import Downshift from "downshift";
import Router from "next/router";
import gql from "graphql-tag";
import { ApolloConsumer } from "react-apollo";
import { DropDown, DropDownItem, SearchStyles } from "./styles/DropDown";
import debounce from "lodash.debounce"; // will control firing rate of events

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(
      where: {
        OR: [
          { title_contains: $searchTerm }
          { description_contains: $searchTerm }
        ]
      }
    ) {
      id
      image
      title
    }
  }
`;

class AutoComplete extends React.Component {
  state = {
    items: [],
    loading: false,
  };

  onChange = debounce(async (e, client) => {
    this.setState({ loading: true });
    // Manually query apollo client
    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: e.target.value },
    });
    this.setState({
      items: res.data.items,
      loading: false,
    });
  }, 350);

  render() {
    return (
      <SearchStyles>
        <div>
          <ApolloConsumer>
            {(client) => (
              <input
                type="search"
                onChange={(e) => {
                  e.persist();
                  this.onChange(e, client);
                }}
              />
            )}
          </ApolloConsumer>

          <DropDown>
            {this.state.items.map((item) => (
              <DropDownItem>
                <img key={item.id} width="50" src={item.image} alt={item.title}></img>
              </DropDownItem>
            ))}
          </DropDown>
        </div>
      </SearchStyles>
    );
  }
}

export default AutoComplete;
