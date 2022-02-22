import { PropsWithChildren } from "react";
import { useKeycloak } from "@react-keycloak/web";

const PrivateRoute = ({ children }: PropsWithChildren<any>) => {
 const { keycloak } = useKeycloak();

 const isLoggedIn = keycloak.authenticated;

 console.log("Accessing Private Route");

 return isLoggedIn ? children : null;
};

export default PrivateRoute;