import { PieChartCard } from 'carbon-addons-iot-react';
import React, { useEffect, useState } from "react";
import { getDashboard, YeildData } from '../../services/dashboard';


export function PiChartGNY() {

    const size = "MEDIUM";
    const groupDataSourceId = "group";
    const [chartData, setChartData] = useState<YeildData[]>([]);

    useEffect(() => {
      getDashboard().then((data) => setChartData(data.yeild));
    }, []);
      
    return (
        <PieChartCard
          availableActions={{ expand: true }}
          content={{
            groupDataSourceId,
            legendPosition: 'bottom',
          }}
          id="basicCardStory"
          isLoading={false}
          isEditable={false}
          isExpanded={false}
          onCardAction={false}
          size={size}
          title={'Ground Nut Yield'}
          values={chartData}
        />
    );
  }

// Farmers per ground nut type
  export function PiChartGNT() {

    const size = "MEDIUM";
    const groupDataSourceId = "group";
    const [chartData, setChartData] = useState<YeildData[]>([]);

    useEffect(() => {
      getDashboard().then((data) => setChartData(data.nutType));
    }, []);
      
    return (
        <PieChartCard
          availableActions={{ expand: true }}
          content={{
            groupDataSourceId,
            legendPosition: 'bottom',
          }}
          id="basicCardStory"
          isLoading={false}
          isEditable={false}
          isExpanded={false}
          onCardAction={false}
          size={size}
          title={'Number of Farmers per Ground Nut Type'}
          values={chartData}
        />
    );
  }