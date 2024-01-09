import React, { createContext, useState, useContext, ReactNode } from 'react';

type Context = {
  dataPicker: string;
  setDataPicker: Function;

  select: string;
  setSelect: React.Dispatch<React.SetStateAction<string>>;

  count: number;
  setCount: Function;
}

type ContextProps = {
  children: ReactNode;
};

export const Context = createContext({} as Context);

export default function UpdateProvider({ children }: ContextProps) {
  const [dataPicker, setDataPicker] = useState('');
  const [select, setSelect] = useState('Selecione uma categoria');
  const [count, setCount] = useState(0);

  return (
    <Context.Provider
      value={{
        dataPicker,
        setDataPicker,
        select, 
        setSelect,
        count, 
        setCount
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function userDataPicker() {
  const context = useContext(Context);
  const { dataPicker, setDataPicker } = context;
  return {
    dataPicker,
    setDataPicker,
  };
}

export function useSelecCategory() {
  const context = useContext(Context);
  const { select, setSelect } = context;
  return {
    select,
    setSelect,
  };
}

export function userCount() {
  const context = useContext(Context);
  const { count, setCount } = context;
  return {
    count,
    setCount,
  };
}