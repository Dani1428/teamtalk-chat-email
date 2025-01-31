import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "sonner";
import Routes from "./routes";
import { CallProvider } from "./components/call/CallProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CallProvider>
          <BrowserRouter>
            <Routes />
            <Toaster richColors position="top-center" />
          </BrowserRouter>
        </CallProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;