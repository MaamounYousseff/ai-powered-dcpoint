import SchedulingMain from "../component/SchedulingMain";
import { useSchedulingResponse } from "../context/SchedulingResponseProvider";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

interface SchedulePageProps {
  additionalClasses?: string;
}

function SchedulingPage({additionalClasses}:SchedulePageProps) {
  const [response, setResponse] = useSchedulingResponse();

  const handleClose = () => {
    setResponse(null);
  };


  const getSnackbarData = () => {
    if (response?.success && typeof response.data === "object") {
      const data = response.data ;
      return `Appointment for ${data.firstName} ${data.lastName} — 📅 ${data.datetime} — 📞 ${data.phoneNumber}`;
    }
    return null;
  };

  return (
    <div className= {additionalClasses ? additionalClasses + " scheduling-page-container" : "scheduling-page-container"}>
      <Snackbar
        open={!!response}
        autoHideDuration={8000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={response?.success ? "success" : "error"}
          variant="filled"
        >
          <AlertTitle>{response?.message}</AlertTitle>
          {getSnackbarData()}
        </Alert>
      </Snackbar>

      <SchedulingMain  />
      
    </div>
  );
}

export default SchedulingPage;