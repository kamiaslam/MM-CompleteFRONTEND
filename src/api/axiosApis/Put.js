import toast from "react-hot-toast";
import { isSuccessResp, put } from "../base";
import { UPDATE_PATIENT } from "../../helper/constant";

export async function updateCarehome(body, carehomeId, showLoader, hideLoader) {
  try {
    if (showLoader) showLoader(); // Show the loader if function is provided

    const response = await put(`/admin/edit-carehomes/${carehomeId}`, body);

    if (isSuccessResp(response.status)) {
      toast.success(response?.data?.message || "Care Home updated successfully");
      return response;
    } else {
      toast.error(
        response?.data?.detail && !Array.isArray(response?.data?.detail)
          ? response?.data?.detail
          : response?.data?.message
            ? response?.data?.message
            : SOMETHING_WRONG
      );
      return response;
    }
  } catch (error) {
    console.error("Error updating care home:", error);
    toast.error("Something went wrong while updating care home");
  } finally {
    if (hideLoader) hideLoader();
  }
}


export async function UpdateUser(body, id, showLoader, hideLoader) {
  try {
    if (showLoader) showLoader(); // Show the loader if function is provided
    const response = await put(`/patients/edit-patient/${id}`, body);
    if (isSuccessResp(response.status)) {
      toast.success(UPDATE_PATIENT);

      return response;
    } else {
      toast.error(
        response?.data?.detail && !Array.isArray(response?.data?.detail)
          ? response?.data?.detail
          : response?.data?.message
            ? response?.data?.message
            : SOMETHING_WRONG
      );
      return response;
    }
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    if (hideLoader) hideLoader();
  }
}
export async function UpdateCareHomeProfile(body, showLoader, hideLoader) {
  try {
    if (showLoader) showLoader(); // Show the loader if function is provided

    const response = await put(`/carehome/update-detail`, body);
    if (isSuccessResp(response.status)) {
      toast.success(response?.data.message);
      return response;
    }
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    if (hideLoader) hideLoader();
  }
}

export async function UpdateLifeHistory(id, body, showLoader, hideLoader) {
  try {
    if (showLoader) showLoader(); // Show the loader if function is provided

    const response = await put(`/life-history/update/${id}`, body);
    if (isSuccessResp(response.status)) {
      toast.success(response?.data.message);
      return response;
    }
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    if (hideLoader) hideLoader();
  }
}

export async function UpdateTopics(body, showLoader, hideLoader) {
  try {
    if (showLoader) showLoader();

    const response = await put(`/call/update-topic`, body);
    if (isSuccessResp(response.status)) {
      return response;
    }
  } catch (error) {
    console.error("Error creating Topic:", error);
  } finally {
    if (hideLoader) hideLoader();
  }
}