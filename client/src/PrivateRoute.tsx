import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { AuthContext } from "./Auth";
import routes from "./Routes";

const PrivateRoute = ({
  component: Component,
  componentProps,
  authLevel = "student",
  ...otherProps
}: any) => {
  const {
    //@ts-ignore
    isAuthenticated,
    //@ts-ignore
    hasDemPrivileges,
    //@ts-ignore
    hasLabLeadPrivileges,
    //@ts-ignore
    isAStudent,
  } = useContext(AuthContext);

  var condition: boolean;

  if (authLevel === "demonstrator") {
    condition = hasDemPrivileges;
  } else if (authLevel === "labLead") {
    condition = hasLabLeadPrivileges;
  } else if (authLevel === "student") {
    condition = isAuthenticated;
  } else if (authLevel === "studentOnly") {
    condition = isAStudent;
  } else condition = false;

  //console.log("lab lead privileges::", hasLabLeadPrivileges);
  //console.log("condition", condition);

  return (
    <Route
      {...otherProps}
      render={() =>
        condition ? (
          <Component {...componentProps} />
        ) : (
          <Redirect
            to={otherProps.redirectTo ? otherProps.redirectTo : routes.login}
          />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

export default PrivateRoute;
