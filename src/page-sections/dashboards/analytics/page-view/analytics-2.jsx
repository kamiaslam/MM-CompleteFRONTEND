

import Grid from '@mui/material/Grid2';
import NeverRegisteredBack from '../demoAnalysisComponents/NeverRegisteredBack';
import NeverUsedBotPercentage from '../demoAnalysisComponents/NeverUsedBotPercentage';
import NotAccessedByAdmin from '../demoAnalysisComponents/NotAccessedByAdmin';
import RegisteredBackAfter30Minutes from '../demoAnalysisComponents/RegisteredBackAfter30Minutes';
import ActiveUsersTable from '../user-table/ActiveUserdamoTable';
import UsersWaitingForAccessTable from '../user-table/UsersWaitingForDemoAccessTable';
import { SelectedComponentProvider } from "@/contexts/demoFilteringComponentContext";
import SelectedUserTable from "../user-table/SelectedUserTable";
export default function Analytics2PageView() {
  return <div className="pt-2 pb-4">
      <Grid container spacing={3}>
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

      </Grid>
    </div>;
}