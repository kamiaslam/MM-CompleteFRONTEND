import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import styled from "@mui/material/styles/styled";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import * as Yup from "yup";
import { useFormik } from "formik";
// import { EMAIL_REGEX } from "@helper/constant";
import { handleSpaceKeyPress } from "@/utils";
import { Paragraph, Small } from "@/components/typography";
import { TableDataNotFound } from "@/components/table";
import { isDark } from "@/utils/constants";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Divider from "@mui/material/Divider";
import FlexBox from "@/components/flexbox/FlexBox";

import AddFamilyMember from "../../users/page-view/add-family-member";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from "@mui/material";
import UserTableHead from "../../users/UserTableHead";
import useMuiTable, { getComparator, stableSort } from "@/hooks/useMuiTable"; // CUSTOM DUMMY DATA
import Scrollbar from "@/components/scrollbar";
import { USER_LIST } from "@/__fakeData__/users";
import UserTableRow from "../../users/UserTableRow";
import {
  capitalizeValue,
  DELETE_FAMILY,
  EMAIL_REGEX,
  FAMILY_HEAD_LIST,
} from "../../../helper/constant";
import moment from "moment";
import toast from "react-hot-toast";
import { createUser } from "../../../api/axiosApis/post";
import { useNavigate, useSearchParams } from "react-router-dom";
import { get, isSuccessResp } from "../../../api/base";
import { deleteFamilyMember } from "../../../api/axiosApis/delete";
import { UpdateUser } from "../../../api/axiosApis/Put";
import { useLoader } from "../../../contexts/LoaderContext";
import { LoadingButton } from "@mui/lab";
import HeadingArea from "../../users/HeadingArea";

export default function AddSubAdminPageView() {
  const [users, setUsers] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  //   const getUserData = async () => {
  //     try {
  //       const resp = await get(`patients/get-patient/${id}`);
  //       if (isSuccessResp(resp.status)) {
  //         updateFormData(resp?.data?.data);
  //         setUsers(resp?.data?.data?.family_members);
  //       }
  //     } catch (error) {}
  //   };

  //   useEffect(() => {
  //     if (id) {
  //       getUserData();
  //     }
  //   }, [id]);

  const initialValues = {
    firstName: "",
    lastName: "",
    birthdate: "",
    // fullName: "",
    subAdminEmail: "",
    // hume_voice: "ITO",
    gender: "Male",
    // description: "",
    // relation: "",
  };
  const {
    page,
    order,
    orderBy,
    selected,
    isSelected,
    rowsPerPage,
    handleSelectRow,
    handleChangePage,
    handleRequestSort,
    handleSelectAllRows,
    handleChangeRowsPerPage,
  } = useMuiTable({
    defaultOrderBy: "name",
  });

//   const [deleteModal, setDeleteModal] = useState(false);
//   const [deleteUserID, setDeleteUserID] = useState("");
  const { showLoader, hideLoader } = useLoader();
  //   const handleDelete = async () => {
  //     if (id) {
  //       await deleteFamilyMember(deleteUserID, showLoader, hideLoader).then(
  //         (res) => {
  //           if (res?.data?.success) {
  //             setUsers((state) =>
  //               state.filter((item) => item.id !== deleteUserID)
  //             );
  //             setDeleteUserID("");
  //             setDeleteModal(!deleteModal);
  //           }
  //         }
  //       );
  //     } else {
  //       toast.success(DELETE_FAMILY);
  //       setUsers((state) => state.filter((item) => item.id !== deleteUserID));
  //       setDeleteUserID("");
  //       setDeleteModal(!deleteModal);
  //     }
  //   };
  //   const handleDeleteUser = (familyId) => {
  //     setDeleteModal(!deleteModal);
  //     if (familyId) {
  //       setDeleteUserID(familyId);
  //     }
  //   };

//   const [openModal, setOpenModal] = useState(false);
//   const [userId, setUserId] = useState("");

  //   const handleClose = () => setOpenModal(!openModal);

  //   const handleOpenModal = () => {
  //     setOpenModal(!openModal);
  //     setIsEdit(false);
  //   };

  //   const getUserIdForUpdate = (userid) => {
  //     setUserId(userid);
  //     setOpenModal(!openModal);
  //   };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is Required!"),
    lastName: Yup.string().required("Last Name is Required!"),
    // patientEmail: Yup.string().email().required("Email is Required!"),
    subAdminEmail: Yup.string()
      .required("Email is required!")
      .test("is-valid-email", "Invalid email format", (value) =>
        EMAIL_REGEX.test(value)
      ),
    // description: Yup.string().required("Description is Required!"),
    birthdate: Yup.date().required("Date of Birth is Required!"),
  });
  const navigate = useNavigate();

  const {
    values,
    setFieldValue,
    errors,
    handleChange,
    handleSubmit,
    touched,
    resetForm,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (users.length > 0) {
        if (id) {
          try {
            await UpdateUser(
              {
                first_name: values?.firstName?.trim(),
                last_name: values?.lastName?.trim(),
                hume_voice: values?.hume_voice?.trim(),
                email: values?.patientEmail?.trim(),
                family_members: users.map(({ id, ...rest }) => rest),
                gender: values.gender,
                medical_history: values?.description?.trim(),
                birthdate: moment(new Date(values?.birthdate))?.format(
                  "YYYY-MM-DD"
                ),
              },
              id,
              showLoader,
              hideLoader
            ).then((res) => {
              if (res?.data?.success) {
                resetForm();
                navigate("/dashboard/patient-list");
              }
            });
          } catch (error) {}
        } else {
          try {
            await createUser(
              {
                first_name: values?.firstName?.trim(),
                last_name: values?.lastName?.trim(),
                hume_voice: validationSchema?.hume_voice?.trim(),
                email: values?.patientEmail?.trim(),
                family_members: users.map(({ id, ...rest }) => rest),
                gender: values.gender,
                medical_history: values?.description?.trim(),
                birthdate: moment(new Date(values?.birthdate))?.format(
                  "YYYY-MM-DD"
                ),
              },
              showLoader,
              hideLoader
            ).then((res) => {
              if (res?.data?.success) {
                resetForm();
                navigate("/dashboard/patient-list");
              }
            });
          } catch (error) {}
        }
      } else {
        toast.error("At least one family member must be included.");
      }
    },
  });

  const handleClear = () => {
    setUsers([]);
    resetForm();
  };

  const updateFormData = (value) => {
    setFieldValue("firstName", value?.first_name ? value?.first_name : "");
    setFieldValue("birthdate", value?.birthdate ? value?.birthdate : "");
    setFieldValue("lastName", value?.last_name ? value?.last_name : "");
    setFieldValue("patientEmail", value?.email ? value?.email : "");
    // setFieldValue("hume_voice", value?.hume_voice ? value?.hume_voice : "");
    setFieldValue("gender", value?.gender ? value?.gender : "");
    // setFieldValue(
    //   "description",
    //   value?.medical_history ? value?.medical_history : ""
    // );
  };
//   const filteredUsers = stableSort(users, getComparator(order, orderBy));

  return (
    <>
      <div className="pt-2 pb-4">
        <form onSubmit={() => {}}>
          <Grid container spacing={3}>
            {/* <Grid size={{ md: 4, xs: 12 }}>
            <StyledCard style={{ height: "100%", justifyContent: "center" }}>
              <ButtonWrapper>
                <UploadButton>
                  <label htmlFor="upload-btn">
                    <input
                      accept="image/*"
                      id="upload-btn"
                      type="file"
                      style={{ display: "none" }}
                    />
                    <IconButton component="span">
                      <PhotoCamera sx={{ fontSize: 26, color: "grey.400" }} />
                    </IconButton>
                  </label>
                </UploadButton>
              </ButtonWrapper>

              <Paragraph
                marginTop={2}
                maxWidth={200}
                display="block"
                textAlign="center"
                color="text.secondary"
              >
                Allowed *.jpeg, *.jpg, *.png, *.gif max size of 3.1 MB
              </Paragraph>
            </StyledCard>
          </Grid> */}

            <Grid size={{ md: 12, xs: 12 }}>
              <Card className="p-3">
                <Box pb={3}>
                  <HeadingArea
                    backButton={id ? true : false}
                    userIcon
                    buttonNotShow
                    differentName={`${id ? `Edit Sub Admin` : `Add Sub Admin`}`}
                  />
                </Box>

                <Grid
                  size={12}
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ pb: 2 }}
                >
                  <span>General Information</span>
                </Grid>
                <Grid container spacing={3}>
                  <Grid size={{ sm: 6, xs: 12 }}>
                    <TextField
                      onKeyDown={handleSpaceKeyPress}
                      fullWidth
                      name="firstName"
                      label="First Name"
                      onChange={(e) => {
                        const sendValue = e.target.value?.trimStart();
                        setFieldValue("firstName", capitalizeValue(sendValue));
                      }}
                      value={values.firstName}
                      helperText={touched.firstName && errors.firstName}
                      error={Boolean(touched.firstName && errors.firstName)}
                    />
                  </Grid>

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <TextField
                      fullWidth
                      onKeyDown={handleSpaceKeyPress}
                      name="lastName"
                      label="Last Name"
                      value={values.lastName}
                      onChange={(e) => {
                        const sendValue = e.target.value?.trimStart();
                        setFieldValue("lastName", capitalizeValue(sendValue));
                      }}
                      helperText={touched.lastName && errors.lastName}
                      error={Boolean(touched.lastName && errors.lastName)}
                    />
                  </Grid>

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <TextField
                      fullWidth
                      onClick={(e) => {
                        e.target.showPicker();
                      }}
                      name="birthdate"
                      sx={{
                        "& input": {
                          cursor: "pointer",
                          // Prevent text selection and keyboard input
                          userSelect: "none",
                          WebkitUserSelect: "none",
                          MozUserSelect: "none",
                          msUserSelect: "none",
                        },
                        "&::-webkit-clear-button, &::-webkit-calendar-picker-indicator":
                          {
                            display: "none", // Hide the calendar and clear button in WebKit browsers
                          },
                        "&::-moz-clear-button": {
                          display: "none", // Hide clear button for Firefox
                        },
                      }}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                          // Prevent paste
                          onPaste: (e) => e.preventDefault(),
                          // Prevent keyboard input
                          onKeyDown: (e) => e.preventDefault(),
                        },
                      }}
                      // InputLabelProps={{
                      //   shrink: true, // Keeps the label above the input
                      // }}
                      label="Date of Birth"
                      type="date"
                      value={
                        values.birthdate
                          ? moment(values.birthdate, "YYYY/MM/DD").format(
                              "YYYY-MM-DD"
                            )
                          : "" // Ensure the value is empty if birthdate is undefined
                      }
                      onChange={(e) => {
                        const selectedDate = e.target.value;
                        if (!selectedDate) {
                          setFieldValue("birthdate", "");
                          return;
                        }

                        // Validate if the date is within the allowed range
                        const minDate = moment()
                          .subtract(150, "years")
                          .format("YYYY-MM-DD");
                        const maxDate = moment()
                          .subtract(40, "years")
                          .format("YYYY-MM-DD");

                        if (
                          selectedDate >= minDate &&
                          selectedDate <= maxDate
                        ) {
                          // Save the formatted date back to the field
                          setFieldValue(
                            "birthdate",
                            moment(selectedDate).format("YYYY/MM/DD")
                          );
                        } else {
                          alert(
                            "Please select a valid date of birth within the allowed range."
                          );
                        }
                      }}
                      helperText={touched.birthdate && errors.birthdate}
                      error={Boolean(touched.birthdate && errors.birthdate)}
                      inputProps={{
                        min: moment()
                          .subtract(150, "years")
                          .format("YYYY-MM-DD"),
                        max: moment()
                          .subtract(40, "years")
                          .format("YYYY-MM-DD"),
                      }}
                    />
                  </Grid>

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <TextField
                      fullWidth
                      onKeyDown={handleSpaceKeyPress}
                      name="subAdminEmail"
                      label="Email Address "
                      disabled={Boolean(id)}
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          // Use theme colors instead of hardcoded values
                          color: (theme) => theme.palette.text.primary,
                          WebkitTextFillColor: (theme) =>
                            theme.palette.text.secondary,
                          cursor: "not-allowed",
                        },
                        "& .MuiInputLabel-root.Mui-disabled": {
                          color: (theme) => theme.palette.text.secondary,
                        },
                        "& .MuiOutlinedInput-root.Mui-disabled": {
                          // Use theme colors for the outline
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: (theme) => theme.palette.divider,
                          },
                        },
                      }}
                      onChange={(e) => {
                        const lowercaseEmail = e.target.value
                          .trim()
                          .toLowerCase();
                        setFieldValue("patientEmail", lowercaseEmail);
                      }}
                      value={values.patientEmail}
                      helperText={touched.patientEmail && errors.patientEmail}
                      error={Boolean(
                        touched.patientEmail && errors.patientEmail
                      )}
                    />
                  </Grid>

                  {/* <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                    }}
                  >
                    <TextField
                      select
                      fullWidth
                      name="country"
                      variant="outlined"
                      slotProps={{
                        select: {
                          native: true,
                          IconComponent: KeyboardArrowDown,
                        },
                      }}
                    >
                      <option value="new-patient">New patient</option>
                      <option value="existing-resident-patient">
                        Existing resident patient
                      </option>
                      <option value="local-council-new-patient">
                        Local Council new patient
                      </option>
                    </TextField>
                  </Grid> */}

                  {/* <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                    }}
                  >
                    <TextField
                      name="hume_voice"
                      label="Voice"
                      value={values.hume_voice}
                      onChange={handleChange}
                      helperText={touched.hume_voice && errors.hume_voice}
                      error={Boolean(touched.hume_voice && errors.hume_voice)}
                      select
                      fullWidth
                      variant="outlined"
                      slotProps={{
                        select: {
                          native: true,
                          IconComponent: KeyboardArrowDown,
                        },
                      }}
                    >
                      <option value="ITO">Ito</option>
                      <option value="KORA">Kora</option>
                      <option value="DACHER">Dacher</option>
                      <option value="AURA">Aura</option>
                      <option value="FINN">Finn</option>
                      <option value="WHIMSY">Whimsy</option>
                      <option value="STELLA">Stella</option>
                      <option value="SUNNY">Sunny</option>
                    </TextField>
                  </Grid> */}

                  <Grid
                    size={{
                      sm: 6,
                      xs: 12,
                    }}
                  >
                    <RadioGroup
                      row
                      value={values.gender}
                      helperText={touched.gender && errors.gender}
                      error={Boolean(touched.gender && errors.gender)}
                      defaultValue="Male"
                      name="gender"
                      onChange={handleChange}
                      sx={{
                        justifyContent: "start",
                      }}
                    >
                      <FormControlLabel
                        value="Male"
                        control={<Radio />}
                        label="Male"
                      />
                      <FormControlLabel
                        value="Female"
                        control={<Radio />}
                        label="Female"
                      />
                      <FormControlLabel
                        value="Other"
                        control={<Radio />}
                        label="Other"
                      />
                    </RadioGroup>
                  </Grid>
                  {/* <Grid size={12}>
                    <TextField
                      fullWidth
                      onKeyDown={handleSpaceKeyPress}
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      helperText={touched.description && errors.description}
                      error={Boolean(touched.description && errors.description)}
                      multiline
                      rows={10}
                      label="Write description here "
                      sx={{
                        "& .MuiOutlinedInput-root textarea": {
                          padding: 0,
                        },
                      }}
                    />
                  </Grid> */}
                </Grid>
              </Card>
            </Grid>
            {/* <Grid size={{ md: 12, xs: 12 }}>
              <Card className="p-3">
                <Grid
                  size={12}
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ pb: 2 }}
                >
                  <span>Family Information</span>
                  <Button variant="contained" onClick={handleOpenModal}>
                    Add Family Member
                  </Button>
                </Grid>
                <Divider />
                <AddFamilyMember
                  open={openModal}
                  onClose={handleClose}
                  users={users}
                  userId={userId}
                  setUsers={setUsers}
                  setUserId={setUserId}
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                />

                <TableContainer>
                  <Scrollbar autoHide={false}>
                    <Table>
                      <UserTableHead
                        order={order}
                        orderBy={orderBy}
                        numSelected={selected.length}
                        rowCount={filteredUsers.length}
                        onRequestSort={handleRequestSort}
                        onSelectAllRows={handleSelectAllRows(
                          filteredUsers.map((row) => row.id)
                        )}
                        headList={FAMILY_HEAD_LIST}
                        keys="family"
                      />

                      <TableBody>
                        {filteredUsers.map((user) => (
                          <UserTableRow
                            key={user.id}
                            user={user}
                            isSelected={isSelected(user.id)}
                            handleSelectRow={handleSelectRow}
                            handleDeleteUser={handleDeleteUser}
                            keys="family"
                            openModal={getUserIdForUpdate}
                          />
                        ))}

                        {filteredUsers.length === 0 && <TableDataNotFound />}
                      </TableBody>
                    </Table>
                  </Scrollbar>
                </TableContainer>
              </Card>
              
            </Grid> */}

            <FlexBox flexWrap="wrap" gap={2}>
              <Button type="submit" variant="contained">
                {id ? "Update" : "Add"}
              </Button>
              {!id && (
                <Button
                  onClick={handleClear}
                  variant="outlined"
                  color="secondary"
                >
                  Clear
                </Button>
              )}
            </FlexBox>
          </Grid>
        </form>
      </div>
      {/* {deleteModal && (
        <>
          <Dialog
            open={deleteModal}
            onClose={handleDeleteUser}
            aria-labelledby="delete-confirmation-title"
            aria-describedby="delete-confirmation-description"
          >
            <DialogTitle id="delete-confirmation-title">
              Delete Confirmation
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="delete-confirmation-description">
                Do you really want to delete this member?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleDeleteUser}
                variant="outlined"
                color="primary"
              >
                Cancel
              </Button>
              <LoadingButton
                loading={isSubmitting}
                onClick={handleDelete}
                variant="contained"
              >
                Delete
              </LoadingButton>
            </DialogActions>
          </Dialog>
        </>
      )} */}
    </>
  );
}
