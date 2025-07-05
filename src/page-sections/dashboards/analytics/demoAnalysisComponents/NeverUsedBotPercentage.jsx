import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import FlexBox from "@/components/flexbox/FlexBox";
import { H6, Paragraph } from "@/components/typography";
import { format } from "@/utils/currency";
import { getNeverUsedUsersPercentage } from "../../../../api/apiAnalysisRoutes";
import { useLoader } from "@/contexts/LoaderContext";
import { useSelectedComponent } from "@/contexts/demoFilteringComponentContext"; // Import the hook

export default function NeverUsedBotPercentage() {
  const [neverUsedPercentage, setNeverUsedPercentage] = useState(null);
  const [users, setUsers] = useState([]);
  const { showLoader, hideLoader } = useLoader();
  const { setUserList, selectedComponentId } = useSelectedComponent();
  const { reloadTrigger } = useSelectedComponent();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getNeverUsedUsersPercentage(showLoader, hideLoader);
        if (response && response.data !== undefined) {
          setNeverUsedPercentage(response.data.percentage);
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error("Error fetching never used users percentage:", error);
      }
    };

    fetchData();
  }, [reloadTrigger]);

  const handleCardClick = () => {
    setUserList(users, "NeverUsedBotPercentage");
  };

  return (
    <Card
      className="p-3"
      onClick={handleCardClick}
      style={{
        cursor: "pointer",
        border: selectedComponentId === "NeverUsedBotPercentage" ? "2px solid pink" : "",
      }}
    >
      <div>
        <FlexBox alignItems="center" gap={1}>
          {neverUsedPercentage === null ? <CircularProgress size={24} /> : <H6>{format(neverUsedPercentage)}%</H6>}
        </FlexBox>
        <Paragraph color="text.secondary">Percentage of Users Who Never Used the Bot</Paragraph>
      </div>
    </Card>
  );
}
