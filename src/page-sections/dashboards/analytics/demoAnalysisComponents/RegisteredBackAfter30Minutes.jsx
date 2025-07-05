import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import FlexBox from "@/components/flexbox/FlexBox";
import { H6, Paragraph } from "@/components/typography";
import { format } from "@/utils/currency";
import { getRegisteredBackAfter30MinutesPercentage } from "../../../../api/apiAnalysisRoutes";
import { useLoader } from "@/contexts/LoaderContext";
import { useSelectedComponent } from "@/contexts/demoFilteringComponentContext"; // Import the hook

export default function RegisteredBackAfter30Minutes() {
  const [registeredBackPercentage, setRegisteredBackPercentage] = useState(null);
  const [users, setUsers] = useState([]);
  const { showLoader, hideLoader } = useLoader();
  const { setUserList, selectedComponentId } = useSelectedComponent();
  const { reloadTrigger } = useSelectedComponent();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRegisteredBackAfter30MinutesPercentage(showLoader, hideLoader);
        if (response && response.data !== undefined) {
          setRegisteredBackPercentage(response.data.percentage);
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error("Error fetching registered back percentage:", error);
      }
    };

    fetchData();
  }, [reloadTrigger]);

  const handleCardClick = () => {
    setUserList(users, "RegisteredBackAfter30Minutes");
  };

  return (
    <Card
      className="p-3"
      onClick={handleCardClick}
      style={{
        cursor: "pointer",
        border: selectedComponentId === "RegisteredBackAfter30Minutes" ? "2px solid pink" : "",
      }}
    >
      <div>
        <FlexBox alignItems="center" gap={1}>
          {registeredBackPercentage === null ? <CircularProgress size={24} /> : <H6>{format(registeredBackPercentage)}%</H6>}
        </FlexBox>
        <Paragraph color="text.secondary">Current Active User Return Percentage</Paragraph>
      </div>
    </Card>
  );
}
