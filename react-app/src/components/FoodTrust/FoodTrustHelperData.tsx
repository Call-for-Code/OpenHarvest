import React from 'react';

export const BusinessEvents = [
    // {"name":"creating lot", "value":"urn:epcglobal:cbv:bizstep:creating_class_instance"},
    {"name":"commission", "value":"urn:epcglobal:cbv:bizstep:commissioning"},
    {"name":"perform drying method 1", "value":"https://epcis.heifer.com/bizStep/perform_drying_method_1"},
    {"name":"perform drying method 2", "value":"https://epcis.heifer.com/bizStep/perform_drying_method_2"},
    {"name":"perform drying method 3", "value":"https://epcis.heifer.com/bizStep/perform_drying_method_3"},
    {"name":"perform drying method 4", "value":"https://epcis.heifer.com/bizStep/perform_drying_method_4"},
    {"name":"perform drying method 5", "value":"https://epcis.heifer.com/bizStep/perform_drying_method_5"},
    {"name":"storage", "value":"https://epcis.heifer.com/bizStep/storage"},
    {"name":"package for transport", "value":"https://epcis.heifer.com/bizStep/package_for_transport"},
    {"name":"transport to retailer", "value":"https://epcis.heifer.com/bizStep/transport_to_retailer"},
    {"name":"unpack at retailer", "value":"https://epcis.heifer.com/bizStep/unpack_at_retailer"},

//     "accepting",
//     "arriving",
//     "assembling",
//     "collecting",
//     "commingling",
//     "cosigning",
//     "cycle_counting",
//     "decommissioning",
//     "dispensing",
//     "encoding",
//     "entering_exiting",
//     "farm_harvest",
//     "feeding",
//     "fishing_event",
//     "repackaging",
//     "freezing",
//     "hatching",
]

export const EventTypes = [
    {"name": "commission", "value": "ADD"},
    {"name": "observation", "value": "OBSERVE"},
    {"name": "transform", "value": "TRANSFORM"},
    {"name": "aggregation", "value": "AGGREGATION"},
    // {"name": "disaggregation", "value": "DELETE"}
]

export const UnitsOfMeasure = [
    {"name": "units", "value": "C62"},
    {"name": "cases", "value": "CS"},
    {"name": "kilograms", "value": "KGM"},
    {"name": "pounds", "value": "LBR"},
    // "units", //C62
    // "cases", //cs
    // "kilograms", // kgm
    // "pounds", //LBR
    // "square_miles",
    // "square_meters",
    // "square_yards",
    // "bushels_(US)",
    // "bushels_(UK)",
    // "gallons_(US)",
    // "gallons_(UK)",
    // "liters",
    // "cubic_meters"
]

export const EventTypeModalText = (
    <>
    <h2>Aggregation</h2>
    <p>Combining multiple traceable food product units into a single new traceable food product unit.</p>
    <p>Example: Packing several cases of a Lot + GTIN onto a Pallet.</p>
    <br />
    <h2>Commission</h2>
    <p>Creating a new food product instance, with a unique identifier (GTIN + Lot (LGTIN) or GTIN + Serial (SGTIN)).</p>
    <br />
    <h2>Observation</h2>
    <p>Any event where the food product unit is scanned or otherwise recorded, typically during transit, without being created, added, destroyed, or removed.</p>
    <br />
    <h2>Disaggregation</h2>
    <p>Separating a single food product unit into multiple food product units.</p>
    <p>Example: Unpacking several cases of a Lot + GTIN from a Pallet.</p>
    </>
)

export const PackingIDModalText = (
    <>
    <p>Select Lot/Batch if the output represents a quantity of items that are not uniquely identifiable from each other such as &quot;50 cases of a product&quot; or &quot;300 pounds of a product&quot;</p>
    <p>Example: urn:epc:class:lgtin: 0123456.789012.3456)</p>
    <br/>
    <p>Select Pallet if the output represents a shipping container with an SSCC or an LPN identifier</p>
    <p>(example: urn:epc:id:sscc:0123456.1234567890).</p>
    <br/>
    <p>Select Serial if the output has a unique serial number identification</p> 
    <p>(example: urn:epc:id:sgtin:0123456.789012.3456).</p>
    </>
)

export const AssetIdModalText = (
    <p>Accepts an Asset Identifier (URN) String</p>
)