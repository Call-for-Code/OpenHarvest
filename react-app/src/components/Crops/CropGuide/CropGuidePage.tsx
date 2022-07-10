import React, { useState } from 'react'
import { PageTitleBar } from "carbon-addons-iot-react";
import { Tabs, Tab, Checkbox, Button, TextInput } from 'carbon-components-react';
import { CropGuideSettings } from './CropGuideSettings';
import { CropGuideView } from './CropGuideView';
import { getDateFromDayOffset } from '../../../helpers/dateUtils';

export interface Settings {
    keyDates: {
        rainySeasonStart: number;
        effectiveRainsStart: number;
    }
}

/**
 * Page view
 * I'm going to go for a master detail view
 */
export function CropGuidePage() {

    const [settings, setSettings] = useState<Settings>({
        keyDates: {
            effectiveRainsStart: 45,
            rainySeasonStart: 300
        }
    });


    return <div className="flex flex-col">
        <PageTitleBar
            title={"Crop Guides"}
            forceContentOutside
            headerMode={"STATIC"}
            collapsed={false}
        />

        <Tabs>
            <Tab id="tab-1" label="Settings">
                <CropGuideSettings currentSettings={settings} onSettingsUpdate={setSettings} />
            </Tab>
            <Tab id="tab-2" label="Crop Guide Editor">
                <CropGuideView />
            </Tab>
        </Tabs>

    </div>
}

