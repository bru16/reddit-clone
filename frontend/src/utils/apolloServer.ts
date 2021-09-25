import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { NextPageContext } from "next";
import { withApollo } from "next-apollo";
import { PaginatedPosts } from "../generated/graphql";

export const client = (ctx: NextPageContext) =>
  new ApolloClient({
    link: createHttpLink({
      credentials: "include",
      uri: "http://localhost:4000/graphql",
      headers: {
        cookie:
          (typeof window === "undefined"
            ? ctx?.req?.headers.cookie
            : undefined) || "",
      },
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: false,
              merge(
                existing: PaginatedPosts | undefined,
                incoming: PaginatedPosts
              ): PaginatedPosts {
                return {
                  __typename: "PaginatedPosts",
                  hasMore: incoming.hasMore,
                  posts: [...(existing?.posts || []), ...incoming.posts],
                };
              },
            },
          },
        },
      },
    }),
  });

export default withApollo(client);