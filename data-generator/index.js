const fs = require('fs');
const path = require('path')


const randomCropList = [
    "Rice",
    "Jowar",
    "Bajra",
    "Maize",
    "Cotton",
    "Groundnut",
    "Jute",
    "Sugarcane",
    "Turmeric",
    "Pulses",
    "Wheat",
    "Oat",
    "Gram",
    "Pea",
    "Barley",
    "Potato",
    "Tomato",
    "Onion",
    "Cucumber",
    "Bitter Gourd",
    "Pumpkin",
    "Watermelon",
    "Muskmelon",
    "Moong Dal"
]

function randomCrop() {
    return randomCropList[Math.floor(Math.random() * randomCropList.length)];
}

const inFile = process.argv[2];
const fileName = path.basename(inFile);

console.log("Converting:", inFile);

const data = JSON.parse(fs.readFileSync(inFile, 'utf8'));

for (let i = 0; i < data.features.length; i++) {
    const feature = data.features[i];
    //console.log(feature.properties.fid);
    delete feature.properties.OBJECTID;
    delete feature.properties.SecondaryA;
    delete feature.properties.TertiaryAL;
    delete feature.properties.Commoditie;
    delete feature.properties.Note;
    delete feature.properties.Shape_Leng;
    delete feature.properties.Shape_Area;
    feature.properties.Crop = randomCrop();
}

fs.writeFileSync(`output/output_${fileName}`, JSON.stringify(data));

