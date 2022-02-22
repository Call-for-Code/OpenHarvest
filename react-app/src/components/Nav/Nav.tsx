import React, { useState } from "react";
import { Header, HeaderGlobalAction, HeaderGlobalBar, HeaderMenuItem, HeaderName, HeaderNavigation, HeaderPanel, SkipToContent } from "carbon-components-react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { Login32, Logout32, UserAvatar32 } from "@carbon/icons-react";

export default function Nav() {
    const { keycloak, initialized } = useKeycloak();

    const [expanded, setExpanded] = useState(false);

    const toggleRightPanel = () => {
        setExpanded(!expanded);
    };

    return (
        // @ts-ignore
        <Header aria-label="IBM Platform Name">
            <SkipToContent />
            <HeaderName href="#" prefix="IBM">
                <span>Open Harvest</span>
                <div className={"iot--header__subtitle"}>
                Co-op
                </div>
            </HeaderName>

            <HeaderNavigation aria-label="IBM Open Harvest">
                <HeaderMenuItem<NavLinkProps> element={NavLink} to="/home">Home</HeaderMenuItem>
                <HeaderMenuItem<NavLinkProps> element={NavLink} to="/farmers">Farmers</HeaderMenuItem>
                <HeaderMenuItem<NavLinkProps> element={NavLink} to="/crops">Crops</HeaderMenuItem>
            </HeaderNavigation>

            <HeaderGlobalBar>
                {!keycloak.authenticated && (
                    <HeaderGlobalAction aria-label="Login" onClick={() => keycloak.login()}>
                        <Login32 />
                    </HeaderGlobalAction>
                )}

                {!!keycloak.authenticated && (
                    <>
                        <HeaderGlobalAction aria-label="Account" isActive={expanded} onClick={toggleRightPanel}>
                            <UserAvatar32 />
                        </HeaderGlobalAction>
                        <HeaderGlobalAction aria-label="Logout" onClick={() => keycloak.logout()}>
                            <Logout32 />
                        </HeaderGlobalAction>
                        <HeaderPanel aria-label="Header Panel" expanded={expanded} >
                            <h3>Hi {keycloak.tokenParsed!!.preferred_username}</h3>
                        </HeaderPanel>
                        
                    </>
                )}
                
            </HeaderGlobalBar>

            

        </Header>
    )
}