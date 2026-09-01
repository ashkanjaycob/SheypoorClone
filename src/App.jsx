import { BrowserRouter } from "react-router-dom";
import Router from "../src/router/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import defaultOptions from "./configs/reactQueryConfigs";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from "./Components/Layout/Layout";
import ScrollToTop from "./Components/Layout/ScrollToTop";
import SheypoorAiCopilot from "./Components/AI/SheypoorAiCopilot";
import AddToHomeScreenPrompt from "./Components/Layout/AddToHomeScreenPrompt";
import '../src/styles/index.css';

function App() {
  const queryClient = new QueryClient({
    defaultOptions,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Router />
        </Layout>
        <SheypoorAiCopilot />
        <AddToHomeScreenPrompt />
      </BrowserRouter>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
