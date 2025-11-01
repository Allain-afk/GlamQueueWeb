import { createContext } from 'react';
import type { Ctx } from './AuthContext';

export const AuthContext = createContext<Ctx | undefined>(undefined);

