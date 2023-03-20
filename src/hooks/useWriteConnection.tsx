import { createContext, useContext } from 'react';
import { Connection } from '@solana/web3.js';
import React, { useMemo } from 'react';

export interface WriteConnectionContextState {
  connection: Connection;
}

export const WriteConnectionContext = createContext<WriteConnectionContextState>({} as WriteConnectionContextState);

export function useWriteConnection(): WriteConnectionContextState {
  return useContext(WriteConnectionContext);
}

export const WriteConnectionProvider = ({ children, endpoint, config }) => {
  const connection = useMemo(() => new Connection(endpoint, config), [endpoint, config]);
  return React.createElement(WriteConnectionContext.Provider, { value: { connection } }, children);
};
