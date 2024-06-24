import { createDb } from "@/database/database";
import { RxDatabase } from "rxdb";
import {
  Accessor,
  createContext,
  createSignal,
  FlowComponent,
  onMount,
  useContext,
} from "solid-js";

// ===========================================================================
// Context
// ===========================================================================

export type RxDBContextValue = {
  db: Accessor<RxDatabase | null>;
};

const RxDBContext = createContext({
  db: () => null,
} as RxDBContextValue);

// ===========================================================================
// Hook
// ===========================================================================
export const useRxDBContext = () => useContext(RxDBContext);

// ===========================================================================
// Provider
// ===========================================================================
export const RxDBContextProvider: FlowComponent = (props) => {
  const [db, setDb] = createSignal<RxDatabase | null>(null);

  onMount(async () => {
    const db = await createDb();
    setDb(db);
  });

  return (
    <RxDBContext.Provider
      value={{
        db,
      }}
    >
      {props.children}
    </RxDBContext.Provider>
  );
};
