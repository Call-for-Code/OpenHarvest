import { Router } from "express";
var router = Router();

import LandAreasService from "../services/land-areas.service";
const lotAreas = new LandAreasService();
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
        resObj.yeild = chartData;
        resObj.nutType= nutTypeData;
        res.json(resObj);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
    
});

export default router;
