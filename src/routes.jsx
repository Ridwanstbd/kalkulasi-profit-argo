//routes.jsx
import Index from "./pages";
import SignIn from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
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
      {
        path: "register",
        element: <SignUp />,
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
