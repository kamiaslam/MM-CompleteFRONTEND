import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import FlexBox from "@/components/flexbox/FlexBox";
import { H6, Paragraph } from "@/components/typography";
import { format } from "@/utils/currency";
import { getNeverRegisteredBackAfterFirstUsage } from "../../../../api/apiAnalysisRoutes";
import { useLoader } from "@/contexts/LoaderContext";
import { useSelectedComponent } from "@/contexts/demoFilteringComponentContext"; // Import the hook
export default function NeverRegisteredBack() {
  const [neverRegisteredBack, setNeverRegisteredBack] = useState(null);
  const [users, setUsers] = useState([]);
  const { showLoader, hideLoader } = useLoader();
  const { setUserList, selectedComponentId } = useSelectedComponent(); // Get selectedComponentId
  const { reloadTrigger } = useSelectedComponent();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getNeverRegisteredBackAfterFirstUsage(showLoader, hideLoader);
        if (response && response.data !== undefined) {
          setNeverRegisteredBack(response.data.percentage);
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error("Error fetching never registered back count:", error);
      }
    };

    fetchData();
  }, [reloadTrigger]);

  const handleCardClick = () => {
    setUserList(users, "NeverRegisteredBack"); // Pass component ID
  };

  return (
    <Card
      className="p-3"
      onClick={handleCardClick}
      style={{
        cursor: "pointer",
        border: selectedComponentId === "NeverRegisteredBack" ? "2px solid pink" : "",
      }}
    >
      <div>
        <FlexBox alignItems="center" gap={1}>
          {neverRegisteredBack === null ? <CircularProgress size={24} /> : <H6>{format(neverRegisteredBack)}%</H6>}
        </FlexBox>
        <Paragraph color="text.secondary">Never Registered Back After First Usage</Paragraph>
      </div>
    </Card>
  );
}
