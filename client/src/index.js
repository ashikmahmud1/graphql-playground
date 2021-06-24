import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { AuthProvider } from "./context/AuthContext";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
