import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import ProductView from "../product-view";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import styled from "@mui/material/styles/styled";
import Add from "@/icons/Add";
import useAuth from "@/hooks/useAuth";

import Scrollbar from "@/components/scrollbar";
import { TableDataNotFound, TableToolbar } from "@/components/table";
import useMuiTable, { getComparator, stableSort } from "@/hooks/useMuiTable";
import ProductTableRow from "../ProductTableRow";
import ProductTableHead from "../ProductTableHead";
import { useLoader } from "../../../contexts/LoaderContext";
import { getCallList } from "../../../api/axiosApis/get";

const ListWrapper = styled("div")(({ theme }) => ({
  gap: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  [theme.breakpoints.down(440)]: {
    flexDirection: "column",
    ".MuiButton-root": {
      width: "100%",
    },
  },
}));

export default function ProductListPageView() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState({
    stock: "",
    search: "",
    publish: "",
  });

  const handleChangeFilter = (key, value) => {
    setProductFilter((state) => ({ ...state, [key]: value }));
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

  useEffect(() => {
    const fetchCallList = async () => {
      setLoading(true);
      try {
        const data = await getCallList(showLoader, hideLoader);
        setProducts(data?.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCallList();
  }, []);

  const filteredProducts = products
    ? stableSort(products, getComparator(order, orderBy))?.filter((item) => {
        if (productFilter.stock === "stock") return item.stock > 0;
        else if (productFilter.stock === "out-of-stock")
          return item.stock === 0;
        else if (productFilter.publish === "published")
          return item.published === true;
        else if (productFilter.publish === "draft")
          return item.published === false;
        else if (productFilter.search)
          return item.name
            .toLowerCase()
            .includes(productFilter.search.toLowerCase());
        else return true;
      })
    : [];

  const handleDeleteProduct = (id) => {
    setProducts((state) => state.filter((item) => item.id !== id));
  };

  const handleAllProductDelete = () => {
    setProducts((state) => state.filter((item) => !selected.includes(item.id)));
    handleSelectAllRows([])();
  };

  const [details, setDetails] = useState(null);
  const handleButtonClick = (details12) => {
    setDetails(details12);
  };

  return (
    <div className="pt-2 pb-4">
      {details === null ? (
        <>
          <ListWrapper style={{ justifyContent: "flex-end" }}>
            {user?.role === "care_home" && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate("/dashboard/schedule-call")}
              >
                Schedule call
              </Button>
            )}
          </ListWrapper>

          <Card sx={{ mt: 4 }}>
            {selected.length > 0 && (
              <TableToolbar
                selected={selected.length}
                handleDeleteRows={handleAllProductDelete}
              />
            )}

            <TableContainer>
              <Scrollbar>
                <Table sx={{ minWidth: 820 }}>
                  <ProductTableHead
                    order={order}
                    orderBy={orderBy}
                    numSelected={selected.length}
                    rowCount={filteredProducts.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllRows={handleSelectAllRows(
                      filteredProducts.map((row) => row.id)
                    )}
                  />
                  <TableBody>
                    {loading ? (
                      <TableDataNotFound customSentence="Loading data..." />
                    ) : filteredProducts.length === 0 ? (
                      <TableDataNotFound />
                    ) : (
                      filteredProducts
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((product) => (
                          <ProductTableRow
                            key={product.id}
                            product={product}
                            handleSelectRow={handleSelectRow}
                            handleButtonClick={handleButtonClick}
                            isSelected={isSelected(product.id)}
                            handleDeleteProduct={handleDeleteProduct}
                          />
                        ))
                    )}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePagination
              page={page}
              component="div"
              rowsPerPage={rowsPerPage}
              count={filteredProducts.length}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </>
      ) : (
        <Grid container spacing={3}>
          <Grid size={12}>
            <ProductView details={details} setDetails={setDetails} />
          </Grid>
        </Grid>
      )}
    </div>
  );
}
