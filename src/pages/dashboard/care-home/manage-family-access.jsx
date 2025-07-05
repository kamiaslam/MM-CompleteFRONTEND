import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
} from "@mui/material";
import { H5, Paragraph } from "../../../components/typography";
// import FlexBox from '../../../components/flexbox';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const ManageFamilyAccess = () => {
  const [familyMembers, setFamilyMembers] = useState(() => {
    return [
      {
        id: 1,
        name: "Family Member 1",
        routeAccess: ["/dashboard", "/dashboard/schedule-call-list"],
      },
    ];
  });
  const [loading, setLoading] = useState(true);

  const availableRoutes = [
    {
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      label: "Schedule Call List",
      path: "/dashboard/schedule-call-list",
    },
    {
      label: "Call History",
      path: "/dashboard/call-history",
    },
    {
      label: "Photo Gallery",
      path: "/dashboard/photo-gallery",
    },
    {
      label: "Account",
      path: "/dashboard/account",
    },
  ];

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const fetchFamilyMembers = async () => {
    try {
      const response = await axios.get("/api/care-home/family-members");
      if (response.data && Array.isArray(response.data)) {
        setFamilyMembers(response.data);
      } else {
        setFamilyMembers([]);
        toast.error("Invalid data format received");
      }
    } catch (error) {
      console.error("Error fetching family members:", error);
      toast.error("Error fetching family members");
      setFamilyMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRouteAccessChange = async (familyMemberId, route, isChecked) => {
    try {
      await axios.post("/api/care-home/update-route-access", {
        familyMemberId,
        route,
        hasAccess: isChecked,
      });
      toast.success("Route access updated successfully");
    } catch (error) {
      toast.error("Error updating route access");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box pt={2} pb={4}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ padding: 3 }}>
            <H5 mb={2}>Manage Family Members Route Access</H5>
            <Paragraph mb={4}>
              Control which pages family members can access in their dashboard
            </Paragraph>
            {Array.isArray(familyMembers) && familyMembers.length > 0 ? (
              familyMembers.map((member) => (
                <Box key={member.id} mb={4}>
                  <H5 mb={2}>{member.name}</H5>
                  <Stack spacing={2}>
                    {availableRoutes.map((route) => (
                      <FormControlLabel
                        key={route.path}
                        control={
                          <Checkbox
                            defaultChecked={member.routeAccess?.includes(
                              route.path
                            )}
                            onChange={(e) =>
                              handleRouteAccessChange(
                                member.id,
                                route.path,
                                e.target.checked
                              )
                            }
                          />
                        }
                        label={route.label}
                      />
                    ))}
                  </Stack>
                </Box>
              ))
            ) : (
              <Box>
                <Paragraph>No family members found</Paragraph>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManageFamilyAccess;
