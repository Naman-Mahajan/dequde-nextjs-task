import Image from "next/image";
import OHLCChart from "./components/OHLCChart";
import sampleData from '../app/data/sampleData';

export default function Home() {
  return (
    <div>
    <h1>OHLC Static Chart</h1>
    <OHLCChart data={ sampleData } />
  </div>
  );
}
