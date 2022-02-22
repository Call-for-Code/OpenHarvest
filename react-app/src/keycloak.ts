import Keycloak from "keycloak-js";

const keycloak = Keycloak({
 url: "http://localhost:8080/",
 realm: "OpenHarvest",
 clientId: "OpenHarvest",
});

export default keycloak;