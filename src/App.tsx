import './App.css'
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateEventPage from "./pages/CreateEventPage";
import EditEventPage from "./pages/EditEventPage.jsx";
import EventDetailsPage from "./pages/EventDetailsPage/EventDetailsPage.tsx";

const RootLayout = () => {
  return (
    <>
      <header className='header'>
        <h1>Event Management App</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "create",
        element: <CreateEventPage />,
      },
      {
        path: "edit/:id",
        element: <EditEventPage />,
      },
      {
        path: "event/:id",
        element: <EventDetailsPage />,
      },
    ],
  },
]);



function App() {
  return <RouterProvider router={router} />
}

export default App
