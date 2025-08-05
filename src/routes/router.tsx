import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import TripsHome from "../pages/trips/TripsHome";
import Homepage from "../pages/Homepage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Homepage />,
      },
      {
        path: "trips",
        element: <TripsHome />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);

export default router;
