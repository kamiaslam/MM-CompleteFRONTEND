import { lazy } from "react";
import Loadable from "./Loadable";
import { AuthRoutes } from "./auth";
import useAuth from "@/hooks/useAuth";
import useSettings from "@/hooks/useSettings";
import { AuthGuard } from "@/components/auth";
import { PublicRoutes } from "./public";
import { staticArray } from "./dashboard";
import { ComponentRoutes } from "./components"; // GLOBAL ERROR PAGE
import LayoutV1 from "@/layouts/layout-1";
import LayoutV2 from "@/layouts/layout-2"; // ALL DASHBOARD PAGES
import { roleWiseRouteAccess } from "../layouts/layout-parts/navigation";
import { Navigate } from "react-router-dom";
const ErrorPage = Loadable(lazy(() => import("@/pages/404"))); // LANDING / INITIAL PAGE
const Analytics = Loadable(lazy(() => import("@/pages/dashboard/analytics")));
const Landing = Loadable(lazy(() => import("@/pages/landing")));
export const routes = () => {
  const ActiveLayout = () => {
    // const { settings } = useSettings();
    return <LayoutV1 />;
  };
  const RoleBaseRoute = () => {
    const { user } = useAuth();

    const roleWiseArray = roleWiseRouteAccess.find((staticUser) => staticUser.roleName === user?.role)?.routeAccess;
    const returnArray = staticArray?.filter((data) => roleWiseArray?.includes(`/dashboard/${data?.path}`));
    return [
      {
        index: true,
        element: <Analytics />,
      },
      ...returnArray,
    ];
  };

  const DashboardRoutes = [
    {
      path: "dashboard",
      element: (
        <AuthGuard>
          <ActiveLayout />
        </AuthGuard>
      ),
      children: RoleBaseRoute(),
    },
  ];

  const { isAuthenticated } = useAuth();

  return [
    // INITIAL / INDEX PAGE
    {
      path: "/",
      // element: <Landing />,
      element: <Navigate to="/dashboard" replace />,
    }, // GLOBAL ERROR PAGE
    {
      path: "*",
      element: isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />,
    }, // AUTHENTICATION PAGES ROUTES & DIFFERENT AUTH DEMO PAGES ROUTES
    ...AuthRoutes, // COMPONENTS PAGES ROUTES
    ...ComponentRoutes, // INSIDE DASHBOARD PAGES ROUTES
    ...DashboardRoutes, // PAGES ROUTES
    ...PublicRoutes,
  ];
};
