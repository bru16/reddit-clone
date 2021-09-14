import { useApolloClient } from "@apollo/client";
import { Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

export const NavBar: React.FC = ({}) => {
  const { data, loading } = useMeQuery();
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const apolloClient = useApolloClient();

  const handleLogout = async () => {
    await logout();
    await apolloClient.resetStore(); // reset cache
  };

  if (loading) return null;

  return (
    <Flex justifyContent="flex-end" bg="aliceblue" p={4}>
      {!data?.me ? (
        <>
          <NextLink href="/register">
            <Link mr="3">Sign Up</Link>
          </NextLink>
          <NextLink href="/login">
            <Link>Log In</Link>
          </NextLink>
        </>
      ) : (
        <>
          <h2>Welcome {data.me.username}!</h2>
          <Button
            pb={2}
            size="sm"
            onClick={handleLogout}
            isLoading={logoutLoading}
          >
            Logout
          </Button>
        </>
      )}
    </Flex>
  );
};
