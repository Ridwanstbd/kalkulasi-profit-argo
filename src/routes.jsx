//routes.jsx
import Index from "./pages";
import SignIn from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
import ForgotPassword from "./pages/auth/forgot-password";
import Profile from "./pages/dashboard/Profile/profile";
import ResetPassword from "./pages/auth/reset-password";
import HppCalculate from "./pages/dashboard/HppCalculate/hpp-calculate";
import OperationalExpense from "./pages/dashboard/OperationalExpense/operational-expense";
import Pricing from "./pages/dashboard/Pricing/pricing";
import SalesRecap from "./pages/dashboard/SalesRecap/sales-recap";
import Product from "./pages/dashboard/Product/product";
import CostComponent from "./pages/dashboard/CostComponent/cost-component";
import ExpenseCategory from "./pages/dashboard/ExpenseCategory/expense-category";

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
        path: "expense-categories",
        element: <ExpenseCategory />,
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
      {
        path: "cost-components",
        element: <CostComponent />,
      },
    ],
  },
];

export default routes;
