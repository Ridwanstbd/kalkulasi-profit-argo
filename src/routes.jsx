//routes.jsx
import Index from "./pages";
import SignIn from "./pages/auth/sign-in";
import Profile from "./pages/dashboard/profile";

const routes = [
  {
    layout: "guest",
    pages: [
      {
        path: "",
        element: <Index />,
      },
    ],
  },
  {
    layout: "auth",
    pages: [
      {
        path: "login",
        element: <SignIn />,
      },
    ],
  },
  {
    layout: "dashboard",
    pages: [
      {
        path: "me",
        element: <Profile />,
      },
    ],
  },
];

export default routes;
