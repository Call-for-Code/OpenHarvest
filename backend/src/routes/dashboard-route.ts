import { Router } from "express";
var router = Router();

import LandAreasService from "../services/land-areas.service";
const lotAreas = new LandAreasService();

//pi graph data
const chartData = [
    {
      group: 'Charimbana',
      category: 'misc',
      value: 1,
    },
    {
      group: 'Nsinjiro',
      category: 'sfdg',
      value: 10,
    },
    {
      group: 'Baka',
      category: 'fdsg',
      value: 20,
    },
    {
      group: 'kakoma',
      category: 'ere',
      value: 50,
    },
    {
      group: 'Chalimbana',
      category: 'afw',
      value: 15,
    },
    {
      group: 'Chatimbana',
      category: 'misc',
      value: 40,
    },
  ];

  const nutTypeData = [
    {
      group: 'Charimbana',
      category: '2V2N 9KYPM',
      value: 80,
    },
    {
      group: 'Nsinjiro',
      category: 'afds',
      value: 15,
    },
    {
      group: 'Baka',
      category: 'saf',
      value: 25,
    },
    {
      group: 'kakoma',
      category: 'sdf',
      value: 15,
    },
    {
      group: 'Chalimbana',
      category: 'sfdg',
      value: 15,
    },
    {
      group: 'Chatimbana',
      category: 'asd',
      value: 30,
    },
  ];

//Bar chart data
  const precipData=[
    {
      month: 'April',
      precipitation: 50,
    },
    {
      month: 'May',
      precipitation: 25,
    },
    {
      month: 'June',
      precipitation: 80,
    },
    {
      month: 'July',
      precipitation: 120,
    },
    {
      month: 'August',
      precipitation: 70,
    },
    {
      month: 'September',
      precipitation: 30,
    },
    {
      month: 'October',
      precipitation: 90,
    },
    {
      month: 'November',
      precipitation: 90,
    },
    {
      month: 'December',
      precipitation: 20,
    },
    {
      month: 'January',
      precipitation: 100,
    },
    {
      month: 'February',
      precipitation: 60,
    },
    {
      month: 'March',
      precipitation: 80,
    },

  ];

  const tempData = [
    {
      month: 'April',
      temperature: 44,
    },
    {
      month: 'May',
      temperature: 110,
    },
    {
      month: 'June',
      temperature: 32,
    },
    {
      month: 'July',
      temperature: 120,
    },
    {
      month: 'August',
      temperature: 70,
    },
    {
      month: 'September',
      temperature: 70,
    },
    {
      month: 'October',
      temperature: 44,
    },
    {
      month: 'November',
      temperature: 90,
    },
    {
      month: 'December',
      temperature: 120,
    },
    {
      month: 'January',
      temperature: 110,
    },
    {
      month: 'February',
      temperature: 100,
    },
    {
      month: 'March',
      temperature: 80,
    },
  ];

//Card Data
const totalLand = 1220;
const totalCrops = 35;
const totalFarmers= 30;
const totalPrecip = 345;

router.get("/crop-distribution", async(req, res) => {
    try {
        const cropDistribution = await lotAreas.getOverallCropDistribution();
        res.json(cropDistribution);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

router.get("/crop-production-forecast", async(req, res) => {
    try {
        const cropProductionForecast = await lotAreas.getCropProductionForecast();
        res.json(cropProductionForecast);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

router.get("/crop-production-history", async(req, res) => {
    try {
        const cropProductionHistory = await lotAreas.getCropProductionHistory();
        res.json(cropProductionHistory);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

router.get("/tiles", async (req, res) => {
    try {
        const resObj: any = {};
        
        // resObj.totalLots = await lotAreas.getTotalLots();
        //pi graphs
        resObj.yeild = chartData;
        resObj.nutType= nutTypeData;
        //data cards
        resObj.totCrops= totalCrops;
        resObj.totFarmers=totalFarmers;
        resObj.totLand=totalLand;
        resObj.totPrecip=totalPrecip;
        //bar graphs
        resObj.temp=tempData;
        resObj.precip=precipData;


        res.json(resObj);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
    
});

export default router;
