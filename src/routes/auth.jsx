import { lazy } from "react";
import Loadable from "./Loadable";
import { GuestGuard } from "@/components/auth"; // AUTHENTICATION RELATED PAGES

const Login = Loadable(lazy(() => import("@/pages/sessions/login")));
const Register = Loadable(lazy(() => import("@/pages/sessions/register")));
const VerifyCode = Loadable(lazy(() => import("@/pages/sessions/verify-code")));
const ForgetPassword = Loadable(lazy(() => import("@/pages/sessions/forget-password"))); // DIFFERENT AUTH DEMO PAGES
const ResetPassword = Loadable(lazy(() => import("@/pages/sessions/reset-password"))); // DIFFERENT AUTH DEMO PAGES
export const AuthRoutes = [
  // AUTHENTICATION PAGES ROUTES
  {
    element: <GuestGuard />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "verify-code",
        element: <VerifyCode />,
      },
    ],
  },
];
