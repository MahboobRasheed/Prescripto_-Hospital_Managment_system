import { createContext } from "react";
import { doctors } from "../assets/assets_frontend/assets";
export const AppContext = createContext(); // ✅ Named Export

const AppContextProvider = (props) => {
  const currencySymbol = 'Rs'
  const value = {
     doctors,
     currencySymbol

     }; // Providing doctors data in context

  return (
    <AppContext.Provider value={{ doctors }}>
    {props.children}
  </AppContext.Provider>
  
  );
};

export default AppContextProvider;
