const today = new Date()
const dateArray = today.toString().split(" ")
let month = today.getMonth()
const date = today.getDate()
const eventTime = today.getFullYear() + "-" + ((month < 10) ? ("0" + month) : (month)) + "-" + ((date < 10) ? ("0" + date) : (date)) + "T" + dateArray[4] +"Z"
const expirationDate = today.getFullYear() + "-" + ((month < 10) ? ("0" + month) : (month)) + "-" + ((date < 10) ? ("0" + date) : (date))
const timeZoneOffset= today.getTimezoneOffset() / 60
let timeZone = (timeZoneOffset < 10) ? ("0" + timeZoneOffset + ":00") : (timeZoneOffset + ":00")

export const lotCommissionXML = (paramMap: any) => {
    const epcClass = paramMap.product.replace(":class", `:${paramMap.packingIdType}:class`) + "." + paramMap.packingIdNumber
    return (
        `<ns3:EPCISDocument schemaVersion="1.2" creationDate="2022-04-27T15:24:29.912Z"
        xmlns:ns2="urn:epcglobal:cbv:mda"
        xmlns:ns3="urn:epcglobal:epcis:xsd:1">
        <EPCISBody>
                <EventList>
                        <ObjectEvent>
                                <eventTime>${eventTime}</eventTime>
                                <eventTimeZoneOffset>${timeZone}</eventTimeZoneOffset>
                                <baseExtension>
                                        <eventID></eventID>
                                </baseExtension>
                                <epcList/>
                                <action>${paramMap.eventType}</action>
                                <bizStep>${paramMap.businessEvent}</bizStep>
                                <bizLocation>
                                        <id>${paramMap.businessLocation}</id>
                                </bizLocation>
                                <extension>
                                        <quantityList>
                                                <quantityElement>
                                                        <epcClass>${epcClass}</epcClass>
                                                        <quantity>${paramMap.quantity}</quantity>
                                                        <uom>${paramMap.unitsOfMeasure}</uom>
                                                </quantityElement>
                                        </quantityList>
                                        <sourceList>
                                                <source type="urn:epcglobal:cbv:sdt:owning_party">${paramMap.businessLocation}</source>
                                        </sourceList>
                                        <destinationList>
                                                <destination type="urn:epcglobal:cbv:sdt:owning_party">${paramMap.businessLocation}</destination>
                                        </destinationList>
                                        <ilmd>
                                                <ns2:bestBeforeDate>${expirationDate}</ns2:bestBeforeDate>
                                                <ns2:farmList>
                                                        <ns2:farm>
                                                                <ns2:farmIdentification>${paramMap.businessLocation}</ns2:farmIdentification>
                                                                <ns2:farmIdentificationTypeCode>EPC-GLN</ns2:farmIdentificationTypeCode>
                                                        </ns2:farm>
                                                </ns2:farmList>
                                                <ns2:itemExpirationDate>${expirationDate}</ns2:itemExpirationDate>
                                                <ns2:lotNumber>${paramMap.packingIdNumber}</ns2:lotNumber>
                                                <ns2:sellByDate>${expirationDate}</ns2:sellByDate>
                                        </ilmd>
                                </extension>
                        </ObjectEvent>
                </EventList>
        </EPCISBody>
    </ns3:EPCISDocument>`
    )
}

export const serialAndPalletCommissionXML = (paramMap: any) => {
    const epcClass = paramMap.product.replace(":class", `:${paramMap.packingIdType}:class`) + "." + paramMap.packingIdNumber
    return (
        `<ns3:EPCISDocument schemaVersion="1.2" creationDate="2022-04-28T20:19:18.784Z"
        xmlns:ns2="urn:epcglobal:cbv:mda"
        xmlns:ns3="urn:epcglobal:epcis:xsd:1">
        <EPCISBody>
                <EventList>
                        <ObjectEvent>
                                <eventTime>${eventTime}</eventTime>
                                <eventTimeZoneOffset>${timeZone}</eventTimeZoneOffset>
                                <baseExtension>
                                        <eventID></eventID>
                                </baseExtension>
                                <epcList/>
                                <action>${paramMap.eventType}</action>
                                <bizStep>${paramMap.businessEvent}</bizStep>
                                <bizLocation>
                                        <id>${paramMap.businessLocation}</id>
                                </bizLocation>
                                <extension>
                                        <quantityList>
                                                <quantityElement>
                                                        <epcClass>${epcClass}</epcClass>
                                                        <quantity>${paramMap.quantity}</quantity>
                                                        <uom>${paramMap.unitsOfMeasure}</uom>
                                                </quantityElement>
                                        </quantityList>
                                        <sourceList>
                                                <source type="urn:epcglobal:cbv:sdt:owning_party">${paramMap.businessLocation}</source>
                                        </sourceList>
                                        <destinationList>
                                                <destination type="urn:epcglobal:cbv:sdt:owning_party">${paramMap.businessLocation}</destination>
                                        </destinationList>
                                        <ilmd>
                                                <ns2:bestBeforeDate>2022-04-30T00:00:00Z</ns2:bestBeforeDate>
                                                <ns2:farmList>
                                                        <ns2:farm>
                                                                <ns2:farmIdentification>${paramMap.businessLocation}</ns2:farmIdentification>
                                                                <ns2:farmIdentificationTypeCode>EPC-GLN</ns2:farmIdentificationTypeCode>
                                                        </ns2:farm>
                                                </ns2:farmList>
                                                <ns2:itemExpirationDate>${expirationDate}/ns2:itemExpirationDate>
                                                <ns2:lotNumber>${paramMap.packingIdNumber}</ns2:lotNumber>
                                                <ns2:sellByDate>${expirationDate}</ns2:sellByDate>
                                        </ilmd>
                                </extension>
                        </ObjectEvent>
                </EventList>
        </EPCISBody>
        </ns3:EPCISDocument>`
    )
}

export const lotObservationXML = (paramMap: any) => {
    const epcClass = paramMap.product.replace(":class", `:${paramMap.packingIdType}:class`) + "." + paramMap.packingIdNumber
    return (
        `<ns3:EPCISDocument schemaVersion="1.2" creationDate="2022-04-27T15:24:30.284Z"
        xmlns:ns2="urn:epcglobal:cbv:mda"
        xmlns:ns3="urn:epcglobal:epcis:xsd:1">
        <EPCISBody>
                <EventList>
                        <ObjectEvent>
                                <eventTime>${eventTime}</eventTime>
                                <eventTimeZoneOffset>${timeZone}</eventTimeZoneOffset>
                                <baseExtension>
                                        <eventID></eventID>
                                </baseExtension>
                                <epcList/>
                                <action>${paramMap.eventType}</action>
                                <bizStep>${paramMap.businessEvent}</bizStep>
                                <bizLocation>
                                        <id>${paramMap.businessLocation}</id>
                                </bizLocation>
                                <extension>
                                        <quantityList>
                                                <quantityElement>
                                                        <epcClass>${epcClass}</epcClass>
                                                        <quantity>${paramMap.quantity}</quantity>
                                                        <uom>${paramMap.unitsOfMeasure}</uom>
                                                </quantityElement>
                                        </quantityList>
                                        <sourceList>
                                                <source type="urn:epcglobal:cbv:sdt:owning_party">${paramMap.businessLocation}</source>
                                        </sourceList>
                                        <destinationList>
                                                <destination type="urn:epcglobal:cbv:sdt:owning_party">${paramMap.businessLocation}</destination>
                                        </destinationList>
                                </extension>
                        </ObjectEvent>
                </EventList>
        </EPCISBody>
        </ns3:EPCISDocument>`
    )
}

export const serialAndPalletObservationXML= (paramMap: any) => {
    const epcClass = paramMap.product.replace(":class", `:${paramMap.packingIdType}:class`) + "." + paramMap.packingIdNumber
    return (
        `<ns3:EPCISDocument schemaVersion="1.2" creationDate="2022-04-28T20:19:19.118Z"
        xmlns:ns2="urn:epcglobal:cbv:mda"
        xmlns:ns3="urn:epcglobal:epcis:xsd:1">
        <EPCISBody>
                <EventList>
                        <ObjectEvent>
                                <eventTime>2022-04-27T12:00:00Z</eventTime>
                                <eventTimeZoneOffset>-05:00</eventTimeZoneOffset>
                                <baseExtension>
                                        <eventID></eventID>
                                </baseExtension>
                                <epcList/>
                                <action>${paramMap.eventType}</action>
                                <bizStep>${paramMap.businessEvent}</bizStep>
                                <bizLocation>
                                        <id>${paramMap.businessLocation}</id>
                                </bizLocation>
                                <extension>
                                        <quantityList>
                                                <quantityElement>
                                                        <epcClass>${epcClass}</epcClass>
                                                        <quantity>${paramMap.quantity}</quantity>
                                                        <uom>${paramMap.unitOfMeasure}</uom>
                                                </quantityElement>
                                        </quantityList>
                                        <sourceList>
                                                <source type="urn:epcglobal:cbv:sdt:owning_party">${paramMap.businessLocation}</source>
                                        </sourceList>
                                        <destinationList>
                                                <destination type="urn:epcglobal:cbv:sdt:owning_party">${paramMap.businessLocation}</destination>
                                        </destinationList>
                                </extension>
                        </ObjectEvent>
                </EventList>
        </EPCISBody>
        </ns3:EPCISDocument>`
    )
}

export const transformationXML = (paramMap: any) => {
    const epcClass = paramMap.product.replace(":class", `:${paramMap.packingIdType}:class`) + "." + paramMap.packingIdNumber
    return (
        `<ns3:EPCISDocument schemaVersion="1.2" creationDate="2022-04-27T15:24:32.338Z"
        xmlns:ns2="urn:epcglobal:cbv:mda"
        xmlns:ns3="urn:epcglobal:epcis:xsd:1">
        <EPCISBody>
                <EventList>
                        <extension>
                                <TransformationEvent>
                                        <eventTime>${eventTime}</eventTime>
                                        <eventTimeZoneOffset>${timeZone}</eventTimeZoneOffset>
                                        <baseExtension>
                                                <eventID></eventID>
                                        </baseExtension>
                                        <inputQuantityList>
                                                <quantityElement>
                                                    <epcClass>${epcClass}</epcClass>
                                                    <quantity>${paramMap.quantity}</quantity>
                                                    <uom>${paramMap.unitsOfMeasure}</uom>
                                                </quantityElement>
                                        </inputQuantityList>
                                        <outputQuantityList>
                                                <quantityElement>
                                                    <epcClass>${epcClass}</epcClass>
                                                    <quantity>${paramMap.quantity}</quantity>
                                                    <uom>${paramMap.unitsOfMeasure}</uom>
                                                </quantityElement>
                                        </outputQuantityList>
                                        <bizStep>${paramMap.businessEvent}</bizStep>
                                        <bizLocation>
                                                <id>${paramMap.businessLocation}</id>
                                        </bizLocation>
                                        <extension>
                                                <sourceList>
                                                        <source type="urn:epcglobal:cbv:sdt:owning_party">${paramMap.businessLocation}</source>
                                                </sourceList>
                                                <destinationList>
                                                        <destination type="urn:epcglobal:cbv:sdt:owning_party">${paramMap.businessLocation}</destination>
                                                </destinationList>
                                                <ilmd>
                                                        <ns2:bestBeforeDate>${expirationDate}</ns2:bestBeforeDate>
                                                        <ns2:itemExpirationDate>${expirationDate}</ns2:itemExpirationDate>
                                                        <ns2:sellByDate>${expirationDate}</ns2:sellByDate>
                                                </ilmd>
                                        </extension>
                                </TransformationEvent>
                        </extension>
                </EventList>
        </EPCISBody>
        </ns3:EPCISDocument>`
        )
    }

    export const aggregationXML = (paramMap: any) => {
        const epcClass = paramMap.product.replace(":class", `:${paramMap.packingIdType}:class`) + "." + paramMap.packingIdNumber
        return(
            `<ns3:EPCISDocument schemaVersion="1.2" creationDate="2022-04-28T20:19:19.484Z"
            xmlns:ns2="urn:epcglobal:cbv:mda"
            xmlns:ns3="urn:epcglobal:epcis:xsd:1">
            <EPCISBody>
                    <EventList>
                            <AggregationEvent>
                                    <eventTime>${eventTime}</eventTime>
                                    <eventTimeZoneOffset>${timeZone}</eventTimeZoneOffset>
                                    <baseExtension>
                                            <eventID></eventID>
                                    </baseExtension>
                                    <parentID>urn:ibm:ift:lpn:obj:1234569874563.9329</parentID>
                                    <childEPCs/>
                                    <action>ADD</action>
                                    <bizStep>${paramMap.businessEvent}</bizStep>
                                    <bizLocation>
                                            <id>${paramMap.businessLocation}</id>
                                    </bizLocation>
                                    <extension>
                                            <childQuantityList>
                                                    <quantityElement>
                                                            <epcClass>${epcClass}</epcClass>
                                                            <quantity>${paramMap.quantity}</quantity>
                                                            <uom>${paramMap.unitOfMeasure}</uom>
                                                    </quantityElement>
                                            </childQuantityList>
                                            <sourceList>
                                                    <source type="urn:epcglobal:cbv:sdt:owning_party">${paramMap.businessLocation}</source>
                                            </sourceList>
                                            <destinationList>
                                                    <destination type="urn:epcglobal:cbv:sdt:owning_party">${paramMap.businessLocation}</destination>
                                            </destinationList>
                                    </extension>
                            </AggregationEvent>
                    </EventList>
            </EPCISBody>
    </ns3:EPCISDocument>`
        )
}