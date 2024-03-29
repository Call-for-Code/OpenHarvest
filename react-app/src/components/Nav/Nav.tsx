import React, { useState } from "react";
import { Header, HeaderContainer, HeaderGlobalAction, HeaderGlobalBar, HeaderMenu, HeaderMenuButton, HeaderMenuItem, HeaderName, HeaderNavigation, HeaderPanel, HeaderSideNavItems, SideNav, SideNavItems, SkipToContent } from "carbon-components-react";
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
        <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
            <Header aria-label="IBM Open Harvest">
                <SkipToContent />
                <HeaderMenuButton
                    aria-label="Open menu"
                    onClick={onClickSideNavExpand}
                    isActive={isSideNavExpanded}
                />
                <HeaderName href="/" prefix="IBM">
                    <span>Open Harvest</span>
                    {/* <div className={"iot--header__subtitle"}>
                        Co-op
                    </div> */}
                </HeaderName>

                <HeaderNavigation aria-label="Open Harvest">
                    <HeaderMenuItem<NavLinkProps> element={NavLink} to="/home">Home</HeaderMenuItem>
                    {auth.isLoggedIn && (
                        <>
                            <HeaderMenuItem<NavLinkProps> element={NavLink} to="/farmers">Farmers</HeaderMenuItem>
                            <HeaderMenuItem<NavLinkProps> element={NavLink} to="/crops">Crops</HeaderMenuItem>
                            <HeaderMenuItem<NavLinkProps> element={NavLink} to="/messaging">Messaging</HeaderMenuItem>
                            <HeaderMenuItem<NavLinkProps> element={NavLink} to="/foodTrust">Food Trust</HeaderMenuItem>
                        </>
                    )}
                    
                </HeaderNavigation>

                <SideNav
                aria-label="Side navigation"
                expanded={isSideNavExpanded}
                isPersistent={false}>
                    <SideNavItems>
                        <HeaderSideNavItems>
                            <HeaderMenuItem<NavLinkProps> element={NavLink} to="/home">Home</HeaderMenuItem>
                            {auth.isLoggedIn && (
                                <>
                                    <HeaderMenuItem<NavLinkProps> element={NavLink} to="/farmers">Farmers</HeaderMenuItem>
                                    <HeaderMenuItem<NavLinkProps> element={NavLink} to="/crops">Crops</HeaderMenuItem>
                                    <HeaderMenuItem<NavLinkProps> element={NavLink} to="/messaging">Messaging</HeaderMenuItem>
                                </>
                            )}
                        </HeaderSideNavItems>
                    </SideNavItems>
                </SideNav>

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
        )}/>        
    )
}
