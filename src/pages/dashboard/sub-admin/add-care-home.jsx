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



export default function AddCareHomePageView() {
    const initialValues = {
      username: "",
      email: "",
      password: "",
      careHomeName: "",
      administratorName: "",
      phoneNumber: "",
      address: "",
    };
  
    const validationSchema = Yup.object().shape({
      username: Yup.string().required("Username is required!"),
      email: Yup.string()
        .required("Email is required!")
        .matches(EMAIL_REGEX, "Invalid email format"),
      password: Yup.string().required("Password is required!"),
      careHomeName: Yup.string().required("Care home name is required!"),
      administratorName: Yup.string().required("Administrator name is required!"),
      phoneNumber: Yup.string().required("Phone number is required!"),
      address: Yup.string().required("Address is required!"),
    });
  
    const {
      values,
      setFieldValue,
      errors,
      handleChange,
      handleSubmit,
      touched,
      resetForm,
    } = useFormik({
      initialValues,
      validationSchema,
      onSubmit: async (values) => {
        try {
          await createCareHome(values);
          resetForm();
          toast.success("Care home added successfully");
        } catch (error) {
          toast.error("Error adding care home");
        }
      },
    });
  
    return (
      <div className="pt-2 pb-4">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField
                fullWidth
                name="username"
                label="Username"
                onChange={handleChange}
                value={values.username}
                helperText={touched.username && errors.username}
                error={Boolean(touched.username && errors.username)}
              />
            </Grid>
            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                onChange={handleChange}
                value={values.email}
                helperText={touched.email && errors.email}
                error={Boolean(touched.email && errors.email)}
              />
            </Grid>
            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField
                fullWidth
                type="password"
                name="password"
                label="Password"
                onChange={handleChange}
                value={values.password}
                helperText={touched.password && errors.password}
                error={Boolean(touched.password && errors.password)}
              />
            </Grid>
            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField
                fullWidth
                name="careHomeName"
                label="Care Home Name"
                onChange={handleChange}
                value={values.careHomeName}
                helperText={touched.careHomeName && errors.careHomeName}
                error={Boolean(touched.careHomeName && errors.careHomeName)}
              />
            </Grid>
            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField
                fullWidth
                name="administratorName"
                label="Administrator Name"
                onChange={handleChange}
                value={values.administratorName}
                helperText={touched.administratorName && errors.administratorName}
                error={Boolean(touched.administratorName && errors.administratorName)}
              />
            </Grid>
            <Grid size={{ sm: 6, xs: 12 }}>
              <TextField
                fullWidth
                name="phoneNumber"
                label="Phone Number"
                onChange={handleChange}
                value={values.phoneNumber}
                helperText={touched.phoneNumber && errors.phoneNumber}
                error={Boolean(touched.phoneNumber && errors.phoneNumber)}
              />
            </Grid>
            <Grid size={{ sm: 12, xs: 12 }}>
              <TextField
                fullWidth
                name="address"
                label="Address"
                onChange={handleChange}
                value={values.address}
                helperText={touched.address && errors.address}
                error={Boolean(touched.address && errors.address)}
              />
            </Grid>
          </Grid>
          <FlexBox flexWrap="wrap" gap={2} mt={3}>
            <Button type="submit" variant="contained">Add Care Home</Button>
            <Button onClick={resetForm} variant="outlined" color="secondary">Clear</Button>
          </FlexBox>
        </form>
      </div>
    );
  }
  