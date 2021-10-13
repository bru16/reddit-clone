import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Tag,
  TagLeftIcon,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { NavBar } from "../components/NavBar";
import { Post } from "../components/Post";
import { usePostsQuery } from "../generated/graphql";
import withApollo from "../utils/apolloServer";

const Index = () => {
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: { limit: 10, cursor: null },
    notifyOnNetworkStatusChange: true,
  });

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        limit: variables?.limit,
        cursor: data?.posts.posts[data.posts.posts.length - 1].created_at, // last post as a reference to paginate more posts.
      },
    });
  };

  if (!loading && !data) return <div>something went wrong</div>;
  if (loading && !data) return <LoadingSpinner />;

  return (
    <>
      <NavBar />
      <Container justifyContent="center" mt={10}>
        <Flex mb={3} p={3} align="center">
          <Heading>Reddit</Heading>
          <NextLink href="/create-post">
            <Box ml="auto" cursor="pointer">
              <Tag colorScheme="teal">
                <TagLeftIcon boxSize="12px" as={AddIcon} />
                Create Post!
              </Tag>
            </Box>
          </NextLink>
        </Flex>
        <Stack spacing={8} mb={10}>
          {data!.posts.posts.map((p) => (
            <Flex p={3} shadow="md" borderWidth="1px" key={p.id}>
              <Post post={p} />
            </Flex>
          ))}
        </Stack>
        {data && data.posts.hasMore && (
          <Flex justifyContent="center" p={4}>
            <Button onClick={handleFetchMore}>Load more...</Button>
          </Flex>
        )}
      </Container>
    </>
  );
};

export default withApollo({ ssr: true })(Index);
