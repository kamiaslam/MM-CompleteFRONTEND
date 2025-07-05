import { AsyncPaginate } from "react-select-async-paginate";
import { useCallback, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
// MUI
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
// MUI ICON COMPONENT
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

// CUSTOM COMPONENTS
import { H6 } from "@/components/typography";

import FlexBox from "@/components/flexbox/FlexBox";

import { handleSpaceKeyPress } from "@/utils";
import { capitalizeValue } from "../../../helper/constant";
import { fetchUserData } from "../../../api/axiosApis/get";
import moment from "moment";
import { createScheduleCall } from "../../../api/axiosApis/post";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../../../contexts/LoaderContext";
import { useTheme } from "@mui/material/styles";

export default function CreateProductPageView() {
  const { showLoader, hideLoader } = useLoader();
  const theme = useTheme();
  const navigate = useNavigate();

  // Retrieve auth user data from local storage
  const storedAuthUser = localStorage.getItem("authUser");
  const authUser = storedAuthUser ? JSON.parse(storedAuthUser) : null;
  const isFamilyMember = authUser?.role === "family_member";

  const asyncPaginateStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      borderColor: theme.palette.divider,
      boxShadow: "none",
      "&:hover": {
        borderColor: theme.palette.primary.main,
      },
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: "0.875rem",
      color: theme.palette.text.primary,
    }),
    placeholder: (base) => ({
      ...base,
      fontSize: "0.875rem",
      color: theme.palette.text.secondary,
    }),
    menu: (base) => ({
      ...base,
      top: "100%",
      position: "absolute",
      width: "100%",
      zIndex: "99999 !important",
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[4],
      marginBottom: "8px",
      boxSizing: "border-box",
    }),
    option: (base, state) => ({
      ...base,
      fontSize: "0.875rem",
      color: theme.palette.text.primary,
      backgroundColor: state.isSelected
        ? theme.palette.action.selected
        : theme.palette.background.paper,
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
      },
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: theme.palette.text.secondary,
      "&:hover": {
        color: theme.palette.text.primary,
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        color: theme.palette.text.primary,
      },
    }),
  };

  const loadOptions = useCallback(
    async (searchQuery, loadedOptions, { page }) => {
      try {
        const response = await fetchUserData(page, 100, searchQuery);

        const data =
          response?.data?.map((item) => ({
            value: item?.id,
            label: `${item.first_name} ${item.last_name}`,
          })) || [];

        const sortedOptions = data.sort((a, b) =>
          a.label.localeCompare(b.label)
        );
        return {
          options: sortedOptions,
          hasMore:
            response?.payload?.count > 100 &&
            loadedOptions.length < response?.payload?.count,
          additional: {
            page: page + 1,
          },
        };
      } catch (error) {
        return {
          options: [],
          hasMore: false,
          additional: {
            page: 1,
          },
        };
      }
    },
    []
  );

  const validationSchema = Yup.object({
    call_time: Yup.string()
      .required("Appointment date and time is required!")
      .test(
        "is-future-date",
        "Appointment date and time must be in the future!",
        (value) => value && moment(value).isAfter(moment())
      ),
    description: Yup.string().required("Description is required!"),
    // For family members, the patient selection is pre-set so the object is already provided.
    patient_id_or_family_memeber_id: Yup.object()
      .shape({
        value: Yup.string().required("Please select a patient!"),
        label: Yup.string().required(),
      })
      .nullable()
      .required("Please select a patient!"),
    title: Yup.string().required("Title is required!"),
  });

  const initialValues = {
    description: "",
    call_duration: 300,
    call_time: "",
    // if family member, preset the value using the id and name from local storage,
    // otherwise, let it be null for selection.
    patient_id_or_family_memeber_id: isFamilyMember
      ? { value: authUser.user_info.id, label: authUser.user_info.name }
      : null,
    title: "",
    call_mode: "phone",
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const body = {
          ...values,
          on_phone: values.call_mode === "phone",
          on_web:   values.call_mode === "web",
        };
      body.patient_id_or_family_memeber_id =
      body.patient_id_or_family_memeber_id.value;
      body.call_time = moment(body.call_time).utc();
      body.call_duration = Number(body.call_duration);

      try {
        showLoader();
        await createScheduleCall(body).then((res) => {
          if (res?.data?.success) {
            resetForm();
            navigate("/dashboard/schedule-call-list");
          }
        });
      } catch (error) {
        // error handling if needed
      } finally {
        hideLoader();
      }
    },
  });

  const handleClear = () => {
    resetForm();
    setFieldValue(
      "call_time",
      moment().add(2, "minutes").format("YYYY-MM-DDTHH:mm")
    );
    setFieldValue("call_duration", 300);
  };

  useEffect(() => {
    setFieldValue(
      "call_time",
      moment().add(2, "minutes").format("YYYY-MM-DDTHH:mm")
    );
  }, [setFieldValue]);

  return (
    <div className="pt-2 pb-4">
      <form onSubmit={handleSubmit}>
        <Card className="p-3">
          <Grid container spacing={3} alignItems="start">
            <Grid size={12}>
              <FlexBox gap={0.5} alignItems="center">
                <H6 fontSize={16}>Schedule call</H6>
              </FlexBox>
            </Grid>

            <Grid
              container
              spacing={2}
              size={{
                md: 12,
                xs: 12,
              }}
            >
              <Grid
                size={{
                  sm: 6,
                  xs: 12,
                }}
              >
                <TextField
                  onKeyDown={(e) => {
                    // your utility function for handling space key press
                    handleSpaceKeyPress(e);
                  }}
                  fullWidth
                  name="title"
                  label="Title"
                  onBlur={handleBlur}
                  value={values.title}
                  onChange={(e) => {
                    const sendValue = e.target.value?.trimStart();
                    setFieldValue("title", capitalizeValue(sendValue));
                  }}
                  helperText={touched.title && errors.title}
                  error={Boolean(touched.title && errors.title)}
                />
              </Grid>

              {/* Conditionally render the patient select only if the user is NOT a family member */}
              {!isFamilyMember ? (
                <Grid
                  size={{
                    sm: 6,
                    xs: 12,
                  }}
                >
                  <AsyncPaginate
                    id="related-category"
                    isMulti={false}
                    placeholder="Select patient name"
                    loadOptions={loadOptions}
                    additional={{
                      page: 1,
                    }}
                    value={values.patient_id_or_family_memeber_id}
                    onChange={(selectedOption) => {
                      setFieldValue("patient_id_or_family_memeber_id", selectedOption);
                    }}
                    styles={asyncPaginateStyles}
                  />

                  {touched.patient_id_or_family_memeber_id &&
                    errors.patient_id_or_family_memeber_id && (
                      <span
                        className="error"
                        style={{
                          color: "#EF4770",
                          position: "relative",
                          marginLeft: "12px",
                          left: 0,
                          fontSize: "12px",
                        }}
                      >
                        {errors.patient_id_or_family_memeber_id}
                      </span>
                    )}
                </Grid>
              ) : ( ""
                // Optionally, show a read-only field or a simple text message for family members
                // <Grid
                //   size={{
                //     sm: 6,
                //     xs: 12,
                //   }}
                // >
                //   <TextField
                //     fullWidth
                //     label="Patient"
                //     value={values.patient_id_or_family_memeber_id.label}
                //     InputProps={{
                //       readOnly: true,
                //     }}
                //   />
                // </Grid>
              )}

              <Grid
                size={{
                  sm: 6,
                  xs: 12,
                }}
              >
                <TextField
                  fullWidth
                  name="call_time"
                  type="datetime-local"
                  label="Date and Time"
                  onClick={(e) => {
                    e.target.showPicker();
                  }}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  sx={{
                    "& input": {
                      cursor: "pointer",
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={values.call_time}
                  onChange={handleChange}
                  helperText={touched.call_time && errors.call_time}
                  error={Boolean(touched.call_time && errors.call_time)}
                  inputProps={{
                    min: moment().add(1, "minutes").format("YYYY-MM-DDTHH:mm"),
                  }}
                />
              </Grid>

              <Grid
                size={{
                  sm: 6,
                  xs: 12,
                }}
              >
                <TextField
                  onChange={handleChange}
                  name="call_duration"
                  value={values.call_duration}
                  select
                  fullWidth
                  label="Call Duration"
                  slotProps={{
                    select: {
                      native: true,
                      IconComponent: KeyboardArrowDown,
                    },
                  }}
                >
                  <option value={300}>5 Minutes</option>
                  <option value={600}>10 Minutes</option>
                  <option value={900}>15 Minutes</option>
                  <option value={1200}>20 Minutes</option>
                </TextField>
              </Grid>
              <Grid
                size={{
                  sm: 6,
                  xs: 12,
                }}
              >
              <TextField
                select
                fullWidth
                label="Call Receive Mode"
                name="call_mode"
                value={values.call_mode}
                onChange={(e) => setFieldValue("call_mode", e.target.value)}
                SelectProps={{
                  native: true,
                  IconComponent: KeyboardArrowDown,
                }}
              >
                <option value="phone">Phone Call</option>
                <option value="web">Web Call</option>
              </TextField>
              </Grid>


              <Grid size={12}>
                <TextField
                  onBlur={handleBlur}
                  value={values.description}
                  onChange={handleChange}
                  helperText={touched.description && errors.description}
                  error={Boolean(touched.description && errors.description)}
                  onKeyDown={(e) => handleSpaceKeyPress(e)}
                  name="description"
                  fullWidth
                  label="Description"
                  multiline
                  rows={9}
                />
              </Grid>
            </Grid>
          </Grid>
        </Card>

        <FlexBox
          flexWrap="wrap"
          gap={2}
          sx={{
            my: 3,
          }}
        >
          <Button type="submit" variant="contained">
            Save
          </Button>

          <Button onClick={handleClear} variant="outlined" color="secondary">
            Clear
          </Button>
        </FlexBox>
      </form>
    </div>
  );
}
