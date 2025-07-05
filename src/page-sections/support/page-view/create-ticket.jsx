import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { useFormik } from "formik";
import * as Yup from "yup";
import DropZone from "@/components/dropzone";
import FlexBox from "@/components/flexbox/FlexBox";
import { H6, Paragraph } from "@/components/typography";
import { useState, useEffect } from "react";
import { uploadMedia } from "../../../api/axiosApis/post";
import Chip from "@mui/material/Chip";
import toast from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";
import AudioRecorder from "./audioRecorder";

import { fetchScheduledCallList } from "../../../api/axiosApis/get";

export default function CreateTicketPageView() {
  const validationSchema = Yup.object({
    description: Yup.string().required("Description is required"),
    tags: Yup.array()
      .min(1, "At least one tag is required")
      .typeError("Please add tags using comma or Enter."),
    media: Yup.array().min(1, "At least one media file is required"),
    scheduleId: Yup.string().required("Please select a scheduled call"),
  });

  const initialValues = {
    fileType: "image",
    description: "",
    media: [],
    tags: [],
    scheduleId: "", // New field for schedule ID
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    isSubmitting,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("description", values.description);
        formData.append("file_type", values.fileType);
        formData.append("schedule_id", values.scheduleId); // Append schedule id

        values?.media?.forEach((item) => {
          formData.append("files", item);
        });

        values.tags.forEach((item) => {
          formData.append("tags", item);
        });

        const response = await uploadMedia(formData);
        resetForm();
        setUploadedFiles([]);
        setTags([]);
        toast.success(response?.data?.message);
      } catch (error) {
        console.error("Error creating ticket", error);
      }
    },
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [tags, setTags] = useState(values.tags || []);
  const [scheduledCalls, setScheduledCalls] = useState([]);

  // Get family member ID from localStorage
  const getFamilyMemberId = () => {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    return authUser?.user_info?.id;
  };

  // Fetch scheduled calls when the component mounts
  useEffect(() => {
    const familyMemberId = getFamilyMemberId();
    if (familyMemberId) {
      fetchScheduledCallList(familyMemberId)
        .then((data) => {
          console.log("Scheduled Calls:", data);
          setScheduledCalls(data);
        })
        .catch((error) => {
          console.error("Error fetching scheduled calls:", error);
        });
    }
  }, []);

  const handleTagChange = (event) => {
    const value = event.target.value.trim();

    if (event.key === "Enter" || event.key === ",") {
      if (value && !tags.includes(value)) {
        setTags((prevTags) => {
          const updatedTags = [...prevTags, value];
          setFieldValue("tags", updatedTags);
          return updatedTags;
        });
      }
      event.preventDefault();
      event.target.value = "";
    }
  };

  const handleDeleteTag = (tag) => {
    setTags((prevTags) => {
      const updatedTags = prevTags.filter((t) => t !== tag);
      setFieldValue("tags", updatedTags);
      return updatedTags;
    });
  };

  const handleCancel = () => {
    resetForm();
    setUploadedFiles([]);
    setTags([]);
  };

  useEffect(() => {
    setFieldValue("tags", tags);
  }, [tags, setFieldValue]);

  const getAcceptedFileTypes = () => {
    switch (values?.fileType) {
      case "image":
        return "image/*";
      case "audio":
        return "audio/*";
      case "video":
        return "video/*";
      default:
        return "";
    }
  };

  const handleDrop = (acceptedFiles) => {
  const filteredFiles = acceptedFiles.filter((file) =>
    file.type.startsWith(values?.fileType)
  );

  const totalFiles = uploadedFiles.length + filteredFiles.length;

  if (values?.fileType === "image" && totalFiles > 2) {
    const allowedFiles = 2 - uploadedFiles.length;
    if (allowedFiles <= 0) {
      toast.error("You can only upload a maximum of 2 images.");
      return;
    }

    const limitedFiles = filteredFiles.slice(0, allowedFiles);

    setUploadedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...limitedFiles];
      setFieldValue("media", updatedFiles);
      return updatedFiles;
    });

    toast(`Only ${allowedFiles} more image${allowedFiles > 1 ? "s" : ""} allowed.`);
  } else {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...filteredFiles];
      setFieldValue("media", updatedFiles);
      return updatedFiles;
    });
  }
};


  const handleDelete = (fileIndex) => {
    const updatedFiles = uploadedFiles.filter(
      (_, index) => index !== fileIndex
    );
    setUploadedFiles(updatedFiles);
    setFieldValue("media", updatedFiles);
  };

  const handleDownload = (file) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box py={3}>
      <Card sx={{ p: 3, maxWidth: 900, margin: "auto" }}>
        <H6 fontSize={18} mb={3}>
          Media
        </H6>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* File Type Dropdown */}
            <Grid item xs={12}>
              <TextField
                select
                style={{ display: 'none' }}
                fullWidth
                name="fileType"
                value={values?.fileType}
                onChange={(e) => {
                  handleChange(e);
                  setUploadedFiles([]);
                  setFieldValue("media", []);
                }}
                slotProps={{
                  select: {
                    native: true,
                    IconComponent: KeyboardArrowDown,
                  },
                }}
              >
                <option value="image">Image</option>
                {/* <option value="audio">Audio</option> */}
                {/* <option value="video">Video</option> */}
              </TextField>
            </Grid>

            {/* New Scheduled Call Dropdown */}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                name="scheduleId"
                value={values.scheduleId}
                onChange={handleChange}
                label=""
                slotProps={{
                  select: {
                    native: true,
                    IconComponent: KeyboardArrowDown,
                  },
                }}
                error={Boolean(touched.scheduleId && errors.scheduleId)}
                helperText={touched.scheduleId && errors.scheduleId}
              >
                <option value="">Select a Scheduled Call</option>
                {scheduledCalls.map((call) => (
                  <option key={call.schedule_id} value={call.schedule_id}>
                    {call.title} - {new Date(call.call_time).toLocaleString()}
                  </option>
                ))}
              </TextField>
            </Grid>

            {/* Dropzone for file upload */}
            <Grid item xs={12} mt={2}>
              <DropZone onDrop={handleDrop} accept={getAcceptedFileTypes()} />
            </Grid>
            {touched.media && errors.media && (
              <span
                className="error"
                style={{
                  color: "#EF4770",
                  position: "relative",
                  top: "100%",
                  marginLeft: "38px",
                  left: 0,
                  fontSize: "12px",
                }}
              >
                {errors.media}
              </span>
            )}
            {values?.fileType === "audio" && (
              <Grid item xs={12}>
                <AudioRecorder
                  setMedia={(audioBlob) => {
                    const audioFile = new File(
                      [audioBlob],
                      "recorded-audio.wav",
                      {
                        type: "audio/wav",
                      }
                    );
                    setUploadedFiles((prevFiles) => {
                      const updatedFiles = [...prevFiles, audioFile];
                      setFieldValue("media", updatedFiles);
                      return updatedFiles;
                    });
                  }}
                />
              </Grid>
            )}

            {/* Tags input */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="tags"
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleTagChange}
                placeholder="Add tags (comma or Enter to create)"
                error={Boolean(touched.tags && errors.tags)}
                helperText={touched.tags && errors.tags}
              />
              <Grid item xs={12} mt={2}>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleDeleteTag(tag)}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>

            {/* Description field */}
            <Grid item xs={12}>
              <TextField
                multiline
                rows={6}
                fullWidth
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Description*"
                error={Boolean(touched.description && errors.description)}
                helperText={touched.description && errors.description}
              />
            </Grid>

            {/* Submit and Cancel buttons */}
            <Grid item xs={12}>
              <FlexBox alignItems="center" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Submit"
                  )}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancel}
                >
                  Clear
                </Button>
              </FlexBox>
            </Grid>

            {/* Display uploaded files with preview, download, and delete options */}
            <Grid item xs={12} mt={3}>
              <H6 fontSize={16} mb={1}>
                Uploaded Files
              </H6>
              {uploadedFiles.length > 0 ? (
                <div className="uploading-things-main">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="uploading-things-box">
                      {file.type.startsWith("image") && (
                        <Box>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                          />
                        </Box>
                      )}
                      {file.type.startsWith("audio") && (
                        <Box>
                          <audio controls>
                            <source
                              src={URL.createObjectURL(file)}
                              type={file.type}
                            />
                            Your browser does not support the audio element.
                          </audio>
                        </Box>
                      )}
                      {file.type.startsWith("video") && (
                        <Box>
                          <video width="200" height="auto" controls>
                            <source
                              src={URL.createObjectURL(file)}
                              type={file.type}
                            />
                            Your browser does not support the video element.
                          </video>
                        </Box>
                      )}
                      <div className="uploaded-things-description">
                        <div>
                          <Paragraph>Name: {file.name}</Paragraph>
                          <Paragraph>Type: {file.type}</Paragraph>
                          <Paragraph>
                            Size: {(file.size / 1024).toFixed(2)} KB
                          </Paragraph>
                        </div>
                        <div className="uploaded-things-delete-and-download-icon-main">
                          <div
                            className="delete-icon"
                            onClick={() => handleDelete(index)}
                          >
                            {/* Delete icon */}
                          </div>
                          <div
                            className="download-icon"
                            onClick={() => handleDownload(file)}
                          >
                            {/* Download icon */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Paragraph>No files uploaded yet.</Paragraph>
              )}
            </Grid>
          </Grid>
        </form>
      </Card>
    </Box>
  );
}
