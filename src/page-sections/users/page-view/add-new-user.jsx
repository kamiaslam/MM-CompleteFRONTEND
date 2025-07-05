import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import * as Yup from "yup";
import { useFormik } from "formik";
// import { EMAIL_REGEX } from "@helper/constant";
import { handleSpaceKeyPress } from "@/utils";

import { TableDataNotFound } from "@/components/table";

import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Divider from "@mui/material/Divider";
import FlexBox from "@/components/flexbox/FlexBox";

import AddFamilyMember from "./add-family-member";
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
import UserTableHead from "../UserTableHead";
import useMuiTable, { getComparator, stableSort } from "@/hooks/useMuiTable"; // CUSTOM DUMMY DATA
import Scrollbar from "@/components/scrollbar";
import UserTableRow from "../UserTableRow";
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
import HeadingArea from "../HeadingArea";

export default function AddNewUserPageView() {
  const [users, setUsers] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const getUserData = async () => {
    try {
      const resp = await get(`patients/get-patient/${id}`);
      if (isSuccessResp(resp.status)) {
        updateFormData(resp?.data?.data);
        setUsers(resp?.data?.data?.family_members);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (id) {
      getUserData();
    }
  }, [id]);

  const initialValues = {
    firstName: "",
    lastName: "",
    birthdate: "",
    fullName: "",
    patientEmail: "",
    hume_voice: "Aria",
    gender: "Female",
    description: "",
    relation: "",
    phone_number: "",
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
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteUserID, setDeleteUserID] = useState("");
  const { showLoader, hideLoader } = useLoader();
  const handleDelete = async () => {
    if (id) {
      await deleteFamilyMember(deleteUserID, showLoader, hideLoader).then(
        (res) => {
          if (res?.data?.success) {
            setUsers((state) =>
              state.filter((item) => item.id !== deleteUserID)
            );
            setDeleteUserID("");
            setDeleteModal(!deleteModal);
          }
        }
      );
    } else {
      toast.success(DELETE_FAMILY);
      setUsers((state) => state.filter((item) => item.id !== deleteUserID));
      setDeleteUserID("");
      setDeleteModal(!deleteModal);
    }
  };
  const handleDeleteUser = (familyId) => {
    setDeleteModal(!deleteModal);
    if (familyId) {
      setDeleteUserID(familyId);
    }
  };

  const [openModal, setOpenModal] = useState(false);
  const [userId, setUserId] = useState("");

  const handleClose = () => setOpenModal(!openModal);

  const handleOpenModal = () => {
    setOpenModal(!openModal);
    setIsEdit(false);
  };

  const getUserIdForUpdate = (userid) => {
    setUserId(userid);
    setOpenModal(!openModal);
  };
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is Required!"),
    lastName: Yup.string().required("Last Name is Required!"),
    // patientEmail: Yup.string().email().required("Email is Required!"),
    patientEmail: Yup.string()
      .required("Email is required!")
      .test("is-valid-email", "Invalid email format", (value) =>
        EMAIL_REGEX.test(value)
      ),
    description: Yup.string().required("Description is Required!"),
    birthdate: Yup.date().required("Date of Birth is Required!"),
    phone_number: Yup.string()
  .required("Phone number is required!")
  .matches(/^\+\d{10,15}$/, "Enter a valid phone number with country code"),

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
      console.log("working")
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
                phone_number: values?.phone_number?.trim(),
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
                hume_voice: values?.hume_voice?.trim(),
                email: values?.patientEmail?.trim(),
                family_members: users.map(({ id, ...rest }) => rest),
                gender: values.gender,
                medical_history: values?.description?.trim(),
                birthdate: moment(new Date(values?.birthdate))?.format(
                  "YYYY-MM-DD"
                ),
                phone_number: values?.phone_number?.trim(),
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
    setFieldValue("hume_voice", value?.hume_voice ? value?.hume_voice : "");
    setFieldValue("gender", value?.gender ? value?.gender : "");
    setFieldValue("phone_number", value?.phone_number || "");
    setFieldValue(
      "description",
      value?.medical_history ? value?.medical_history : ""
    );
  };
  const filteredUsers = stableSort(users, getComparator(order, orderBy));

  return (
    <>
      <div className="pt-2 pb-4">
        <form onSubmit={handleSubmit}>
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
                    differentName={`${id ? `Edit Patient` : `Add Patient`}`}
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
                      name="patientEmail"
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

                  

                  <Grid
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
                    <option value="Aria">Aria</option>
                    <option value="Roger">Roger</option>
                    <option value="Sarah">Sarah</option>
                    <option value="Laura">Laura</option>
                    <option value="Charlie">Charlie</option>
                    <option value="George">George</option>
                    <option value="Callum">Callum</option>
                    <option value="River">River</option>
                    <option value="Liam">Liam</option>
                    <option value="Charlotte">Charlotte</option>
                    <option value="Alice">Alice</option>
                    <option value="Matilda">Matilda</option>
                    <option value="Will">Will</option>
                    <option value="Jessica">Jessica</option>
                    <option value="Eric">Eric</option>
                    <option value="Chris">Chris</option>
                    <option value="Brian">Brian</option>
                    <option value="Daniel">Daniel</option>
                    <option value="Lily">Lily</option>
                    <option value="Bill">Bill</option>
                    <option value="Lewis - Calm Scottish Male">Lewis - Calm Scottish Male</option>
                    </TextField>
                  </Grid>
                  <Grid size={{ sm: 6, xs: 12 }}>
                    <TextField
                      fullWidth
                      name="phone_number"
                      label="Phone Number (with country code)"
                      onChange={(e) => setFieldValue("phone_number", e.target.value.trim())}
                      value={values.phone_number}
                      helperText={touched.phone_number && errors.phone_number}
                      error={Boolean(touched.phone_number && errors.phone_number)}
                      placeholder="+12345678901"
                    />
                  </Grid>

                  

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
                      defaultValue="Female"
                      name="gender"
                      onChange={handleChange}
                      sx={{
                        justifyContent: "start",
                      }}
                    >
                      <FormControlLabel
                        value="Female"
                        control={<Radio />}
                        label="Female"
                      />
                      <FormControlLabel
                        value="Male"
                        control={<Radio />}
                        label="Male"
                      />
                      <FormControlLabel
                        value="Other"
                        control={<Radio />}
                        label="Other"
                      />
                    </RadioGroup>
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
                      name="country"
                      variant="outlined"
                      style={ {display:"none" } }
                      slotProps={{
                        select: {
                          native: true,
                          IconComponent: KeyboardArrowDown,
                        },
                      }}
                    >
                      <option value="new-patient">New patient</option>
                      {/* <option value="existing-resident-patient">
                        Existing resident patient
                      </option>
                      <option value="local-council-new-patient">
                        Local Council new patient
                      </option> */}
                    </TextField>
                  </Grid>

                  <Grid size={12}>
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
                      label="Write patient's medical history here "
                      sx={{
                        "& .MuiOutlinedInput-root textarea": {
                          padding: 0,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid size={{ md: 12, xs: 12 }}>
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
              <FlexBox
                flexWrap="wrap"
                gap={2}
                sx={{
                  my: 3,
                }}
              >
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
          </Grid>
        </form>
      </div>
      {deleteModal && (
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
      )}
    </>
  );
}
