// CarehomeSentimentContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchCarehomePatientSentimentData } from "../api/axiosApis/get";

const CarehomeSentimentContext = createContext();

export const useCarehomeSentiment = () => {
  return useContext(CarehomeSentimentContext);
};

export const CarehomeSentimentProvider = ({ children }) => {
  const [sentimentData, setSentimentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSentimentData = async (carehomeId) => {
    try {
      setLoading(true);
      const data = await fetchCarehomePatientSentimentData(carehomeId);
      setSentimentData(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    const carehomeId = authUser?.user_info?.id;
    if (carehomeId) {
      fetchSentimentData(carehomeId);
    }
  }, []);

  return (
    <CarehomeSentimentContext.Provider value={{ sentimentData, loading, error }}>
      {children}
    </CarehomeSentimentContext.Provider>
  );
};
