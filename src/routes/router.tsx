import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import TripsHome from "../pages/trips/TripsHome";
import CreateTrip from "../pages/trips/CreateTrip";
import EditTrip from "../pages/trips/EditTrip";
import TripDetail from "../pages/trips/TripDetail";
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
        path: "trips/new",
        element: <CreateTrip />,
      },
      {
        path: "trips/:id",
        element: <TripDetail />,
      },
      {
        path: "trips/:id/edit",
        element: <EditTrip />,
      },
      {
        path: "auth/login",
        element: <Login />,
      },
      {
        path: "auth/register",
        element: <Register />,
      },
    ],
  },
]);

export default router;
