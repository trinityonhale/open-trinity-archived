import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/Home/Page";
import ShowProject from "./pages/Projects/Show";
import CreateProject from "./pages/Projects/Create";
import ShowTask from "./pages/Tasks/Show";

const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/projects/create",
      element: <CreateProject />,
    },
    {
      path: "/projects/:projectId",
      element: <ShowProject />,
    },
    {
      path: '/tasks/:taskId',
      element: <ShowTask />,
    },
    {
      path: '*',
      element: <div>Not found</div>
    }
  ]);

export { router };