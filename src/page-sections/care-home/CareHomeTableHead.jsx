import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import { isDark } from "@/utils/constants"; 

// Updated header fields for the Care Home table mapping against the API response fields
const headCells = [
  {
    id: "careHomeName", // Maps to carehome_name in your row component
    numeric: false,
    disablePadding: false,
    label: "Care Home Name",
  },
  // {
  //   id: "username",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "Username",
  // },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  // {
  //   id: "administratorName", // Maps to administrator_name
  //   numeric: false,
  //   disablePadding: false,
  //   label: "Administrator Name",
  // },
  {
    id: "phoneNumber", // Maps to phone_number
    numeric: true,
    disablePadding: false,
    label: "Phone Number",
  },
  {
    id: "address",
    numeric: false,
    disablePadding: false,
    label: "Address",
  },
  {
    id: "createdAt", // Maps to created_at
    numeric: false,
    disablePadding: false,
    label: "Created At",
  },
  {
    id: "patientsCount", // Maps to patients_count
    numeric: false,
    disablePadding: false,
    label: "Patients Count",
  },
  {
    id: "Action", // Maps to patients_count
    numeric: false,
    disablePadding: false,
    label: "Action",
  }
];

export default function CareHomeTableHead(props) {
  const {
    onSelectAllRows,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headList, // This is passed in from the parent component, if provided
  } = props;

  return (
    <TableHead
      sx={{
        backgroundColor: (theme) => (isDark(theme) ? "grey.700" : "grey.100"),
      }}
    >
      <TableRow>
        {/* Optionally add a checkbox for row selection if needed */}
        {/*
        <TableCell padding="checkbox">
          <Checkbox
            size="small"
            color="primary"
            onChange={onSelectAllRows}
            checked={rowCount > 0 && numSelected === rowCount}
            indeterminate={numSelected > 0 && numSelected < rowCount}
          />
        </TableCell>
        */}
        {/* Dynamically create table headers based on headList prop or the default headCells */}
        {(headList ? headList : headCells).map((headCell) => (
          <TableCell
            key={headCell.id}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              color: "text.primary",
              fontWeight: 600,
            }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
