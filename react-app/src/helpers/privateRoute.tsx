import React, { PropsWithChildren } from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "./../services/auth";

const PrivateRoute = ({ children }: PropsWithChildren<any>) => {
 const authInfo = useAuth();

 const isLoggedIn = authInfo !== null;

 console.log("Accessing Private Route");

 return isLoggedIn ? children : <Redirect to="/" />;
};

export default PrivateRoute;