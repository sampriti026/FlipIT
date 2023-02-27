import { createContext, useState } from "react";

export const ListContext = createContext();

export const ListContextProvider = (props) => {
  const initialValues = {
    account: "",
    website: "",
    about: "",
    summary: "",
    profit: "",
    revenue: "",
    sources: "",
    expenses: "",
    deal: "",
    price: "",
    contract: "",
  };
 
  const [values, setValues] = useState(initialValues);

  const listContext = {
    initialValues,
    values,
    setValues,
  };

  return (
    <ListContext.Provider value={listContext}>
      {props.children}
    </ListContext.Provider>
  );
};
