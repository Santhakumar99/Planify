import { createContext, useContext, useState } from "react";
import LoaderOverlay from "./LoaderOverlay";

const LoadingContext = createContext();
export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
            <LoaderOverlay loading={loading} />
        </LoadingContext.Provider>
    );
};
