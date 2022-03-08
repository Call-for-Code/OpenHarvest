import { ComposedModal, ModalHeader, ModalBody, TextInput, ModalFooter, Button, InlineLoading } from "carbon-components-react";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { Crop } from "../../types/EIS";

export interface CropEditorModalProps {
    crop: Crop;
    isNew?: boolean;
    open: boolean;
    setOpen: (openState: boolean) => void;
}

export function CropEditorModal(props: PropsWithChildren<CropEditorModalProps>) {
    const {open, setOpen} = props;
    const isNew = props.isNew || true;

    return <div>Hello</div>
    // return <ComposedModal
    //     open={open}>
    //         <ModalHeader label="header">
    //             <h1>
    //                 {isNew ? "Plant a Crop" :  "Edit Crop Information"}
    //             </h1>
    //         </ModalHeader>
    //         <ModalBody>
    //             <p style={{ marginBottom: '1rem' }}>
    //                 {isNew ? 
    //                     "Create a new Crop"
    //                     :
    //                     "Edit this Crop"}
    //             </p>
    //             <TextInput
    //                 data-modal-primary-focus
    //                 id="text-input-1"
    //                 labelText="Organisation name"
    //                 placeholder="Mchinji Co-Op"
    //                 style={{ marginBottom: '1rem' }}
    //                 value={orgName}
    //                 onChange={(e) => setOrgName(e.target.value)}
    //             />
    //         </ModalBody>
    //         <ModalFooter>
    //             <Button
    //                 kind="secondary"
    //                 onClick={() => { setOpen(false); }}>
    //                 Cancel
    //             </Button>
    //             {isSubmittingOrg || submitOrgSuccess ? (
    //                 <InlineLoading
    //                     style={{ marginLeft: '1rem' }}
    //                     description={submitOrgSuccess ? "Created!" : "Creating..."}
    //                     status={submitOrgSuccess ? 'finished' : 'active'}
    //                     onSuccess={() => {setSubmitOrgSuccess(false);setOpen(false)}}
    //                 />
    //             ) :  (
    //                 <Button
    //                     kind="primary"
    //                     onClick={() => { createOrg(orgName); }}>
    //                     Add
    //                 </Button>
    //             )}
                
    //         </ModalFooter>
    //     </ComposedModal>
}

