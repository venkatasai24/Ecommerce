import { useEffect } from "react";
import Swal from "sweetalert2";

const Missing = () => {
  useEffect(() => {
    // Define an async function to handle the Swal and API call
    const handleSwalAndApiCall = async () => {
      const result = await Swal.fire({
        title: "404",
        text: "The page you are looking for could not be found. Please check the URL and try again.",
        icon: "error",
        confirmButtonColor: "steelblue",
        confirmButtonText: "OK",
      });

      // Check if the OK button was pressed
      if (result.isConfirmed) {
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      }
    };

    // Call the async function
    handleSwalAndApiCall();

    // Moved cleanup logic here
    return () => {
      console.log("Success component unmounted");
    };
  }, []);

  return <></>;
};

export default Missing;
