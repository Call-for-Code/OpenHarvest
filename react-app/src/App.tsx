import React, { Component, ReactElement } from "react";
import "carbon-addons-iot-react/scss/styles.scss";
import PrivateRoute from "./helpers/privateRoute";

import "./App.scss";
import { Content, Header, HeaderContainer, HeaderMenuItem, HeaderName, HeaderNavigation, SkipToContent } from "carbon-components-react";
import { Redirect, Route, Switch, withRouter } from "react-router";
import { RouteComponentProps } from "react-router/ts4.0";
import Nav from "./components/Nav/Nav"
import CoOpHome from "./components/CoOpHome/CoOpHome";
import Farmers from "./components/Farmers/Farmers";
import Crops from "./components/Crops/Crops";
import FoodTrust from "./components/FoodTrust/FoodTrust";
import { AuthContext, AuthProvider } from "./services/auth";
import UserOnboarding from "./components/Onboarding/UserOnboarding";
import { AddFarmer } from "./components/Farmers/AddFarmer";

import {enableAllPlugins} from "immer"
import { Messaging } from "./components/Messaging/Messaging";
enableAllPlugins();

type AppProps = RouteComponentProps ;
type AppState = {
    // showOnBoardingWizard: boolean;
    showLogoutModal: boolean;
};

class App extends Component<AppProps, AppState> {

    constructor(props: any) {
        super(props);
        console.log(props.location);
        this.state = {
            // showOnBoardingWizard: false,
            showLogoutModal: false
        };
        this.setShowLogoutModal = this.setShowLogoutModal.bind(this);

        
    }

    async componentDidMount() {
        // We need to detect if this is a new user and redirect them if they are.
        let newUser = true;
        try {
            const res = await fetch("/api/coopManager/hasBeenOnBoarded");
            const result = await res.json();
            newUser = result.exists;
        }
        catch (e) {}
        
        if (newUser) {
            // this.state = {
            //     // showOnBoardingWizard: true,
            //     showLogoutModal: false
            // };
            this.props.history.push('/onboarding')
        }
    }

    render(): ReactElement {

        return (
            <>
                <AuthProvider>
                    <HeaderContainer
                        render={({ isSideNavExpanded, onClickSideNavExpand }) => (                            
                            <Nav />
                        )}
                    />

                    <Content className="main-content">
                        <Switch>
                            <Route exact path="/" >
                                <Redirect to={"/home"}/>
                            </Route>
                            <Route
                                key={"onboarding"}
                                path={"/onboarding"}
                                exact
                                render={() => <UserOnboarding />}
                            />
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
                                render={
                                    () => 
                                    <PrivateRoute>
                                        <Farmers />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                key={"AddFarmer"}
                                path={"/farmers/add"}
                                exact
                                render={
                                    () => 
                                    <PrivateRoute>
                                        <AddFarmer />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                key={"crops"}
                                path={"/crops"}
                                exact
                                render={() => 
                                    <PrivateRoute>
                                        <Crops />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                key={"messaging"}
                                path={"/messaging"}
                                exact
                                render={() => 
                                    <PrivateRoute>
                                        <Messaging />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                key={"foodTrust"}
                                path={"/foodTrust"}
                                exact
                                render={() => 
                                    <PrivateRoute>
                                        <FoodTrust />
                                    </PrivateRoute>
                                }
                            />

                        </Switch>
                    </Content>
                </AuthProvider>
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
