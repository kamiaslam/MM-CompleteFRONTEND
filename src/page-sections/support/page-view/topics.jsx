import React, { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { UpdateTopics } from "@/api/axiosApis/Put";
import toast from "react-hot-toast";
import { H6 } from "@/components/typography";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Chip,
  CircularProgress,
  Box,
} from "@mui/material";
import { GetTopics } from "../../../api/axiosApis/get";

export default function TopicsPageView() {
  const [topics, setTopics] = useState([]); // Make sure topics is initialized as an array
  const [newTopic, setNewTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unsavedTopics, setUnsavedTopics] = useState([]);

  const fetchTopics = async () => {
    setIsLoading(true);
    try {
      const response = await GetTopics();
      if (response.success) {
        // Ensure topics is always an array
        setTopics(
          Array.isArray(response.data?.topics) ? response.data.topics : []
        );
      } else {
        setTopics([]); // Set empty array on failure
      }
    } catch (error) {
      setTopics([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleAddTopic = () => {
    if (!newTopic.trim()) {
      toast.error("Please enter a topic name");
      return;
    }

    setUnsavedTopics([...unsavedTopics, newTopic]);
    setNewTopic("");
  };

  const handleDelete = async (topicToDelete, isUnsaved = false) => {
    if (isUnsaved) {
      setUnsavedTopics(
        unsavedTopics.filter((topic) => topic !== topicToDelete)
      );
    } else {
      setIsLoading(true);
      try {
        const updatedTopics = topics.filter((topic) => topic !== topicToDelete);
        const response = await UpdateTopics({
          topic: updatedTopics,
        });

        if (response.data.success) {
          setTopics(updatedTopics);
          toast.success("Topic deleted successfully");
        } else {
          toast.error("Failed to delete topic");
          // Revert the deletion if the API call fails
          await fetchTopics();
        }
      } catch (error) {
        console.error("Error deleting topic:", error);
        toast.error("Failed to delete topic");
        // Revert the deletion if the API call fails
        await fetchTopics();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddAllTopics = async () => {
    if (unsavedTopics.length === 0) {
      toast.error("No new topics to save");
      return;
    }

    setIsLoading(true);
    try {
      // Ensure topics is an array before merging
      const allTopics = [
        ...(Array.isArray(topics) ? topics : []),
        ...unsavedTopics,
      ];

      const response = await UpdateTopics({
        topic: allTopics,
      });

      if (response.data.success) {
        toast.success("All topics saved successfully");
        setUnsavedTopics([]); // Clear the unsaved topics list
        fetchTopics();
      } else {
        console.error("API response error:", response);
        toast.error("Failed to save topics");
      }
    } catch (error) {
      console.error("Error saving topics:", error);
      toast.error("Failed to save topics");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddTopic();
    }
  };

  return (
    <Box py={3}>
      <Card
        sx={{
          p: 3,
          maxWidth: 900,
          margin: "auto",
        }}
      >
        {/* Header Section */}
        <H6 fontSize={18} mb={3}>
          Topics
        </H6>

        {/* Add Topic Section */}
        <div style={{ marginBottom: 12 }}>
          <TextField
            placeholder="Enter new topic"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyPress={handleKeyPress}
            fullWidth
            disabled={isLoading}
            variant="outlined"
            size="medium"
            InputProps={{
              className: "bg-white",
              endAdornment: (
                <Button
                  variant="contained"
                  onClick={handleAddTopic}
                  disabled={isLoading}
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                  startIcon={<Plus className="h-4 w-4" />}
                >
                  Add Topic
                </Button>
              ),
            }}
          />
        </div>

        {/* Unsaved Topics Section */}
        {unsavedTopics.length > 0 && (
          <div
            style={{
              marginBottom: 12,
              padding: 12,
              // backgroundColor: "",
              borderRadius: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <H6 fontSize={18} mb={1}>
                Unsaved Topics
              </H6>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                alignItems: "center",
              }}
            >
              {unsavedTopics.map((topic, index) => (
                <Chip
                  key={`unsaved-${index}`}
                  label={topic}
                  onDelete={() => handleDelete(topic, true)}
                  color="primary"
                  variant="outlined"
                  className="text-base py-1"
                />
              ))}
              <Button
                variant="contained"
                onClick={handleAddAllTopics}
                disabled={isLoading}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Save All Topics"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Saved Topics Section */}
        {!isLoading && Array.isArray(topics) && topics.length > 0 && (
          <div
            style={{ padding: 12, borderRadius: 8 }}
          >
            <H6 fontSize={18} mb={1}>
              Saved Topics ({topics?.length})
            </H6>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                alignItems: "center",
              }}
            >
              {topics.map((topic, index) => (
                <Chip
                  key={`saved-${index}`}
                  label={topic}
                  onDelete={() => handleDelete(topic)}
                  color="default"
                  className="text-base py-1 bg-white"
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && topics.length === 0 && unsavedTopics.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 12,
              backgroundColor: "primary",
              borderRadius: 8,
            }}
          >
            <p style={{ fontSize: 18 }}>
              No topics available. Add your first topic above.
            </p>
          </div>
        )}
      </Card>
    </Box>
  );
}
