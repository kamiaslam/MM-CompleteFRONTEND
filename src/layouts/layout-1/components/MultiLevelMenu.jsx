import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useLayout from "@/layouts/layout-1/context/useLayout";
import SidebarAccordion from "./SidebarAccordion";
import {
  ItemText,
  ListLabel,
  BulletIcon,
  ICON_STYLE,
  ExternalLink,
  NavItemButton,
} from "@/layouts/layout-1/styles";
import {
  navigations,
  roleWiseRouteAccess,
} from "@/layouts/layout-parts/navigation";

export default function MultiLevelMenu({ sidebarCompact }) {
  const { user } = useAuth(); // Get authenticated user data
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { handleCloseMobileSidebar } = useLayout();

  // Highlight the active route
  const activeRoute = (path) => (pathname === path ? 1 : 0);

  // Navigate to the specified route
  const handleNavigation = (path) => {
    navigate(path);
    handleCloseMobileSidebar?.();
  };

  const COMPACT = sidebarCompact ? 1 : 0;

  // Recursive function to filter navigation based on user roles
  const filterRoutes = (items, allowedRoutes, userRole) => {
    return items
      .map((item) => {
        // Check if item is restricted to specific roles
        if (item.roleSpecific && !item.roleSpecific.includes(userRole)) {
          return null;
        }

        // If it's a label, check if it has any valid children
        if (item.type === "label") {
          const hasValidChildren = items.some(
            (child) =>
              child.type !== "label" &&
              (!child.roleSpecific || child.roleSpecific.includes(userRole)) &&
              (child.path ? allowedRoutes.includes(child.path) : false) &&
              (!child.children ||
                filterRoutes(child.children, allowedRoutes, userRole).length >
                  0)
          );
          return hasValidChildren ? item : null;
        }

        // Exclude items not in the allowed routes
        if (item.path && !allowedRoutes.includes(item.path)) {
          return null;
        }

        // If it has children, filter them recursively
        if (item.children) {
          const filteredChildren = filterRoutes(
            item.children,
            allowedRoutes,
            userRole
          );
          return filteredChildren.length > 0
            ? { ...item, children: filteredChildren }
            : null;
        }

        return item;
      })
      .filter(Boolean);
  };
  // Filter navigation items based on user's role
  const filteredNavigation = useMemo(() => {
    if (!user?.role) return [];

    const allowedRoutes =
      roleWiseRouteAccess.find((role) => role.roleName === user.role)
        ?.routeAccess || [];

    return filterRoutes(navigations, allowedRoutes, user.role);
  }, [user?.role]);

  // Recursive function to render the navigation menu
  const renderLevels = (data) => {
    return data.map((item, index) => {
      // Render Labels
      if (item.type === "label") {
        return (
          <ListLabel key={index} compact={COMPACT}>
            {t(item.label)}
          </ListLabel>
        );
      }

      // Render items with children
      if (item.children) {
        return (
          <SidebarAccordion key={index} item={item} sidebarCompact={COMPACT}>
            {renderLevels(item.children)}
          </SidebarAccordion>
        );
      }

      // Render external links
      if (item.type === "extLink") {
        return (
          <ExternalLink
            key={index}
            href={item.path}
            rel="noopener noreferrer"
            target="_blank"
          >
            <NavItemButton key={item.name} name="child" active={0}>
              {item.icon ? (
                <item.icon sx={ICON_STYLE(0)} />
              ) : (
                <span className="item-icon icon-text">{item.iconText}</span>
              )}
              <ItemText compact={COMPACT} active={activeRoute(item.path)}>
                {item.name}
              </ItemText>
            </NavItemButton>
          </ExternalLink>
        );
      }

      // Render standard navigation items
      return (
        <NavItemButton
          key={index}
          disabled={item.disabled}
          active={activeRoute(item.path)}
          onClick={() => handleNavigation(item.path)}
        >
          {item.icon ? (
            <item.icon sx={ICON_STYLE(activeRoute(item.path))} />
          ) : (
            <BulletIcon active={activeRoute(item.path)} />
          )}
          <ItemText compact={COMPACT} active={activeRoute(item.path)}>
            {t(item.name)}
          </ItemText>
        </NavItemButton>
      );
    });
  };

  // Render the filtered navigation
  return <>{renderLevels(filteredNavigation)}</>;
}
