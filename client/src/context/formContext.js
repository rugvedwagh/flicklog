import { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export const FormProvider = ({ children }) => {
    const [formopen, setformopen] = useState(false);

    return (
        <FormContext.Provider value={{ formopen, setformopen }}>
            {children}
        </FormContext.Provider>
    );
};

export const useForm = () => useContext(FormContext);
