import {
  Container,
  Box,
  Button,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { useForgotPasswordMutation } from "../generated/graphql";

export const forgotPassword: React.FC<{}> = ({}) => {
  const [forgotPassword] = useForgotPasswordMutation();
  const [emailWasSent, setEmailWasSent] = useState(false);

  if (emailWasSent) {
    return (
      <Box>
        <Alert
          status="success"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="950px"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Email was sent!
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            check your inbox to proceed
          </AlertDescription>
        </Alert>
      </Box>
    );
  }

  return (
    <Container mt={20} maxW="400">
      <Box textAlign="center">
        <h1>Forgot Password</h1>
      </Box>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values, actions) => {
          await forgotPassword({
            variables: { email: values.email },
          });
          setEmailWasSent(true);
        }}
      >
        {(props) => (
          <Form>
            <InputField name="email" placeholder="email" label="Email" />
            <Button
              mt={5}
              colorScheme="teal"
              isLoading={props.isSubmitting}
              type="submit"
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default forgotPassword;
