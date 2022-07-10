import React, { Component, ReactElement, useEffect, useState } from "react";
import PrivateRoute from "./helpers/privateRoute";

import "./App.scss";
import { Content } from "carbon-components-react";
import { Redirect, Route, Switch, withRouter } from "react-router";
import { RouteComponentProps } from "react-router/ts4.0";
import Nav from "./components/Nav/Nav"
import CoOpHome from "./components/CoOpHome/CoOpHome";
import Farmers from "./components/Farmers/Farmers";
import Crops from "./components/Crops/Crops";
import FoodTrust from "./components/FoodTrust/FoodTrust";
import { AuthProvider } from "./services/auth";
import UserOnboarding from "./components/Onboarding/UserOnboarding";
import { AddFarmer } from "./components/Farmers/AddFarmer";
import { ViewFarmer } from "./components/Farmers/ViewFarmer";

import {enableAllPlugins} from "immer"
import { Messaging } from "./components/Messaging/Messaging";
import { CropGuidePage } from "./components/Crops/CropGuide/CropGuidePage";
enableAllPlugins();

type AppProps = RouteComponentProps ;
type AppState = {
    // showOnBoardingWizard: boolean;
    showLogoutModal: boolean;
};

function App(props: AppProps) {

    // console.log(props.location);

    const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
    const searchToken = props.location.search.includes("token=") ?  props.location.search.split("token=")[1] : "";
    const [initialToken, setInitialToken] = useState(searchToken);

    useEffect(() => {
        async function load() {
            // We need to detect if this is a new user and redirect them if they are.
            let newUser = false;
            const res = await fetch("/api/coopManager/hasBeenOnBoarded", {});
            if (res.ok) {
                const result = await res.json();
                newUser = !result.exists;
            }
            else {
                // Not Ok and we're probably not authenticated
                newUser = false;
            }
            
            if (newUser) {
                console.log("New User has logged in!");
                props.history.push('/onboarding')
            }
        }
        load();        
    }, []);

    return (
        <>
            <AuthProvider token={initialToken}>                            
                <Nav />
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
                            key={"ViewFarmer"}
                            path={"/farmers/:farmer_id"}
                            exact
                            render={
                                () => 
                                <PrivateRoute>
                                    <ViewFarmer />
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
                            key={"crop-guides"}
                            path={"/crop-guides"}
                            exact
                            render={() => 
                                <PrivateRoute>
                                    <CropGuidePage />
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

export default withRouter(App);
