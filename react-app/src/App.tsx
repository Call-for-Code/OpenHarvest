import React, { Component, ReactElement } from "react";

import "carbon-addons-iot-react/scss/styles.scss";
import "./App.scss";
import { Content, Header, HeaderContainer, HeaderMenuItem, HeaderName, HeaderNavigation, SkipToContent } from "carbon-components-react";
import { Redirect, Route, Switch, withRouter } from "react-router";
import CoOpHome from "./components/CoOpHome/CoOpHome";
import Farmers from "./components/Farmers/Farmers";
import { NavLink, NavLinkProps } from "react-router-dom";
import { RouteComponentProps } from "react-router/ts4.0";
import Crops from "./components/Crops/Crops";

type AppProps = RouteComponentProps ;
type AppState = {
    showLogoutModal: boolean;
};

class App extends Component<AppProps, AppState> {

    constructor(props: any) {
        super(props);
        console.log(props.location);
        this.state = {
            showLogoutModal: false
        };
        this.setShowLogoutModal = this.setShowLogoutModal.bind(this);
    }

    render(): ReactElement {

        return (
            <>


                <HeaderContainer
                    render={({ isSideNavExpanded, onClickSideNavExpand }) => (
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

                        </Header>

                    )}
                />

                <Content className={"main-content"}>
                    <Switch>
                        <Route exact path="/" >
                            <Redirect to={"/home"}/>
                        </Route>
                        <Route
                            key={"home"}
                            path={"/home"}
                            exact
                            render={() => <CoOpHome />}
                        />
                        <Route
                            key={"farmers"}
                            path={"/farmers"}
                            exact
                            render={() => <Farmers />}
                        />
                        <Route
                            key={"crops"}
                            path={"/crops"}
                            exact
                            render={() => <Crops />}
                        />

                    </Switch>
                </Content>
            </>

        );

    }

    private setShowLogoutModal(): void {
        this.setState({
            showLogoutModal: true
        });
    }



}

export default withRouter(App);
