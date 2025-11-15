import { Provider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/providers/auth";
import QueryProvider from "@/providers/query";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <QueryProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster richColors />
            {children}
          </TooltipProvider>
        </AuthProvider>
      </QueryProvider>
    </Provider>
  );
};

export default AppProviders;
