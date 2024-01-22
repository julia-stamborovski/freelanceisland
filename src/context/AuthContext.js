import { createContext,useState,useEffect } from "react";
import {getAuth, onAuthStateChanged} from 'firebase/auth'

export const Context = createContext();

export function AuthProvider({children}){
 const auth = getAuth();
 const [user,setUser] = useState();
 const [loading,setLoading] = useState(true)

 useEffect(() => {
   let unsubscribe;
   unsubscribe = onAuthStateChanged(auth, (currentUser) => {
     setLoading(false);
     if (currentUser) {
       const role = currentUser.email.endsWith('@phygitallab.com.br') ? 'admin' : 'client';
       setUser({ ...currentUser, role });
     } else {
       setUser(null);
     }
   });
   return () => {
     if (unsubscribe) unsubscribe();
   };
 }, []);
 const values = {
    user: user,
    setUser: setUser
 }

 return <Context.Provider value={values}>{!loading && children}</Context.Provider>;

}
