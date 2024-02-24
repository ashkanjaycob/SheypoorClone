import { BrowserRouter } from "react-router-dom";
import Router from "../src/router/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import defaultOptions from "./configs/reactQueryConfigs";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


function App() {

  const queryClient = new QueryClient({
    defaultOptions,
  });
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}

export default App;
