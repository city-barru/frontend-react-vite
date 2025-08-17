import { RouterProvider } from "react-router";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import router from "./routes/router";
import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster expand={true} richColors position="top-center" />
    </AuthProvider>
  );
}

export default App;
