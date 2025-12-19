import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner" // <--- Updated import
import Home from './pages/Home';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background font-sans antialiased dark">
        <Home />
        <Toaster /> 
      </div>
    </QueryClientProvider>
  )
}

export default App