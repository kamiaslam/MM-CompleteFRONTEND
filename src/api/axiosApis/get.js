import { isSuccessResp, get } from "../base";

export const fetchSingleCarehome = async (carehomeId, showLoader, hideLoader) => {
  try {
    if (showLoader) showLoader();

    const resp = await get(`/admin/get-carehome-details/${carehomeId}`);

    if (isSuccessResp(resp.status)) {
      return resp.data; // Contains the care home details in `data.data`
    } else {
      throw new Error("Failed to fetch care home details");
    }
  } catch (error) {
    console.error("Error fetching care home details:", error);
    throw error;
  } finally {
    if (hideLoader) hideLoader();
  }
};


export const fetchCarehomesData = async (page, rowsPerPage, search, showLoader, hideLoader) => {
  try {
    if (showLoader) showLoader(); // Show the loader if provided
    const resp = await get(`/admin/list-and-search-carehomes?page=${page}&limit=${rowsPerPage}${search ? `&name=${search}` : ''}`);
    if (isSuccessResp(resp.status)) {
      return resp.data;
    }
  } catch (error) {
    console.error('Error fetching carehomes data:', error);
  } finally {
    if (hideLoader) hideLoader();
  }
};



export const fetchOtherFamilyMembersLastSeen = async (familyMemberId, showLoader, hideLoader) => {
  try {
    // Show loading indicator if the function is provided
    if (showLoader) showLoader();

    // Make the GET request to fetch last seen data of other family members
    const resp = await get(`family-member/other-family-members-last-seen?family_member_id=${familyMemberId}`);

    // Check if the response is successful (status 200-299)
    if (isSuccessResp(resp.status)) {
      return resp.data; // Return the last seen data
    }
  } catch (error) {
    console.error("Error fetching last seen of other family members:", error);
    // Handle any errors that occur during the request
  } finally {
    // Hide the loading indicator if the function is provided
    if (hideLoader) hideLoader();
  }
};


// Function to fetch temporary media links based on call_id
export const fetchTemporaryMediaLinks = async (call_id, showLoader, hideLoader) => {
  try {
    // Show loading indicator if the function is provided
    if (showLoader) showLoader();

    // Make the GET request to fetch temporary media links, passing call_id as a query parameter
    const resp = await get(`media/get-temporary-media-links?schedule_id=${call_id}`);
    console.log(resp.data)
    // Check if the response is successful (status 200-299)
    if (isSuccessResp(resp.status)) {
      return resp.data; // Return the temporary media links from the response
    } else {
      throw new Error('Failed to fetch temporary media links');
    }
  } catch (error) {
    console.error("Error fetching temporary media links:", error);
    throw error; // Re-throw the error to be handled in the context provider
  } finally {
    // Hide the loading indicator if the function is provided
    if (hideLoader) hideLoader();
  }
};



export const fetchScheduledCallList = async (familyMemberId, showLoader, hideLoader) => {
  try {
    // Show loading indicator if the function is provided
    if (showLoader) showLoader();

    // Make the GET request to fetch the scheduled calls list, passing familyMemberId as a query parameter
    const resp = await get(`family-member/get-scheduled-calls?family_member_id=${familyMemberId}`);

    // Check if the response is successful (status 200-299)
    if (isSuccessResp(resp.status)) {
      return resp.data.scheduled_calls; // Return the scheduled call list from the response data
    } else {
      throw new Error('Failed to fetch scheduled call list');
    }
  } catch (error) {
    console.error("Error fetching scheduled call list:", error);
    throw error; // Re-throw the error to be handled in the context provider
  } finally {
    // Hide the loading indicator if the function is provided
    if (hideLoader) hideLoader();
  }
};


export const fetchTodaysCallData = async (carehomeId, showLoader, hideLoader) => {
  try {
    // Show loading indicator if the function is provided
    if (showLoader) showLoader();

    // Make the GET request to fetch today's call data, passing carehomeId as a query parameter
    const resp = await get(`carehome/todays-calls-data?carehome_id=${carehomeId}`);
    
    // Check if the response is successful (status 200-299)
    if (isSuccessResp(resp.status)) {
      return resp.data; // Return the call data from the response
    } else {
      throw new Error('Failed to fetch today\'s call data');
    }
  } catch (error) {
    console.error("Error fetching today's call data:", error);
    throw error; // Re-throw the error to be handled in the context provider
  } finally {
    // Hide the loading indicator if the function is provided
    if (hideLoader) hideLoader();
  }
};

export const fetchPatientSentimentDataPerDay = async (FamilyMemberId, date, showLoader, hideLoader) => {
  try {
    // Show loading indicator if provided
    if (showLoader) showLoader();

    // Make the GET request with FamilyMemberId in the path and date as query parameter
    const response = await get(`/family-member/sentiment/${FamilyMemberId}?date=${date}`);
    
    // Check if the response status is successful
    if (response.status >= 200 && response.status < 300) {
      return response.data; // Return the sentiment data from the response
    } else {
      throw new Error('Failed to fetch sentiment data');
    }
  } catch (error) {
    console.error("Error fetching sentiment data:", error);
    throw error; // Re-throw the error to be handled in the context provider
  } finally {
    // Hide the loading indicator if provided
    if (hideLoader) hideLoader();
  }
};

export const fetchCarehomePatientSentimentData = async (carehomeId, showLoader, hideLoader) => {
  try {
    // Show loading indicator if the function is provided
    if (showLoader) showLoader();

    // Make the GET request to fetch the patient sentiment data, passing carehomeId as a query parameter
    const resp = await get(`carehome/get-patient-sentiment-of-carehome?carehome_id=${carehomeId}`);
    
    // Check if the response is successful (status 200-299)
    if (isSuccessResp(resp.status)) {
      return resp.data; // Return the sentiment data from the response
    } else {
      throw new Error('Failed to fetch sentiment data');
    }
  } catch (error) {
    console.error("Error fetching sentiment data:", error);
    throw error; // Re-throw the error to be handled in the context provider
  } finally {
    // Hide the loading indicator if the function is provided
    if (hideLoader) hideLoader();
  }
};



export const fetchPatientSentimentData = async (patientId, showLoader, hideLoader) => {
  try {
    // Show loading indicator if the function is provided
    if (showLoader) showLoader();

    // Make the GET request to fetch patient sentiment data
    const resp = await get(`/patients/patient_sentiment_data?patient_id=${patientId}`);

    // Check if the response is successful (status 200-299)
    if (isSuccessResp(resp.status)) {
      return resp.data; // Return the sentiment data from the response
    }
  } catch (error) {
    console.error("Error fetching patient sentiment data:", error);
    // Handle any errors that occur during the request
  } finally {
    // Hide the loading indicator if the function is provided
    if (hideLoader) hideLoader();
  }
};


export const fetchTotalUsers = async (showLoader, hideLoader) => {
  try {
    // Show loading indicator if the function is provided
    if (showLoader) showLoader();

    // Make the GET request to fetch total users
    const resp = await get(`admin/get-total-number-of-users`);

    // Check if the response is successful (status 200-299)
    if (isSuccessResp(resp.status)) {
      return resp.data; // Return the total users data from the response
    }
  } catch (error) {
    console.error("Error fetching total users:", error);
    // Handle any errors that occur during the request
  } finally {
    // Hide the loading indicator if the function is provided
    if (hideLoader) hideLoader();
  }
};


export const fetchUserMemory = async (patientId, showLoader, hideLoader) => {
  try {
    // Show loading indicator if the function is provided
    if (showLoader) showLoader();

    // Make the GET request to fetch user memory details
    const resp = await get(`patients/user_memory?patient_id=${patientId}`);

    // Check if the response is successful (status 200-299)
    if (isSuccessResp(resp.status)) {
      return resp.data; // Return the user memory data from the response
    }
  } catch (error) {
    console.error("Error fetching user memory:", error);
    // Handle any errors that occur during the request
  } finally {
    // Hide the loading indicator if the function is provided
    if (hideLoader) hideLoader();
  }
};




export const fetchFamilyMembers = async (patientId, showLoader, hideLoader) => {
  try {
    // Show loading indicator if the function is provided
    if (showLoader) showLoader();

    // Make the GET request to fetch family members details
    const resp = await get(`/patients/get-family-members-names?patient_id=${patientId}`);

    // Check if the response is successful (status 200-299)
    if (isSuccessResp(resp.status)) {
      return resp.data; // Return the family member details from the response
    }
  } catch (error) {
    console.error("Error fetching family members:", error);
    // Handle any errors that occur during the request
  } finally {
    // Hide the loading indicator if the function is provided
    if (hideLoader) hideLoader();
  }
};

export const fetchUserData = async (page, rowsPerPage, search, showLoader, hideLoader) => {
  try {
    if (showLoader) showLoader(); // Show the loader if function is provided
    const resp = await get(`/patients/list-and-search-patients?page=${page}&limit=${rowsPerPage}${search ? `&name=${search}` : ``}`);
    if (isSuccessResp(resp.status)) {
      return resp.data;
    }
  } catch (error) {
  } finally {
    if (hideLoader) hideLoader();
  }
};
export const getCallList = async (showLoader, hideLoader) => {
  try {
    if (showLoader) showLoader(); // Show the loader if function is provided
    const resp = await get(`/call/list-scheduled-calls`);
    if (isSuccessResp(resp?.status)) {
      return resp?.data;
    }
  } catch (error) {
  } finally {
    if (hideLoader) hideLoader();
  }
};

export const getTrainCallBot = async (call_id) => {
  try {
    const response = await get(`/patients/add-call-time-duration?scheduled_id=${call_id}`);
    return response?.data;
  } catch (e) {
    return e.response.data;
  }
};

export const getCalls = async (showLoader, hideLoader, page) => {
  try {
    if (showLoader) showLoader(); // Show the loader if function is provided
    const resp = await get(`/call/get-calls?page=${page}&limit=20`);
    if (isSuccessResp(resp.status)) {
      return resp?.data;
    }
  } catch (error) {
  } finally {
    if (hideLoader) hideLoader();
  }
};

export const getLifeHistory = async (id, showLoader, hideLoader) => {
  console.log("getLifeHistory")
  try {
    if (showLoader) showLoader(); // Show the loader if function is provided
    const resp = await get(`/life-history/get/${id}`);
    if (isSuccessResp(resp.status)) {
      return resp?.data;
    }
  } catch (error) {
  } finally {
    if (hideLoader) hideLoader();
  }
};

export const GetCallDetails = async (body, showLoader, hideLoader) => {
  try {
    if (showLoader) showLoader(); // Show the loader if function is provided
    const response = await get(`/call/get-call-history/${body?.id}?page=${body?.page}&limit=100`);
    return response?.data;
  } catch (e) {
    return e.response.data;
  }
};

export const fetchUserMedia = async (page, rowsPerPage, search, showLoader, hideLoader) => {
  try {
    if (showLoader) showLoader(); // Show the loader if function is provided
    const resp = await get(`/media/get-all-media?page=${page}&limit=${rowsPerPage}${search ? `&name=${search}` : ``}`);
    if (isSuccessResp(resp.status)) {
      return resp?.data;
    }
  } catch (error) {
  } finally {
    if (hideLoader) hideLoader();
  }
};
export const getProfileList = async (showLoader, hideLoader) => {
  try {
    if (showLoader) showLoader(); // Show the loader if function is provided
    const resp = await get(`/carehome/get-detail`);
    if (isSuccessResp(resp.status)) {
      return resp?.data;
    }
  } catch (e) {
    return e.response.data;
  }
};

export const GetMediaDetails = async (body) => {
  try {
    const response = await get(`/call/get-photo-gallery/${body?.id}`);
    return response?.data;
  } catch (e) {
    return e.response.data;
  }
};

export const GetTopics = async () => {
  try {
    const response = await get(`/call/get-topic`);
    return response?.data;
  } catch (e) {
    return e.response?.data;
  }
};

export const getEmotionFeaturesByPatient = async (id, date, showLoader, hideLoader) => {
  try {
    if (showLoader) showLoader(); // Show the loader if function is provided
    const response = await get(`/call/get-emotion-features-by-patient/${id}?date=${date}`);
    if (isSuccessResp(response.status)) {
      return response?.data;
    }
  } catch (e) {
    return e.response.data;
  }
};

export const getNotifications = async (id, showLoader, hideLoader) => {
  try {
    if (showLoader) showLoader(); // Show the loader if function is provided
    const response = await get(`/notification/get-by-id/${id}`);
    if (isSuccessResp(response.status)) {
      return response?.data;
    }
  } catch (e) {
    return e.response.data;
  }
};
