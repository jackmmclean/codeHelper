import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  hasDemonstratorAuth,
  hasLabLeadAuth,
  register as authregister,
  login as authLogin,
  logout as authLogout,
  isLoggedIn,
  isStudent,
} from "./api/auth";

export const AuthContext = React.createContext({});

export default function Auth({ children }: any) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAStudent, setIsAStudent] = useState(false);
  const [hasDemPrivileges, setHasDemPrivileges] = useState(false);
  const [hasLabLeadPrivileges, setHasLabLeadPrivileges] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    return Promise.all([
      isStudent()
        .then((res: any) => {
          setIsAStudent(res);
        })
        .catch((e) => console.log(e)),
      isLoggedIn()
        .then((res: any) => {
          setIsAuthenticated(res);
        })
        .catch((e) => console.log(e)),
      hasDemonstratorAuth()
        .then((res: any) => {
          setHasDemPrivileges(res);
        })
        .catch((e) => console.log(e)),
      hasLabLeadAuth()
        .then((res: any) => {
          setHasLabLeadPrivileges(res);
        })
        .catch((e) => console.log(e)),
    ]);
  };

  const login = (user: any, pass: any, cbGood: any, cbBad: any) => {
    const newCbGood = (res: any) => {
      checkAuth().then(cbGood(res));
    };
    const newCbBad = (res: any) => {
      checkAuth().then(cbBad(res));
      //cbBad(res);
    };
    authLogin(user, pass, newCbGood, newCbBad);
  };

  const logout = (cb: any) => {
    authLogout((res: any) => {
      setIsAuthenticated(false);
      setHasLabLeadPrivileges(false);
      setHasDemPrivileges(false);
      cb(res);
    });
  };

  const register = (
    user: any,
    usersName: any,
    pass: any,
    cbGood: any,
    cbBad: any
  ) => {
    authregister(user, usersName, pass, cbGood, cbBad);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        hasDemPrivileges,
        hasLabLeadPrivileges,
        isAStudent,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

Auth.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
};
