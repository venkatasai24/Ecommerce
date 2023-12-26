import { useEffect } from "react";
import Swal from "sweetalert2";
import useAxiosPrivate from "../hooks/useAxiosprivate";

const Success = () => {
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    // Add any additional logic you need upon successful payment
    const paymentLink = localStorage.getItem("paymentLink");

    // Define an async function to handle the Swal and API call
    const handleSwalAndApiCall = async () => {
      const result = await Swal.fire({
        title: paymentLink ? "Order Placed Successfully!!" : "404",
        text: paymentLink
          ? "Thank you for your purchase"
          : "Invalid access to the success page",
        icon: paymentLink ? "success" : "warning",
        confirmButtonColor: "steelblue",
        confirmButtonText: "OK",
      });

      // Check if the OK button was pressed
      if (paymentLink) {
        localStorage.removeItem("paymentLink");

        try {
          // Set ordered items in the backend and set cartitems to empty
          await axiosPrivate.patch("/user/order", {
            withCredentials: true,
          });

          // Redirect to '/'
          setTimeout(() => {
            window.location.href = "/";
          }, 100);
        } catch (error) {
          console.error("Error updating ordered items:", error);
        }
      }

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
  }, [axiosPrivate]);

  return <></>;
};

export default Success;
