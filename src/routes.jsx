//routes.jsx
import Index from "./pages";
import SignIn from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
import ForgotPassword from "./pages/auth/forgot-password";
import Profile from "./pages/dashboard/profile";
import ResetPassword from "./pages/auth/reset-password";
import HppCalculate from "./pages/dashboard/hpp-calculate";
import OperationalExpense from "./pages/dashboard/operational-expense";
import Pricing from "./pages/dashboard/pricing";
import SalesRecap from "./pages/dashboard/sales-recap";
import Product from "./pages/dashboard/product";

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
      {
        path: "hpp",
        element: <HppCalculate />,
      },
      {
        path: "operational-expenses",
        element: <OperationalExpense />,
      },
      {
        path: "pricing",
        element: <Pricing />,
      },
      {
        path: "sales-recap",
        element: <SalesRecap />,
      },
      {
        path: "products",
        element: <Product />,
      },
    ],
  },
];

export default routes;
