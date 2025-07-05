import { Fragment, useEffect, useState } from "react";

// MUI
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";

// CUSTOM COMPONENTS
import { H5 } from "@/components/typography";
import FlexBox from "@/components/flexbox/FlexBox";

// PAGE SECTION COMPONENTS
import TabComponent from "@/page-sections/accounts";

// ICONS
import Apps from "@/icons/Apps";
import Icons from "@/icons/account";

// STYLED COMPONENTS
import { StyledButton } from "../styles";
import { useLocation, useSearchParams } from "react-router-dom";
import { getSession } from "../../../helper/authHelper";

export default function AccountsPageView() {
  const downMd = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [openDrawer, setOpenDrawer] = useState(false);
  const userInfo = getSession();
  const userRole = userInfo?.role;

  // Define all tab options
  const allTabs = {
    "Basic Information": {
      id: 1,
      name: "Basic Information",
      Icon: Icons.UserOutlined,
    },
    "Notifications": {
      id: 2,
      name: "Notifications",
      Icon: Icons.NotificationOutlined,
    },
    "Password": {
      id: 3,
      name: "Password",
      Icon: Icons.LockOutlined,
    },
  };

  // Role-based tab mapping
  const roleTabMap = {
    super_admin: ["Password"],
    sub_admin: [ "Password"],
    care_home: ["Basic Information", "Notifications", "Password"],
    family_member: [ "Password"],
    patient: [],
  };

  const dynamicTabList = roleTabMap[userRole]?.map((tabName) => allTabs[tabName]) || [];

  // Set default active tab
  const defaultTab = dynamicTabList[0]?.name || "";
  const [active, setActive] = useState(defaultTab);

  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const notificationId = searchParams.get("id");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && dynamicTabList.some((item) => item.name === tab)) {
      setActive(tab);
    } else {
      setActive(defaultTab);
      if (defaultTab) setSearchParams({ tab: defaultTab });
    }
  }, [location.pathname, searchParams, userRole]);

  const handleListItemBtn = (name) => () => {
    setActive(name);
    setOpenDrawer(false);
    setSearchParams({ tab: name });
  };

  const TabListContent = (
    <FlexBox flexDirection="column">
      {dynamicTabList.map(({ id, name, Icon }) => (
        <StyledButton
          key={id}
          variant="text"
          startIcon={<Icon />}
          active={active === name}
          onClick={handleListItemBtn(name)}
        >
          {name}
        </StyledButton>
      ))}
    </FlexBox>
  );

  return (
    <div className="pt-2 pb-4">
      <Grid container spacing={3}>
        <Grid
          size={{
            md: 3,
            xs: 12,
          }}
        >
          {downMd ? (
            <Fragment>
              <FlexBox alignItems="center" gap={1} onClick={() => setOpenDrawer(true)}>
                <IconButton sx={{ padding: 0 }}>
                  <Apps sx={{ color: "text.primary" }} />
                </IconButton>
                <H5 fontSize={16}>More</H5>
              </FlexBox>
              <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
                <Box padding={1}>{TabListContent}</Box>
              </Drawer>
            </Fragment>
          ) : (
            <Card sx={{ p: "1rem 0" }}>{TabListContent}</Card>
          )}
        </Grid>

        <Grid
          size={{
            md: 9,
            xs: 12,
          }}
        >
          {active === "Basic Information" && <TabComponent.BasicInformation />}
          {active === "Notifications" && !notificationId && <TabComponent.Notifications />}
          {active === "Notifications" && notificationId && <TabComponent.NotificationsDetails />}
          {active === "Password" && <TabComponent.Password />}
        </Grid>
      </Grid>
    </div>
  );
}
