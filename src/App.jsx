import { BrowserRouter } from "react-router-dom";
import Router from "../src/router/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import defaultOptions from "./configs/reactQueryConfigs";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from "./Components/Layout/Layout";
import '../src/styles/index.css'


function App() {

  const queryClient = new QueryClient({
    defaultOptions,
  });
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Layout>
          <Router />
          </Layout>
        </BrowserRouter>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}

export default App;
