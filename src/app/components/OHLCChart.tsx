"use client"
import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData , CrosshairMode} from 'lightweight-charts';

interface OHLCData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface OHLCChartProps {
  data: any[];
}

const OHLCChart: React.FC<OHLCChartProps> = ({ data }) => {
  const chartContainerRef: any = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<IChartApi | null>(null);
  const candleSeries = useRef<ISeriesApi<'Candlestick'> | null>(null);
  

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

   
    chartInstance.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.offsetWidth,
        height: 400,
        layout: {
          background: {
           color: '#253248'
          },
          textColor: 'rgba(255, 255, 255, 0.9)',
        },
        grid: {
          vertLines: {
            color: '#334158',
          },
          horzLines: {
            color: '#334158',
          },
        },
        
        crosshair: {
          mode: CrosshairMode.Normal,
        },
        rightPriceScale: {
          borderColor: '#485c7b',
        },
        timeScale: {
          borderColor: '#485c7b',
        },
      });


  

    candleSeries.current = chartInstance.current.addCandlestickSeries({ borderVisible: false,
      upColor: '#4bffb5',
      downColor: '#ff4976',
      borderDownColor: '#ff4976',
      borderUpColor: '#4bffb5',
      wickDownColor: '#838ca1',
      wickUpColor: '#838ca1',
    });

    
    const candlestickData: any = data.map((item) => ({
      time: item.time,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

   
    candleSeries.current.setData(candlestickData);
    const tooltipElement = document.createElement('div');
    tooltipElement.classList.add('custom-tooltip');
  chartContainerRef.current.appendChild(tooltipElement);
    chartInstance.current.subscribeCrosshairMove((param: any) => {
      console.log(param)
      if (!param.time || !param.point) return;
  
      const price = param.seriesData.get(candleSeries.current);
      if (!price) return;
      const tooltipColor = price.close > price.open ? '#4bffb5' : '#ff4976'; 

      const chartRect = chartContainerRef.current.getBoundingClientRect();
    const chartLeft = chartRect.left + window.scrollX;
    const chartTop = chartRect.top + window.scrollY;

    const tooltipX = param.point.x - chartLeft + 10; 
    const tooltipY = param.point.y - chartTop - tooltipElement.offsetHeight - 10; 
    tooltipElement.style.left = `${tooltipX}px`;
    tooltipElement.style.top = `${tooltipY}px`;
    tooltipElement.innerHTML = `<div style="display: flex; position: relative; z-index: 1; gap: 2em; top: -24em; left:2em">
    <div style="color: ${tooltipColor};">Open: ${price.open}</div>
    <div style="color: ${tooltipColor};">High: ${price.high}</div>
    <div style="color: ${tooltipColor};">Low: ${price.low}</div>
    <div style="color: ${tooltipColor};">Close: ${price.close}</div>
</div>`;
      tooltipElement.style.display = 'block';
     
      console.log(`OHLC: ${price.open} ${price.high} ${price.low} ${price.close}`);
    });
  

    return () => {
      if (chartInstance.current) chartInstance.current.remove();
      if (tooltipElement && tooltipElement.parentNode) {
        tooltipElement.parentNode.removeChild(tooltipElement);
      }
    };
  }, [data]);

  const handleRangeChange = (range: string) => {
    if (chartInstance.current) {
      const visibleRange = chartInstance.current.timeScale().getVisibleLogicalRange();
      if (!visibleRange) return; 
  
      switch (range) {
        case '1D':
          chartInstance.current.timeScale().fitContent();
          break;
        case '1W':
          chartInstance.current.timeScale().fitContent();
          chartInstance.current.timeScale().setVisibleLogicalRange({
            from: visibleRange.from - 7,
            to: visibleRange.to
          });
          break;
        case '1M':
          const currentTimestamp: any = Date.now();
          const oneMonthAgo : any= currentTimestamp - (30 * 24 * 60 * 60 * 1000); 
          chartInstance.current.timeScale().setVisibleRange({
            from: oneMonthAgo,
            to: currentTimestamp
          });
          break;
        case '1Y':
          const oneYearAgo: any = currentTimestamp - (365 * 24 * 60 * 60 * 1000); 
        chartInstance.current.timeScale().setVisibleRange({
          from: oneYearAgo,
          to: currentTimestamp
        });
          break;
        default:
          break;
      }
    }
  };
  

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <div
          ref={chartContainerRef}
          style={{ width: 'calc(100% - 40px)', height: 'calc(100% - 40px)', margin: '20px' }}
        />
      </div>
      <div style={{ position: 'absolute', bottom: '-20px', left: '20px' }}>
        <div style={{ display: 'flex', gap: '2em' }}>
          <button onClick={() => handleRangeChange('1D')}>1D</button>
          <button onClick={() => handleRangeChange('1W')}>1W</button>
          <button onClick={() => handleRangeChange('1M')}>1M</button>
          <button onClick={() => handleRangeChange('1Y')}>1Y</button>
        </div>
      </div>
    </div>
  );
};

export default OHLCChart;