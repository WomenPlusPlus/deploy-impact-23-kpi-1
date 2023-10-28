import { Alert, Snackbar } from "@mui/material";

const SnackBarComponent = ({
  open,
  handleCloseAlert,
  alertMessage,
  severity = "info",
}: {
  open: boolean;
  handleCloseAlert: () => void;
  alertMessage: string;
  severity: "success" | "error" | "warning" | "info" | undefined;
}) => {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert}>
      <Alert
        onClose={handleCloseAlert}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {alertMessage}
      </Alert>
    </Snackbar>
  );
};

export default SnackBarComponent;
