import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

const CustomGridToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton style={{ color: "gray" }} />
      <GridToolbarFilterButton style={{ color: "gray" }} />
      <GridToolbarExport style={{ color: "gray" }} />
    </GridToolbarContainer>
  );
};

export default CustomGridToolbar;
