import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { CallProvider } from "@/components/call/CallProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DepartmentProvider } from '@/contexts/DepartmentContext';
import { SocketProvider } from '@/contexts/SocketContext';
import Routes from "@/Routes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SocketProvider>
          <DepartmentProvider>
            <CallProvider>
              <BrowserRouter>
                <TooltipProvider>
                  <Routes />
                </TooltipProvider>
              </BrowserRouter>
            </CallProvider>
          </DepartmentProvider>
        </SocketProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;