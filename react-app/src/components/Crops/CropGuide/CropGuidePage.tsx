import React, { useState } from 'react'
import { PageTitleBar } from "carbon-addons-iot-react";
import { Tabs, Tab, Checkbox, Button, TextInput } from 'carbon-components-react';
/**
 * Page view
 * I'm going to go for a master detail view
 */
export function CropGuidePage() {

    return <div className="flex flex-col">
        <PageTitleBar
            title={"Crop Guides"}
            forceContentOutside
            headerMode={"STATIC"}
            collapsed={false}
        />

        <div className="flex flex-row h-[calc(100vh-96px)]">
            {/* <Tabs>
                <TabList aria-label="List of tabs">
                    <Tab>Tab Label 1</Tab>
                    <Tab>Tab Label 2</Tab>
                    <Tab disabled>Tab Label 3</Tab>
                    <Tab>Tab Label 4 with a very long long label</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>Tab Panel 1</TabPanel>
                    <TabPanel>
                        <form style={{ margin: '2em' }}>
                        <legend className={`cds--label`}>Validation example</legend>
                        <Checkbox id="cb" labelText="Accept privacy policy" />
                        <Button
                            style={{ marginTop: '1rem', marginBottom: '1rem' }}
                            type="submit">
                            Submit
                        </Button>
                        <TextInput
                            type="text"
                            labelText="Text input label"
                            helperText="Optional help text"
                        />
                        </form>
                    </TabPanel>
                    <TabPanel>Tab Panel 3</TabPanel>
                    <TabPanel>Tab Panel 4</TabPanel>
                </TabPanels>
            </Tabs> */}

        </div>
    </div>
}

