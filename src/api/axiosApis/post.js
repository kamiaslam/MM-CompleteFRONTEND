import toast from "react-hot-toast";
import { isSuccessResp, post, postFormData } from "../base";
import {
  CREATE_PATIENT,
  SOMETHING_WRONG,
  SUCCESSFULLY_LOGIN,
} from "../../helper/constant";


export async function updatePassword(params, showLoader, hideLoader) {
  try {
    if (showLoader) showLoader(); // Show loader if provided

    const response = await post("/auth/update-password", null, {
      params, // Send current_password and new_password as query parameters
    });

    if (isSuccessResp(response.status)) {
      toast.success("Password updated successfully!");
      return response;
    } else {
      toast.error(
        response?.data?.detail && !Array.isArray(response?.data?.detail)
          ? response?.data?.detail
          : response?.data?.message
          ? response?.data?.message
          : "Something went wrong while updating the password."
      );
      return response;
    }
  } catch (error) {
    console.error("Error updating password:", error);
    toast.error("An unexpected error occurred while updating the password.");
  } finally {
    if (hideLoader) hideLoader();
  }
}


export async function createCarehome(body, showLoader, hideLoader) {
  try {
    if (showLoader) showLoader(); // Show loader if provided

    const response = await post("/admin/add-carehome", body);

    if (isSuccessResp(response.status)) {
      toast.success("Care home created successfully!");
      return response;
    } else {
      toast.error(
        response?.data?.detail && !Array.isArray(response?.data?.detail)
          ? response?.data?.detail
          : response?.data?.message
          ? response?.data?.message
          : "Something went wrong while creating the care home."
      );
      return response;
    }
  } catch (error) {
    console.error("Error creating care home:", error);
  } finally {
    if (hideLoader) hideLoader();
  }
}


//patient
//super_admin
//sub_admin
//family_member
//care_home
export async function loginUser(body) {
  try {
    console.log(body)
    const response = await post("/auth/sign-in", body);
    
//    response.data.data.role="family_member"
//    response.data.data.user_info.last_name="Hank"
    if (isSuccessResp(response.status)) {
      toast.success(SUCCESSFULLY_LOGIN);
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
  }
}

export const SendOTP = async ({ email }) => {
  try {
    const response = await post(`carehome/forgot-password`, { email: email });

    return response.data;
  } catch (e) {
    return e.response.data;
  }
};

export const uploadMedia = async (body) => {
  try {
    const response = await postFormData(`/media/upload-media`, body);
    return response;
  } catch (e) {
    return e.response;
  }
};

export const createInstruction = async (body) => {
  try {
    const response = await post(`/media/create-instruction-description`, body);
    return response;
  } catch (e) {
    return e.response;
  }
};

export const createLifeHistory = async (body) => {
  try {
    const response = await post(`/life-history/create`, body);
    return response;
  } catch (e) {
    return e.response;
  }
};

export const VerifyForgotPasswordOTP = async (body) => {
  try {
    const response = await post(`otp/verify-forgot-pass-otp`, body);
    return response.data;
  } catch (e) {
    return e.response.data;
  }
};

export const ResetPassword = async (body) => {
  try {
    const response = await post(`/carehome/reset-password`, body);
    return response.data;
  } catch (e) {
    return e.response.data;
  }
};

export async function createUser(body, showLoader, hideLoader) {
  try {
    if (showLoader) showLoader(); // Show the loader if function is provided
    const response = await post("/patients/add-patient", body);
    if (isSuccessResp(response.status)) {
      toast.success(CREATE_PATIENT);

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
export async function createScheduleCall(body) {
  try {
    const response = await post("/call/schedule-call", body);
    if (isSuccessResp(response.status)) {
      toast.success(response.data?.message);
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
  }
}
export async function createFamilyMember(body, id, showLoader, hideLoader) {
  try {
    if (showLoader) showLoader(); // Show the loader if function is provided
    const response = await post(`/patients/add-family-member/${id}`, body);
    if (isSuccessResp(response.status)) {
      // toast.success(CREATE_PATIENT);

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





export const createCallHistory = async (body) => {
  try {
    const response = await post(`/call/create-call-history`, body);

    return response;
  } catch (e) {
    return e.response;
  }
};

export const UserMessages = async (body) => {
  try {
    const response = await post(`/call/call-during/get-images`, body);
    return response;
  } catch (e) {
    return e.response;
  }
};
