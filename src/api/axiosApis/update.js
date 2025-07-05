import { isSuccessResp } from "../base";

export async function updateUser(body) {
  try {
    const response = await patch("/users/123", body);
    if (isSuccessResp(response.status)) {
      return response;
    } else {
      console.error("Failed to update user.");
    }
  } catch (error) {
    console.error("Error updating user:", error);
  }
}
