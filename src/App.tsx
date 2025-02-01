import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { CallProvider } from "@/components/call/CallProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Routes from "@/Routes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <CallProvider>
            <BrowserRouter>
              <Routes />
            </BrowserRouter>
          </CallProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;