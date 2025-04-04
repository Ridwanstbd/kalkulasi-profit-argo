//routes.jsx
import Index from "./pages";
import SignIn from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
import ForgotPassword from "./pages/auth/forgot-password";
import Profile from "./pages/dashboard/profile";
import ResetPassword from "./pages/auth/reset-password";

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
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
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
