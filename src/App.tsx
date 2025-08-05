import { RouterProvider } from "react-router";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import router from "./routes/router";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
