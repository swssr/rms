import React, { useState, useEffect, useRef } from 'react';
import Chart from "chart.js";

const API_URL = "http://localhost:8080/api/data";

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

    const meter01Data = readings.filter(v => v["Serial"] === "METER000001").slice(0, 50).map((v: MeterReading) => v.WH)
    const meter02Data = readings.filter(v => v["Serial"] === "METER000002").slice(0, 50).map((v: MeterReading) => v.WH)

    new Chart(chartContext, {
      type: "line",
      data: {
        labels: timeStamps,
        datasets: [
          {
            label: "METER000001",
            data: meter01Data,
            borderColor: "#00ff00",
            fill: "#00ff00"
          },
          {
            label: "METER000002",
            data: meter02Data,
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
    const _filtered = findBySerial(_query, readings)
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
        <input
          type="text"
          onChange={handleChange}
          className="input input--prominent"
          placeholder="ENTER METER SERIAL"
        />
        <ListReadings
          readings={query ? filtered : readings}
          renderLimit={renderLimit}
          onItemClick={handleItemClick}
          increaseRenderLimit={increaseRenderLimit}
        />
      </div>
      <dialog
        open={open}>
        <div className="container">
          <div className="container__head">
            <h2 className="reading">{current?.Serial}</h2>
            <div className="reading">{current?.WH}<span className="units">WH</span> | {current?.VARH}<span className="units">VARH</span></div>
            <div className="reading">{current?.ReadingDateTimeUTC}</div>
          </div>
          <canvas
            ref={chartRef}
            className="chart">
          </canvas>
          <button onClick={() => setOpen(false)} className="btn btn--primary">Close</button>
        </div>
      </dialog>
    </div>
  );
}

function ListReadings({ readings, onItemClick, renderLimit, increaseRenderLimit }: any) {
  const _readings = readings.slice(0, renderLimit || 100);
  return <>
    <ol className="list">
      <div className="sub-title">{readings.length} Historic meter reading</div>
      <div className="sub-title">{_readings.length} Shown</div>
      {!!_readings.length ? _readings.map((data: any) => (
        <li
          className="meter"
          key={`${data.Serial}-${Math.random()}`}
          onClick={() => onItemClick(data)}
        >
          <div className="meter__id">{data.Serial}</div>
          <div className="meter__reading">{data.WH}<span className="units">WH</span> | {data.VARH}<span className="units">VARH</span></div>
          <div className="meter__date">{data.ReadingDateTimeUTC}</div>
        </li>
      )) :
        (
          <div className="warning">Nothing to see here</div>
        )
      }
    </ol>
    {!!readings.length && readings.length > renderLimit && (
      <button
        className="btn"
        onClick={() => increaseRenderLimit({ renderLimit, list: readings })}
      >Load More...</button>
    )}
  </>
}

interface MeterReading {
  Serial: string;
  WH: number;
  VARH: number;
  ReadingDateTimeUTC: string;
}

//Utility functions
function findBySerial(_query: string, list: any) {
  return list
    .filter((value: MeterReading) => value["Serial"].toLowerCase().startsWith(_query))
}

function withinRange(value: number, center: number, offset: number) {
  const min = center - offset;
  const max = center + offset;
  if (value > max || value < min) { return false } else {
    return true
  }
}

export default App;
