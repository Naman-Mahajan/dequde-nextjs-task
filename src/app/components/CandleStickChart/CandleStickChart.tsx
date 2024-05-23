"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CandlestickData,
  IChartApi,
  ISeriesApi,
  MouseEventParams,
  Time,
  createChart,
} from "lightweight-charts";
import TimeframeButton from "../Button/TimeframeButton";
import { chartConfig } from "../../configuration/chartConfiguration/chartConfig";
import {
  CustomTooltip,
  SubscribeData,
  TimeFrameOption,
} from "../../types/interfaces/IOhclChart";
import { connectWebSocket, closeWebSocket } from "../../utils/chartWebsocket";
import {
  timeFrameOptions,
  SUBSCRIBE_KEY,
  CHANNEL_KEY,
} from "@/app/configuration/chartConfiguration/chartConfig";
import { Timeframe } from "@/app/configuration/chartConfiguration/enum";
import useStyles from "./CandlestickChart.styles";
import { getLogicalRange } from "./CandleStickChartCalculation";
import { handleTooltipContent } from "./CandleStickChartCalculation";
import { defaultWebSocketURL } from "@/app/utils/webSocketUrl";
import { Box, Paper, Typography } from "@mui/material";

const CandlestickChart: React.FC = () => {
  const classes = useStyles();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [candleData, setCandleData] = useState<CandlestickData<Time>[]>([]);
  const [isChartLoaded, setIsChartLoaded] = useState<boolean>(false);
  const [timeframe, setTimeframe] = useState<string>(Timeframe.ONE_WEEK);
  const [tooltip, setTooltip] = useState<CustomTooltip | null>();
  let [chartApi, setChartApi] = useState<IChartApi>();
  const [tooltipColor, setTooltipColor] = useState<string>();
  const subscribeData: SubscribeData = {
    event: SUBSCRIBE_KEY,
    channel: CHANNEL_KEY,
    key: `trade:${timeframe}:tBTCUSD`,
  };

  const setCandleDataCallback = (newCandleData: CandlestickData<Time>[]) => {
    setCandleData(newCandleData);
  };

  useEffect(() => {
    const wss = connectWebSocket(
      process.env.WEBSOCKET_API_URL || defaultWebSocketURL,
      subscribeData,
      setCandleDataCallback
    );
    return () => {
      closeWebSocket(wss);
    };
  }, [timeframe]);

  useEffect(() => {
    if (chartContainerRef.current && candleData.length > 0) {
      setIsChartLoaded(true);
      if (chartApi) {
        chartApi.remove();
      }

      chartApi = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        ...chartConfig,
      });
      const timeScaleOptions = {
        timeVisible: true,
        barSpacing: 15,
      };
      chartApi?.applyOptions({
        timeScale: timeScaleOptions,
      });
      chartApi.timeScale().applyOptions({
        timeVisible: true,
      });

      setChartApi(chartApi);
      const candlestickSeries = chartApi?.addCandlestickSeries();
      candlestickSeries?.setData(candleData);
      let logicalRange = getLogicalRange(timeframe, candleData);
      chartApi.timeScale().setVisibleLogicalRange(logicalRange);
      
      chartApi.subscribeCrosshairMove((param) => {
        updateTooltipContent(param, candlestickSeries)
      });
    }
  }, [candleData, isChartLoaded, timeframe]);

    const updateTooltipContent = (param: MouseEventParams<Time>, candlestickSeries: ISeriesApi<"Candlestick">) => {
      if (!param.time || !param.point) return;""
      const price = param?.seriesData?.get(candlestickSeries) as CandlestickData<Time>;
      if (!price) return;
      setTooltipColor(price.close > price.open ? "#4bffb5" : "#ff4976");
      setTooltip(handleTooltipContent(price));
    }

  return (
    <Box>
      <Paper className={classes.chartContainer} ref={chartContainerRef} />
      {isChartLoaded &&
      <Typography className={classes.customTooltipContainer}>
        <span style={{ color: tooltipColor }}>O {tooltip?.open}</span>
        <span style={{ color: tooltipColor }}>H {tooltip?.high}</span> 
        <span style={{ color: tooltipColor }}>L {tooltip?.low}</span>
        <span style={{ color: tooltipColor }}>C {tooltip?.close}</span> 
        <span style={{ color: tooltipColor }}>{tooltip?.valueSign}{tooltip?.difference}</span> 
        <span style={{ color: tooltipColor }}>({tooltip?.profitOrLossText})</span>
        </Typography>
        }
      {isChartLoaded &&
        timeFrameOptions.map((option: TimeFrameOption, index) => (
          <React.Fragment key={option.value}>
            <TimeframeButton
              timeframe={option.value}
              setTimeframe={setTimeframe}
              label={option.label}
              selected={timeframe === option.value}
            />
            {index < timeFrameOptions.length - 1 && (
              <Box className={classes.spacer} />
            )}
          </React.Fragment>
        ))}
    </Box>
  );
};

export default CandlestickChart;
