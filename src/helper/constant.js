import moment from "moment";
import { useEffect, useState } from "react";

//------------------------------------regex------------------------------------------------//
export const EMAIL_REGEX =
  /^(?!.*[@]{2})(?!.*[._%+-]{2})[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//-------------------------------------Array list-------------------------------------//
export const PATIENT_LIST_COLUMNS = [
  { name: "sr", align: "center" },
  { name: "patient name", align: "left" },
  { name: "email", align: "left" },
  { name: "birthDate", align: "left" },
  { name: "created date", align: "left" },
  { name: "status", align: "center" },
  { name: "action", align: "center" },
];
export const TRAINING_LOGS_COLUMNS = [
  { name: "sr", align: "center" },
  { name: "family member name", align: "left" },
  { name: "email", align: "left" },
  { name: "created date", align: "left" },
  { name: "action", align: "center" },
];
export const CALL_DURATION = [
  { label: "5 minutes", value: 5 },
  { label: "10 minutes", value: 10 },
  { label: "15 minutes", value: 15 },
  { label: "20 minutes", value: 20 },
  // { label: "25 minutes", value: 25 },
  // { label: "30 minutes", value: 30 },
  // { label: "35 minutes", value: 35 },
  // { label: "40 minutes", value: 40 },
  // { label: "45 minutes", value: 45 },
];

export const mainRelations = [
  "Family",
  "Guardian",
  "Social Worker",
  "Healthcare Provider",
  "Educational",
  "Friend",
  "Professional",
  "Other",
];

export const PatientTypes = [
  {
    value: "NewPatient",
    label: "New patient",
  },
  {
    value: "ExistingResidentPatient",
    label: "Existing resident patient",
  },
  {
    value: "LocalCouncilNewPatient",
    label: "Local council new patient",
  },
  {
    value: "LocalCouncilReferredPatientWithoutFamily",
    label: "Local council referred patient without family",
  },
];

export const relations = [
  { value: "Father", label: "Father" },
  { value: "Mother", label: "Mother" },
  { value: "Siblings", label: "Siblings" },
  { value: "Son", label: "Son" },
  { value: "Daughter", label: "Daughter" },
  { value: "Spouse", label: "Spouse" },
  { value: "Other", label: "Other" },
];
export const FAMILY_HEAD_LIST = [
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "birthdate",
    numeric: true,
    disablePadding: false,
    label: "Date of birth",
  },
  {
    id: "relation",
    numeric: true,
    disablePadding: false,
    label: "Relation",
  },
  {
    id: "gender",
    numeric: true,
    disablePadding: false,
    label: "Gender",
  },
  {
    id: "actions",
    numeric: true,
    disablePadding: false,
    label: "Actions",
  },
];
export const PATIENT_HEAD_LIST = [
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Patient Name",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "birthdate",
    numeric: true,
    disablePadding: false,
    label: "Date of birth",
  },
  {
    id: "createAt",
    numeric: true,
    disablePadding: false,
    label: "Created At",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "actions",
    numeric: true,
    disablePadding: false,
    label: "Actions",
  },
];


export const SUB_ADMIN_HEAD_LIST = [
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Sub Admin Name",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "birthdate",
    numeric: true,
    disablePadding: false,
    label: "Date of birth",
  },
  {
    id: "createAt",
    numeric: true,
    disablePadding: false,
    label: "Created At",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "actions",
    numeric: true,
    disablePadding: false,
    label: "Actions",
  },
];

export const CARE_HOME_HEAD_LIST = [
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Care Home Name",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "birthdate",
    numeric: true,
    disablePadding: false,
    label: "Date of birth",
  },
  {
    id: "createAt",
    numeric: true,
    disablePadding: false,
    label: "Created At",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "actions",
    numeric: true,
    disablePadding: false,
    label: "Actions",
  },
];

export const PATIENT_HEAD_LIST_DASHBOARD = [
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Patient Name",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "birthdate",
    numeric: true,
    disablePadding: false,
    label: "Date of birth",
  },
  {
    id: "createAt",
    numeric: true,
    disablePadding: false,
    label: "Created At",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Status",
  },

];


export const TRAINING_LOGS_HEAD_LIST = [
  {
    id: "family_member_name",
    numeric: false,
    disablePadding: false,
    label: "Family Member Name",
  },
  {
    id: "family_member_email",
    numeric: true,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "created_at",
    numeric: true,
    disablePadding: false,
    label: "Created At",
  },
  {
    id: "actions",
    numeric: true,
    disablePadding: false,
    label: "View",
  },
];
//------------------------------------default value--------------------------------------//
export const GENERAL_INFO_PATIENT = {
  lastName: "",
  firstName: "",
  birthdate: "",
  patientEmail: "",
  patientType: "NewPatient",
  gender: "Male",
};

export const FAMILY_MEMBER_INFO = {
  relation: "",
  otherRelation: "",
  name: "",
  email: "",
  gender: "Male",
  id: null,
  birth_date: "",
};

export const FAMILY_MODAL = {
  isOpen: false,
  isEdit: false,
  memberInfo: {},
  memberIndex: null,
};
export const PROFILE_FIELD = {
  username: "",
  carehome_name: "",
  email: "",
  address: "",
  administrator_name: "",
  phone_number: "",
  countryCode: "us",
  // Add more fields as needed
};

export const FILE_TYPE = ["image", "video", "audio"];

//----------------------------validation function------------------------------------//
export const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push(PASSWORD_VALIDATION_MESSAGES.minLength);
  if (!/[A-Z]/.test(password))
    errors.push(PASSWORD_VALIDATION_MESSAGES.uppercase);
  if (!/[a-z]/.test(password))
    errors.push(PASSWORD_VALIDATION_MESSAGES.lowercase);
  if (!/[0-9]/.test(password)) errors.push(PASSWORD_VALIDATION_MESSAGES.digit);
  if (!/[^A-Za-z0-9]/.test(password))
    errors.push(PASSWORD_VALIDATION_MESSAGES.specialChar);

  if (errors.length > 0) {
    return PASSWORD_VALIDATION_MESSAGES.summary;
  }

  return "";
};
export function isEmpty(value) {
  return (
    value == null ||
    value == undefined ||
    value == 0 ||
    (typeof value === "string" && !value?.trim()) ||
    (Array?.isArray(value) && !value?.length)
  );
}
export const capitalizeValue = (value = "") => {
  if (typeof value !== "string") return ""; // Ensure value is a string
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const functionGetTime = (time) => {
  return moment?.utc(time)?.local()?.format("DD MMM YYYY - hh:mm:ss A");
};

export const getDateLabel = (dateString) => {
  const today = moment()?.startOf("day"); // Set today to the start of the day for accurate comparisons
  const messageDate = moment(dateString?.substring(0, 19)); // Remove the microseconds part of the string
  const diffInDays = today.diff(messageDate?.startOf("day"), "days"); // Compare start of days for accurate day difference

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return messageDate.format("dddd");
  return messageDate?.format("MMMM D, YYYY");
};

//----------------------------validation message --------------------------------------//
export const PASSWORD_VALIDATION_MESSAGES = {
  minLength: "at least 8 characters",
  uppercase: "one uppercase letter",
  lowercase: "one lowercase letter",
  digit: "one number",
  specialChar: "one special character",
  summary:
    "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character!",
};

//----------------------------message --------------------------------------//
export const SOMETHING_WRONG = "Oops! Something went wrong";
export const SUCCESSFULLY_LOGIN = "You have successfully logged in.";
export const DELETE_CAREHOME = "Carehome has been deleted successfully";
export const DELETE_PATIENT = "Patient has been deleted successfully";
export const DELETE_FAMILY = "Family member has been deleted successfully";
export const UPDATE_PATIENT = "Patient and family members updated successfully";
export const CREATE_PATIENT = "Patient and family members created successfully";
export const ONE_FAMILY_REQUIRED =
  "At least one family member must be included.";
export const SESSION_EXPIRED = "Session expired. Sign in again.";

export const apiKey = "9OgS1MSc6ydaxs7vHSXh7QrK6tH0JpCj1KDXAGQplMpQVrGz";
export const configId = "1079d22e-679c-4880-aac1-a43349c1a70a";
export const secretKey =
  "eUyU45kjzd03936AZUPc853brBQR3Qqw7AGXuVfe1HtR3YN1xF2QjN77cudc8xrA";

export const VIEW_OPTIONS = [
  { id: "month", label: "Month" },
  { id: "agenda", label: "Agenda" },
];
