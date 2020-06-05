import React, { useState, useEffect, useRef } from 'react';
import Chart from "chart.js";
import { ListReadings } from './components/ListReadings';
import { ChartDialog } from './components/ChartDialog';
import { findByKey } from './utils/helpers';

const API_URL = process.env.NODE_ENV === "development"
  ? "http://localhost:8080/api/data"
  : "https://rms-server-279323.ew.r.appspot.com/api/data";

function App() {
  const [readings, setReadings] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [current, setCurrent] = useState({ Serial: "", WH: "", VARH: "", ReadingDateTimeUTC: "" });
  const [query, setQuery] = useState("");

  const [open, setOpen] = useState(false);

  const [renderLimit, setRenderLimit] = useState(50);

  //Fetch metering data from server
  useEffect(() => {
    fetch(API_URL).then((res) => res.json())
      .then(data => {
        setReadings(data)
      })
  }, [])

  //Charts
  const chartRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {

    const chartContext = chartRef.current?.getContext("2d");

    if (!chartContext || !readings.length) return
    const timeStamps = (query ? filtered : readings)
      .slice(0, 50)
      .map((v: MeterReading) => v.ReadingDateTimeUTC);

    //WH Data
    const meter01WHData = readings.filter(v => v["Serial"] === "METER000001").slice(0, 50).map((v: MeterReading) => v.WH)
    const meter02WHData = readings.filter(v => v["Serial"] === "METER000002").slice(0, 50).map((v: MeterReading) => v.WH)

    //VARH Data
    const meter01VARHData = readings.filter(v => v["Serial"] === "METER000001").slice(0, 50).map((v: MeterReading) => v.VARH)
    const meter02VARHData = readings.filter(v => v["Serial"] === "METER000002").slice(0, 50).map((v: MeterReading) => v.VARH)

    new Chart(chartContext, {
      type: "line",
      data: {
        labels: timeStamps,
        datasets: [
          //Meter 1 readings
          {
            label: "METER000001 WH",
            data: meter01WHData,
            borderColor: "#00ff00",
            fill: "#00ff00"
          },
          {
            label: "METER000001 VARH",
            data: meter01VARHData,
            borderColor: "#00ff00",
            fill: "#00ff00"
          },
          //Meter 2 readings
          {
            label: "METER000002 WH",
            data: meter02WHData,
            borderColor: "#ff0000",
            fill: "#ff0000"
          },
          {
            label: "METER000002 VARH",
            data: meter02VARHData,
            borderColor: "#ff0000",
            fill: "#ff0000"
          }

        ],
      }
    })
  }, [current, readings, filtered, query])

  //Actions and event handlers
  const handleChange = (event: any) => {
    const _query = event.target.value.toLocaleLowerCase();
    setQuery(_query);
    const _filtered = findByKey("Serial", _query, readings)
    setFiltered(_filtered)
  }

  const handleItemClick = (data: any) => {
    setOpen(true);
    setCurrent(data);
  }

  const increaseRenderLimit = ({ renderLimit, list }: any) => {
    if (renderLimit >= list.length) return
    setRenderLimit(renderLimit + 50);
  }

  return (
    <div className="App">
      <div className="container">
        <nav className="nav">
          <a href="/" className="link">
            <img src="https://res.cloudinary.com/swssr/image/upload/v1591310316/uc9nxnzrgxufivtwz7me.png" alt="rms logo" className="img img--logo" />
          </a>
          <div className="input-wrapper">
            <input
              type="text"
              onChange={handleChange}
              className="input input--prominent"
              placeholder="ENTER METER SERIAL"
            />
          </div>
        </nav>
        <ListReadings
          readings={query ? filtered : readings}
          renderLimit={renderLimit}
          onItemClick={handleItemClick}
          increaseRenderLimit={increaseRenderLimit}
        />
      </div>
      <ChartDialog
        open={open}
        data={current}
        handleClose={() => setOpen(false)}
        chartRef={chartRef}
      />
    </div>
  );
}

//Interfaces
interface MeterReading {
  Serial: string;
  WH: number;
  VARH: number;
  ReadingDateTimeUTC: string;
}

export default App;
