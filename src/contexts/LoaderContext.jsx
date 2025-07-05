import React, { createContext, useContext, useState } from "react";
import LoaderWithLogo from "../components/Loader/LoaderWithLogo";


const LoaderContext = createContext();

// LoaderProvider wraps your app and provides loader functions
export function LoaderProvider({ children }) {
    const [loading, setLoading] = useState(false);

    const showLoader = () => setLoading(true);
    const hideLoader = () => setLoading(false);

    return (
        <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
            {loading && <LoaderWithLogo />} {/* Global Loader */}
            {children}
        </LoaderContext.Provider>
    );
}

// Custom hook to use the LoaderContext
export function useLoader() {
    return useContext(LoaderContext);
}
