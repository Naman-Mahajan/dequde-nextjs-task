"use client"
import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';

interface OHLCData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface OHLCChartProps {
  data: OHLCData[];
}

const OHLCChart: React.FC<OHLCChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<IChartApi | null>(null);
  const candleSeries = useRef<ISeriesApi<'Candlestick'> | null>(null);
  

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

   
    chartInstance.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.offsetWidth,
        height: 400,
        // layout: {
        //     background:{
        //         color:'black'
        //     }
        // },
        grid: {
          horzLines: {
            color: 'black', 
          },
       
        },
        rightPriceScale: {
          scaleMargins: {
            top: 0.1, 
            bottom: 0.1,
          },
        },timeScale:{
          timeVisible: true
        },

        leftPriceScale: {
          scaleMargins: {
            top: 0.1, 
            bottom: 0.1, 
          },
        },
      });

    candleSeries.current = chartInstance.current.addCandlestickSeries({ borderVisible: false});

    
    const candlestickData: any = data.map((item) => ({
      time: item.time * 1000,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

   
    candleSeries.current.setData(candlestickData);
    // const onHoveredCallback = (param: any) => {
    //   if (param.time === undefined) return;

    //   const time = new Date(param.time);
    //   const formattedTime = `${time.getDate()} ${time.toLocaleString('default', { month: 'short' })} ${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}`;

    //   console.log('Hovered Candle:', formattedTime);
    // };
    // chartInstance.current.subscribeCrosshairMove(onHoveredCallback)

    return () => {
      if (chartInstance.current) chartInstance.current.remove();
    };
  }, [data]);

  // const setResolution = (resolution: string) => {
  //   if (candleSeries.current) {
  //     candleSeries.current.applyOptions({ priceScale: { scaleMargins: { top: 0.1, bottom: 0.1 } } });
  //     candleSeries.current.setResolution(resolution);
  //   }
  // };


  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div
        ref={chartContainerRef}
        style={{ width: 'calc(100% - 40px)', height: 'calc(100% - 40px)', margin: '20px' }}
      />
    </div>
  );
};

export default OHLCChart;
