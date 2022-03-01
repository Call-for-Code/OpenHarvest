import React, { Component, FC, ReactElement, useEffect, useState } from "react";
import { PageTitleBar, StatefulPageWizard, PageWizardStep, PageWizardStepTitle, PageWizardStepDescription, PageWizardStepContent, SimpleList } from "carbon-addons-iot-react";
import { useAuth } from "../../services/auth";
import { Button, ComposedModal, InlineLoading, Modal, ModalBody, ModalFooter, ModalHeader, TextInput } from "carbon-components-react";
import { Add16 } from "@carbon/icons-react";
import { getAllOrganisations, Organisation, createOrganisation } from "./../../services/organisation";
import { ModalStateManager } from "../../helpers/ModalStateManager";
import { CoopManager, onboard } from "../../services/coopManager";
import { useHistory } from "react-router-dom";

export default function UserOnboarding() {
    const auth = useAuth();
    const history = useHistory();
    
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [orgs, setOrgs] = useState<Organisation[]>([]);
    const [listOrgs, setListOrgs] = useState<any>([]);

    const [shouldUpdate, setShouldUpdate] = useState(false);

    // User Info State
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [mobile, setMobile] = useState("");
    const [selectedOrg, setSelectedOrg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal Org state
    const [isSubmittingOrg, setIsSubmittingOrg] = useState(false);
    const [submitOrgSuccess, setSubmitOrgSuccess] = useState(false);
    const [orgName, setOrgName] = useState("");

    

    useEffect(() => {
        if (auth.user) {
            setName(auth.user.displayName);
        }
    }, [auth.user])

    useEffect(() => {
        // Check Auth
        if (auth.user === null) {
            // @ts-ignore
            // this.props.history.push('/');

        }

        // set initial state
        setShouldUpdate(false);

        async function load() {
            try {
                const orgs = await getAllOrganisations() 
                setOrgs(orgs);
                const transformed = orgs.map((it, i) => {
                    return {
                        id: it._id,
                        content: {value: it.name},
                        isSelectable: true
                    }
                });
                setListOrgs(transformed);
                setIsLoading(false);
                setShouldUpdate(false);
            }
            catch(e) {
                setError(e as any);
            }
        }
        load();
    }, [shouldUpdate])

    async function createOrg(name: string) {
        setIsLoading(true);
        setIsSubmittingOrg(true)
        const org = await createOrganisation(name);
        setIsSubmittingOrg(false);
        setSubmitOrgSuccess(true);
        setShouldUpdate(true);
    }

    async function createUser() {
        console.log("submitting user");
        console.log(location, mobile, selectedOrg);
        const coopManager: CoopManager = {
            location: location.split(",").map(it => parseFloat(it)),
            mobile
        }
        if (auth.user == undefined) {
            console.log("User not Authenticated");
            return;
        }
        if (selectedOrg == "") {
            console.log("Org not selected!");
            return;
        }
        setIsSubmitting(true);
        const user = await onboard("IBMid", auth.user.id, coopManager, selectedOrg);
        setIsSubmitting(false);
        console.log(user);
        history.push("/home");
    }

    return (
        <div className="w-9/12 mx-auto space-y-10">
            <PageTitleBar
                title={"Welcome to Open Harvest. Let's Get Started"}
                forceContentOutside
                headerMode={"STATIC"}
                collapsed={false}
            />
            
            <div className="pl-[2rem]">
            <StatefulPageWizard 
                currentStepId="step1"
                onClose={() => console.log("Closed")}
                onSubmit={createUser}
                onClearError={() => console.log("clear error")}
                setStep={() => console.log("set Step")}
                sendingData={isSubmitting}
                isClickable
                >
                    <PageWizardStep
                        id="step1"
                        label="Your Details"
                        key="step1"
                        description="Tell us about your location and contact number"
                        onClose={() => console.log("onClose")}
                        onSubmit={() => console.log("onSubmit")}
                        onNext={() => console.log("onNext")}
                        onBack={() => console.log("onBack")}
                    >
                        <PageWizardStepTitle>Your Details</PageWizardStepTitle>
                        <PageWizardStepDescription>
                            Your Details
                        </PageWizardStepDescription>
                        <PageWizardStepContent>
                            <div className="flex flex-col justify-between space-y-10">
                                {/* <p>Your Name (Read only from auth details)</p> */}
                                <TextInput
                                    type="text"
                                    defaultValue={name}
                                    id="name"
                                    labelText="Your Name"
                                    readOnly
                                />
                                <div className="flex flex-row justify-between space-x-5">
                                    {/* <p>Location. Textbox for now, will be a map</p> */}
                                    <TextInput
                                        type="text"
                                        id="location"
                                        labelText="Location"
                                        helperText="latitude,longitude"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                    {/* <p>Mobile contact number</p> */}
                                    <TextInput
                                        type="text"
                                        id="mobile"
                                        labelText="Mobile Number"
                                        helperText="Include a country code"
                                        placeholder="+61459756125"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                        </PageWizardStepContent>
                    </PageWizardStep>

                    <PageWizardStep
                        id="step2"
                        label="Coop Organisation Details"
                        key="step2"
                        description="Which organisation do you want to be part of?"
                        onClose={() => console.log("onClose")}
                        onSubmit={() => console.log("onSubmit")}
                        onNext={() => console.log("onNext")}
                        onBack={() => console.log("onBack")}
                    >
                        <PageWizardStepTitle>Organisation</PageWizardStepTitle>
                        <PageWizardStepDescription>
                            Which organisation do you want to be part of?
                        </PageWizardStepDescription>
                        <PageWizardStepContent>
                            <SimpleList
                                title="Organisation List"
                                hasSearch
                                onSelect={setSelectedOrg}
                                // i18n={{
                                //     searchPlaceHolderText: 'Enter a search',
                                //     pageOfPagesText: (pageNumber) => `Page ${pageNumber}`,
                                // }}
                                buttons={[
                                    <ModalStateManager
                                        key="modal1"
                                        renderLauncher={({ setOpen }) => (
                                            <Button
                                                key="simple-list-header-add"
                                                renderIcon={Add16}
                                                hasIconOnly
                                                size="small"
                                                iconDescription="Add"
                                                onClick={() => setOpen(true)}
                                            />
                                        )}>
                                        {({ open, setOpen }) => (
                                            <ComposedModal
                                            open={open}>
                                                <ModalHeader label="Create an Organisation">
                                                    <h1>
                                                    Create an Organisation
                                                    </h1>
                                                </ModalHeader>
                                                <ModalBody>
                                                    <p style={{ marginBottom: '1rem' }}>
                                                        Creating a Coop Organisation allows you to share your Coop Information
                                                        with Farmers and other Users
                                                    </p>
                                                    <TextInput
                                                        data-modal-primary-focus
                                                        id="text-input-1"
                                                        labelText="Organisation name"
                                                        placeholder="Mchinji Co-Op"
                                                        style={{ marginBottom: '1rem' }}
                                                        value={orgName}
                                                        onChange={(e) => setOrgName(e.target.value)}
                                                    />
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button
                                                        kind="secondary"
                                                        onClick={() => { setOpen(false); }}>
                                                        Cancel
                                                    </Button>
                                                    {isSubmittingOrg || submitOrgSuccess ? (
                                                        <InlineLoading
                                                            style={{ marginLeft: '1rem' }}
                                                            description={submitOrgSuccess ? "Created!" : "Creating..."}
                                                            status={submitOrgSuccess ? 'finished' : 'active'}
                                                            onSuccess={() => {setSubmitOrgSuccess(false);setOpen(false)}}
                                                        />
                                                    ) :  (
                                                        <Button
                                                            kind="primary"
                                                            onClick={() => { createOrg(orgName); }}>
                                                            Add
                                                        </Button>
                                                    )}
                                                    
                                                </ModalFooter>
                                            </ComposedModal>
                                        
                                        )}
                                    </ModalStateManager>
                                    
                                ]}
                                items={listOrgs}
                                isFullHeight
                                pageSize="lg"
                                isLoading={isLoading}
                            />
                        </PageWizardStepContent>
                    </PageWizardStep>
            </StatefulPageWizard>
            </div>
            

        </div>
    )
    
}
