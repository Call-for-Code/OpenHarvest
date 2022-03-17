import React, { useState } from "react";
import { Header, HeaderGlobalAction, HeaderGlobalBar, HeaderMenu, HeaderMenuItem, HeaderName, HeaderNavigation, HeaderPanel, SkipToContent } from "carbon-components-react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { Login32, Logout32, UserAvatar32 } from "@carbon/icons-react";
import { useAuth } from "../../services/auth";

export default function Nav() {
    const auth = useAuth();

    const [expanded, setExpanded] = useState(false);

    const toggleRightPanel = () => {
        setExpanded(!expanded);
    };

    return (
        // @ts-ignore
        <Header aria-label="IBM Platform Name">
            <SkipToContent />
            <HeaderName href="/" prefix="IBM">
                <span>Open Harvest</span>
                <div className={"iot--header__subtitle"}>
                Co-op
                </div>
            </HeaderName>

            <HeaderNavigation aria-label="IBM Open Harvest">
                <HeaderMenuItem<NavLinkProps> element={NavLink} to="/home">Home</HeaderMenuItem>
                <HeaderMenuItem<NavLinkProps> element={NavLink} to="/farmers">Farmers</HeaderMenuItem>
                <HeaderMenuItem<NavLinkProps> element={NavLink} to="/crops">Crops</HeaderMenuItem>
                <HeaderMenuItem<NavLinkProps> element={NavLink} to="/messaging">Messaging</HeaderMenuItem>
            </HeaderNavigation>

            <HeaderGlobalBar>
                {!auth.user && (
                    <HeaderGlobalAction aria-label="Login" onClick={() => auth.login()}>
                        <Login32 />
                    </HeaderGlobalAction>
                )}

                {!!auth.user && (
                    <>
                        {/* // Displays when the user is onboarded */}
                        {auth.user.coopManager && (
                            <HeaderMenu menuLinkName={"Organisation: " + auth.user!!.selectedOrganisation!!.name}>
                                {auth.user!!.organisations!!.map(it => 
                                    <HeaderMenuItem key={it.name}>{it.name}</HeaderMenuItem>
                                )}                                
                            </HeaderMenu>
                        )}
                        <HeaderGlobalAction aria-label="Account" isActive={expanded} onClick={toggleRightPanel}>
                            <UserAvatar32 />
                        </HeaderGlobalAction>
                        <HeaderGlobalAction aria-label="Logout" onClick={() => auth.signout()}>
                            <Logout32 />
                        </HeaderGlobalAction>
                        <HeaderPanel aria-label="Header Panel" expanded={expanded} >
                            <h3>Hi {auth.user!!.displayName}</h3>
                        </HeaderPanel>
                        
                    </>
                )}
                
            </HeaderGlobalBar>

            

        </Header>
    )
}