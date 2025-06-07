import Index from "./pages";
import SignIn from "./pages/auth/sign-in";
import ForgotPassword from "./pages/auth/forgot-password";
import Profile from "./pages/dashboard/Profile/profile";
import ResetPassword from "./pages/auth/reset-password";
import ServiceCost from "./pages/dashboard/HppCalculate/service-cost";
import OperationalExpense from "./pages/dashboard/OperationalExpense/operational-expense";
import Pricing from "./pages/dashboard/Pricing/pricing";
import SalesRecap from "./pages/dashboard/SalesRecap/sales-recap";
import Service from "./pages/dashboard/Product/service";
import CostComponent from "./pages/dashboard/CostComponent/cost-component";
import ExpenseCategory from "./pages/dashboard/ExpenseCategory/expense-category";
import Dashboard from "./pages/dashboard/dashboard";

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
        path: "",
        element: <Dashboard />,
      },
      {
        path: "me",
        element: <Profile />,
      },
      {
        path: "service-cost",
        element: <ServiceCost />,
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
        path: "services",
        element: <Service />,
      },
      {
        path: "cost-components",
        element: <CostComponent />,
      },
    ],
  },
];

export default routes;
