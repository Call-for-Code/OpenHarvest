import { PieChartCard } from 'carbon-addons-iot-react';
import React, { useEffect, useState } from "react";
import { getDashboard, YeildData } from '../../services/dashboard';

export function PiChartGNY() {

    const size = "MEDIUM";
    const groupDataSourceId = "group";
    const [chartData, setChartData] = useState<YeildData[]>([]);

    useEffect(() => {
      getDashboard().then(setChartData);
    }, []);
      
    return (
      <div style={{ width: `700px`, margin: 20 }}>
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
          testID="basicCardStoryTest"
          values={chartData}
        />
      </div>
    );
  }
// Farmers per ground nut type
  export function PiChartGNT() {

    const size = "MEDIUM";
    const groupDataSourceId = "group";
    const [chartData, setChartData] = useState<YeildData[]>([]);

    useEffect(() => {
      getDashboard().then(setChartData);
    }, []);
      
    return (
      <div style={{ width: `700px`, margin: 20 }}>
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
          testID="basicCardStoryTest"
          values={chartData}
        />
      </div>
    );
  }