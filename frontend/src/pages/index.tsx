import {
  Button,
  Container,
  Flex,
  Heading,
  Link,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { withApollo } from "next-apollo";
import NextLink from "next/link";
import React from "react";
import { Post } from "../components/Post";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: { limit: 10, cursor: null },
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

  return (
    <Container justifyContent="center" mt={10}>
      <Flex mb={3} p={3} align="center">
        <Heading>Reddit</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">Create Post!</Link>
        </NextLink>
      </Flex>
      {loading && !data ? (
        <Flex h={400} align="center" justifyContent="center">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Stack spacing={8} mb={10}>
          {data!.posts.posts.map((p) => (
            <Flex p={3} shadow="md" borderWidth="1px" key={p.id}>
              <Post post={p} />
            </Flex>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore && (
        <Flex justifyContent="center" p={4}>
          <Button onClick={handleFetchMore}>Load more...</Button>
        </Flex>
      )}
    </Container>
  );
};

export default Index;
