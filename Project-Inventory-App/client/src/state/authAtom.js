import { atom } from 'jotai';
import { jwtDecode } from 'jwt-decode';

// This is where the Access Token lives in memory
export const accessTokenAtom = atom(null);

// Optional: A derived atom to check if we are "logged in"
export const isAuthenticatedAtom = atom((get) => !!get(accessTokenAtom));

export const userAtom = atom((get) => {
  const token = get(accessTokenAtom);
  if (!token) return null;
  
  try {
    return jwtDecode(token); // This returns your { id, email, name, etc. }
  } catch (err) {
    console.log(err)
    return null;
  }
});