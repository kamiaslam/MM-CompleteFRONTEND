import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Scrollbar from "@/components/scrollbar";
import { TableDataNotFound, TableToolbar } from "@/components/table";
import SearchArea from "../../users/SearchArea";
import HeadingArea from "../HeadingArea";
import CareHomeTableRow from "../CareHomeTableRow";
import CareHomeTableHead from "../CareHomeTableHead";
import useMuiTable from "@/hooks/useMuiTable";
import { fetchCarehomesData } from "../../../api/axiosApis/get";
import { deleteCarehome } from "../../../api/axiosApis/delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useLoader } from "../../../contexts/LoaderContext";

export default function CareHomeListPageView() {
  const [careHome, setCareHome] = useState([]);
  const [careHomeCount, setCareHomeCount] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteCareHomeID, setDeleteCareHomeID] = useState("");
  const [careHomeFilter, setCareHomeFilter] = useState({
    search: "",
  });
  const [loading, setLoading] = useState(false);

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
    defaultOrderBy: "careHomeName",
  });
  const { showLoader, hideLoader } = useLoader();

  const fetchData = async () => {
    setLoading(true);
    const data = await fetchCarehomesData(
      page + 1, // page index in API starts from 1
      rowsPerPage,
      careHomeFilter.search,
      showLoader,
      hideLoader
    );
    if (data) {
      setCareHome(data.data || []);
      setCareHomeCount(data.total || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, careHomeFilter]);

  const handleDeleteCareHome = (id) => {
    setDeleteCareHomeID(id);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    // Call deleteCarehome API function with carehome id, showLoader and hideLoader
    showLoader();
    try {
      await deleteCarehome(deleteCareHomeID, showLoader, hideLoader);
      // Refresh data after deletion
      fetchData();
    } catch (error) {
      console.error("Failed to delete care home:", error);
    } finally {
      hideLoader();
      setDeleteModal(false);
    }
  };

  return (
    <div className="pt-2 pb-4">
      <Card>
        <Box px={2} pt={2}>
          <HeadingArea value={careHomeFilter.search} changeTab={() => {}} />
          <SearchArea
            value={careHomeFilter.search}
            onClear={() => setCareHomeFilter({ search: "" })}
            onChange={(e) => setCareHomeFilter({ search: e.target.value })}
          />
        </Box>

        {/* TABLE ROW SELECTION HEADER */}
        {selected.length > 0 && (
          <TableToolbar selected={selected.length} handleDeleteRows={() => {}} />
        )}

        <TableContainer>
          <Scrollbar autoHide={false}>
            <Table>
              <CareHomeTableHead
                numSelected={selected.length}
                rowCount={careHome.length}
                onRequestSort={handleRequestSort}
                onSelectAllRows={handleSelectAllRows(careHome.map((row) => row.id))}
              />
              <TableBody>
                {careHome.length === 0 ? (
                  <TableDataNotFound
                    customSentence={
                      loading ? "Loading data..." : "No Care Home Data Found."
                    }
                  />
                ) : (
                  careHome.map((careHomeItem) => (
                    <CareHomeTableRow
                      key={careHomeItem.id}
                      careHome={careHomeItem}
                      isSelected={isSelected(careHomeItem.id)}
                      handleSelectRow={handleSelectRow}
                      handleDeleteCareHome={handleDeleteCareHome}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        {/* PAGINATION */}
        <TablePagination
          page={page}
          rowsPerPage={rowsPerPage}
          count={careHomeCount}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* DELETE MODAL */}
      {deleteModal && (
        <Dialog open={deleteModal} onClose={() => setDeleteModal(false)}>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this care home?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteModal(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
