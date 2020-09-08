import React from "react";
import PaginationStyles from "./styles/PaginationStyles";
import gql from "graphql-tag";
import Head from "next/head";
import Link from "next/link";
import { Query } from "react-apollo";
import { perPage } from "../config";

const PAGINATION_QUERY = gql`
    query PAGINATION_QUERY {
        itemsConnection {
            aggregate {
                count
            }
        }
    }
`;

// functional component fun
const Pagination = (props) => (
    <Query query={PAGINATION_QUERY}>
        {({ data, loading, error }) => {
            if (loading) return <p>Loading...</p>;
            const count = data.itemsConnection.aggregate.count;
            const page = props.page;
            const pages = Math.ceil(count / perPage);
            return (
                <PaginationStyles>
                    <Head>
                        <title>
                            Sick Fits! {page} of {pages}
                        </title>
                    </Head>
                    <Link
                        prefetch
                        href={{
                            pathName: "items",
                            query: { page: page - 1 },
                        }}
                    >
                        <a clasName="prev" aria-disabled={page <=1 }>Prev</a>
                    </Link>
                    <p>
                        You are on page {props.page} of {pages}
                    </p>
                    <p>
                        {count} Items Total
                    </p>
                    <Link
                        prefetch
                        href={{
                            pathName: "items",
                            query: { page: page + 1 },
                        }}
                    >
                        <a clasName="prev" aria-disabled={page >= pages }>Next</a>
                    </Link>
                </PaginationStyles>
            );
        }}
    </Query>
);

export default Pagination;
