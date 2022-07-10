import { Button, InlineLoading, TextInput } from "carbon-components-react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { dateOffsetToInputString, dateToDateInputString, getDayOffsetFromDate } from "../../../helpers/dateUtils";
import { Settings } from "./CropGuidePage";

export interface CropGuideSettingsProps {
    currentSettings: Settings;
    onSettingsUpdate: (settings: Settings) => void;
}

export function CropGuideSettings(props: CropGuideSettingsProps) {
    const [saveSuccess, setSaveSuccess] = useState(false);




    return <div>
        <h2>Key Dates</h2>
        Start of the Rainy Season
        First Effective Rains

        <Formik
            initialValues={
                { 
                    rainySeasonStart: dateOffsetToInputString(props.currentSettings.keyDates.rainySeasonStart),
                    effectiveRainsStart: dateOffsetToInputString(props.currentSettings.keyDates.effectiveRainsStart)
                }}
            validate={values => {
                const errors: any = {};
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                const update: Settings = {
                    keyDates: {
                        effectiveRainsStart: getDayOffsetFromDate(new Date(values.effectiveRainsStart)),
                        rainySeasonStart: getDayOffsetFromDate(new Date(values.rainySeasonStart)),
                    }
                }
                console.log(values, update);
                props.onSettingsUpdate(update);
                setSubmitting(false);
                setSaveSuccess(true);
            }}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                /* and other goodies */
            }) => (
                <form onSubmit={handleSubmit}>
                    <TextInput
                        type="date"
                        name="rainySeasonStart"
                        id="rainySeasonStart"
                        labelText="Start of the Rainy Season"
                        invalid={!!(errors.rainySeasonStart && touched.rainySeasonStart && errors.rainySeasonStart)}
                        invalidText={errors.rainySeasonStart && touched.rainySeasonStart && errors.effectiveRainsStart}
                        required
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.rainySeasonStart}
                    />
                    <TextInput
                        type="date"
                        name="effectiveRainsStart"
                        id="effectiveRainsStart"
                        labelText="Effective Start of the Rainy Season"
                        invalid={!!(errors.effectiveRainsStart && touched.effectiveRainsStart && errors.effectiveRainsStart)}
                        invalidText={errors.effectiveRainsStart && touched.effectiveRainsStart && errors.effectiveRainsStart}
                        required
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.effectiveRainsStart}
                    />

                    {isSubmitting || saveSuccess ? (
                        <InlineLoading
                            style={{ marginLeft: '1rem' }}
                            description={saveSuccess ? "Saved!" : "Saving..."}
                            status={saveSuccess ? 'finished' : 'active'}
                            onSuccess={() => {setSaveSuccess(false)}}
                        />
                    ) :  (
                        <Button
                            kind="primary"
                            type="submit">
                            Save
                        </Button>
                    )}
                </form>
            )}
        </Formik>
    </div>
}
