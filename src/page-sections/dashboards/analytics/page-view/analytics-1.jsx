
import DailyVisitors from "../../ecommerce/DailyVisitors";
import Familymembersection from "../../dashboardcomponent/familymembersection";
import OtherFamilyMembersLastSeenSection from "../../dashboardcomponent/familymembersection/OtherFamilyMembersSectionWithLastSeen"
import TopActivityDashboard from "../../dashboardcomponent/topactivity";
import Memorysection from "../../dashboardcomponent/memory";
import SentimentAnalysisSection from "../../dashboardcomponent/Sentiment Analysis";
import SentimentAnalysisSectionPerday from "../../dashboardcomponent/Sentiment Analysis per day"
import Cognitivesection from "../../dashboardcomponent/cognitivesection";
import Chatsection from "../../dashboardcomponent/chatsection";
import useAuth from "@/hooks/useAuth";
import { Card, Typography, useTheme } from "@mui/material";
import UserList from "../user-table";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import TotalCareHome from "../../ecommerce/TotalCareHome";
import TotalCareHomeCalmCalls from "../../ecommerce/TotalCareHomeCalmCalls";
import TotalCareHomePositiveCalls from "../../ecommerce/TotalCareHomePositiveCalls";
import TotalCareHomeNegativeCalls from "../../ecommerce/TotalCareHomeNegativeCalls";
import TotalFamilyMember from "../../ecommerce/TotalFamilyMember"
import TotalPatients from "../../ecommerce/TotalPatient";
import TotalCalls from "../../ecommerce/TotalCalls";
import UserActivity from "../../finances/UserActivities";
import CallData from "../../finances/CallData";
import RevenueOverview from "../../finances/RevenueOverview";
import SubscriptionTrends from "../../finances/SubscriptionTrends";
import SubscriptionPlansChart from "../../finances/SubscriptionPlansChart";
import { CarehomeSentimentProvider } from "@/contexts/CarehomeSentimentContext";
import Grid from '@mui/material/Grid2';
import NeverRegisteredBack from '../demoAnalysisComponents/NeverRegisteredBack';
import NeverUsedBotPercentage from '../demoAnalysisComponents/NeverUsedBotPercentage';
import NotAccessedByAdmin from '../demoAnalysisComponents/NotAccessedByAdmin';
import RegisteredBackAfter30Minutes from '../demoAnalysisComponents/RegisteredBackAfter30Minutes';
import ActiveUsersTable from '../user-table/ActiveUserdamoTable';
import UsersWaitingForAccessTable from '../user-table/UsersWaitingForDemoAccessTable';
import { SelectedComponentProvider } from "@/contexts/demoFilteringComponentContext";
//const Maintenance = Loadable(lazy(() => import('@/pages/maintenance')));
import MaintenancePage from "@/pages/maintenance";
// Import greetings from constants.js
import { GREETINGS } from "../../../../utils/constants";
import SelectedUserTable from "../user-table/SelectedUserTable";

export default function Analytics1PageView() {
  const { user_info } = JSON.parse(localStorage.getItem("authUser"));
  const { user } = useAuth();
  const theme = useTheme();
  const role = user?.role;

  // Get current hour
  const currentHour = new Date().getHours();
  
  // Determine the greeting based on the time of day
  let greetingMessage = GREETINGS.night; // Default to night greeting

  if (currentHour < 12) {
    greetingMessage = GREETINGS.morning;
  } else if (currentHour < 14) {
    greetingMessage = GREETINGS.lateMorning;
  } else if (currentHour < 17) {
    greetingMessage = GREETINGS.afternoon;
  } else if (currentHour < 19) {
    greetingMessage = GREETINGS.evening;
  }

  return (
    <div className="pt-2 pb-4">
      <Grid container spacing={3}>
        {role === "super_admin" && (
          <>
            <Grid size={{ lg: 3, sm: 6, xs: 12 }}>
              <TotalCareHome />
            </Grid>
            <Grid size={{ lg: 3, sm: 6, xs: 12 }}>
              <TotalPatients />
            </Grid>
            <Grid size={{ lg: 3, sm: 6, xs: 12 }}>
              <TotalFamilyMember />
            </Grid>
            <Grid size={{ lg: 3, sm: 6, xs: 12 }}>
              <TotalCalls />
            </Grid>
            {/* <Grid size={{ lg: 12, sm: 12, xs: 12 }}>
              <UserActivity />
            </Grid>
            <Grid size={{ lg: 12, sm: 12, xs: 12 }}>
              <CallData />
            </Grid>
            <Grid size={{ lg: 12, sm: 12, xs: 12 }}>
              <RevenueOverview />
            </Grid>
            <Grid size={{ lg: 12, sm: 12, xs: 12 }}>
              <SubscriptionTrends />
            </Grid>
            <Grid size={{ lg: 12, sm: 12, xs: 12 }}>
              <SubscriptionPlansChart />
            </Grid> */}
      {/* <SelectedComponentProvider>        
        <Grid container spacing={3}>
          <Grid size={{
              md: 4,
              xs: 12
            }}>
                <NeverRegisteredBack />
          </Grid>
          <Grid size={{
              md: 4,
              xs: 12
            }}>
                <NeverUsedBotPercentage />
          </Grid>
          <Grid size={{
              md: 4,
              xs: 12
            }}>
                <RegisteredBackAfter30Minutes />
          </Grid>
          <Grid size={12}>
            <SelectedUserTable/>
          </Grid>
          <Grid size={12}>
            <ActiveUsersTable/>
          </Grid>
          <Grid size={{
              md: 12,
              xs: 12
            }}>
                <NotAccessedByAdmin />
          </Grid>
          <Grid size={12}>
            <UsersWaitingForAccessTable/>
          </Grid>
        </Grid>
      </SelectedComponentProvider>
               */}

          </>
        )}
        {role === "sub_admin" && (
          <>
            <SelectedComponentProvider>        
              <Grid container spacing={3}>
                <Grid size={{
                    md: 4,
                    xs: 12
                  }}>
                      <NeverRegisteredBack />
                </Grid>
                <Grid size={{
                    md: 4,
                    xs: 12
                  }}>
                      <NeverUsedBotPercentage />
                </Grid>
                <Grid size={{
                    md: 4,
                    xs: 12
                  }}>
                      <RegisteredBackAfter30Minutes />
                </Grid>
                <Grid size={12}>
                  <SelectedUserTable/>
                </Grid>
                <Grid size={12}>
                  <ActiveUsersTable/>
                </Grid>
                <Grid size={{
                    md: 12,
                    xs: 12
                  }}>
                      <NotAccessedByAdmin />
                </Grid>
                <Grid size={12}>
                  <UsersWaitingForAccessTable/>
                </Grid>
              </Grid>
            </SelectedComponentProvider>
          </>
        )}

        {role === "care_home" && (
          <>
            <Grid size={{ lg: 3, sm: 6, xs: 12 }}>
              <DailyVisitors />
            </Grid>
            <CarehomeSentimentProvider>
              <Grid size={{ lg: 3, sm: 6, xs: 12 }}>
                <TotalCareHomeCalmCalls/>
              </Grid>
              <Grid size={{ lg: 3, sm: 6, xs: 12 }}>
                <TotalCareHomePositiveCalls/>
              </Grid>
              <Grid size={{ lg: 3, sm: 6, xs: 12 }}>
                <TotalCareHomeNegativeCalls/>
              </Grid>
            </CarehomeSentimentProvider>
            
            <Grid size={{ lg: 12, sm: 12, xs: 12 }}>
              <UserList />
            </Grid>
          </>
        )}

        {role === "family_member" && (
          <>
            <Grid size={{ md: 6, xs: 12 }}>
              <SentimentAnalysisSectionPerday />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <OtherFamilyMembersLastSeenSection />
            </Grid>
            {/* <Grid size={{ md: 6, xs: 12 }}>
              <Cognitivesection />
            </Grid> */}
          </>
        )}

        {role === "patient" && (
          <>
            <Grid size={{ md: 12, xs: 12 }}>
              <Card
                sx={{ p: 3, textAlign: "start", mb: 2 }}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    Welcome,{" "}
                    {user_info?.first_name + " " + user_info?.last_name ||
                      "Patient"}
                    !
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ mt: 1, color: "primary.main" }}
                  >
                    {greetingMessage}
                  </Typography>
                </div>
                <div
                  className={`hello-gif-main ${theme.palette.mode === "dark" ? "hello-gif-main-dark" : ""}`}
                >
                  <DotLottieReact
                    src="https://lottie.host/8dd9d027-8a7a-44f0-87f4-937332617a64/jwdFaqIHrG.lottie"
                    loop
                    autoplay
                  />
                </div>
              </Card>
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <Familymembersection />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <SentimentAnalysisSection />
            </Grid>
          </>
        )}
      </Grid>
      {/* <VoiceProvider>
        <Controls />
      </VoiceProvider> */}
    </div>
  );
}
