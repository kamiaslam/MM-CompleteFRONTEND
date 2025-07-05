import toast from "react-hot-toast";
import { del, isSuccessResp } from "../base";
import { DELETE_FAMILY, DELETE_PATIENT, DELETE_CAREHOME } from "../../helper/constant";

export async function deleteCarehome(carehomeId, showLoader, hideLoader) {
  try {
    if (showLoader) showLoader();
    const response = await del(`/admin/delete-carehomes/${carehomeId}`);
    
    if (isSuccessResp(response.status)) {
      toast.success(DELETE_CAREHOME);
      return response;
    } else {
      console.error("Failed to delete carehome.");
    }
  } catch (error) {
    console.error("Error deleting carehome:", error);
  } finally {
    if (hideLoader) hideLoader();
  }
}

export async function deleteFamilyMember(userId, showLoader, hideLoader) {
  try {
    if (showLoader) showLoader();
    const response = await del(`/patients/delete-family-member/${userId}`);
    if (isSuccessResp(response.status)) {
      toast.success(DELETE_FAMILY);
      return response;
    } else {
      console.error("Failed to delete user.");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  } finally {
    if (hideLoader) hideLoader();
  }
}

export async function deletePatient(userId) {
  try {
    const response = await del(`/patients/delete-patient/${userId}`);
    
    if (isSuccessResp(response.status)) {
      toast.success(DELETE_PATIENT);
      return response;
    } else {
      console.error("Failed to delete user.");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}
