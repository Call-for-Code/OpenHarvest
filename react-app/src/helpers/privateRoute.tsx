import React, { PropsWithChildren } from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "./../services/auth";

const PrivateRoute = ({ children }: PropsWithChildren<any>) => {
 const auth = useAuth();

 console.log("Accessing Private Route");

 return auth.isLoggedIn ? children : <Redirect to="/" />;
};

export default PrivateRoute;