import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import FlexBox from "@/components/flexbox/FlexBox";
import { H6, Paragraph } from "@/components/typography";
import { format } from "@/utils/currency";
import { getNotAccessedByAdminUsersPercentage } from "../../../../api/apiAnalysisRoutes";
import { useLoader } from "@/contexts/LoaderContext";
import { useSelectedComponent } from "@/contexts/demoFilteringComponentContext";

export default function NotAccessedByAdmin() {
  const [notAccessedPercentage, setNotAccessedPercentage] = useState(null);
  const { showLoader, hideLoader } = useLoader();
  const { reloadTrigger } = useSelectedComponent();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getNotAccessedByAdminUsersPercentage(showLoader, hideLoader);
        if (response && response.data !== undefined) {
          setNotAccessedPercentage(response.data);
        }
      } catch (error) {
        console.error("Error fetching not accessed by admin percentage:", error);
      }
    };

    fetchData();
  }, [reloadTrigger]);

  return (
    <Card className="p-3">
      <div>
        <FlexBox alignItems="center" gap={1}>
          {notAccessedPercentage === null ? (
            <CircularProgress size={24} />
          ) : (
            <H6>{format(notAccessedPercentage)}%</H6>
          )}
        </FlexBox>
        <Paragraph color="text.secondary">
        Percentage of users awaiting access
        </Paragraph>
      </div>
    </Card>
  );
}
