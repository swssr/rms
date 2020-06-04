import React, { useState, useEffect } from 'react';

const API_URL = "http://localhost:8080/api/data";

function App() {
  const [readings, setReadings] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [current, setCurrent] = useState({ Serial: "", WH: "", VARH: "", ReadingDateTimeUTC: "" });
  const [query, setQuery] = useState("");

  const [open, setOpen] = useState(false);

  const [renderLimit, setRenderLimit] = useState(50);

  useEffect(() => {
    fetch(API_URL).then((res) => res.json())
      .then(data => {
        setReadings(data)
      })
  }, [])


  const handleChange = (event: any) => {
    const _query = event.target.value;
    setQuery(_query);
  }

  const handleItemClick = (data: any) => {
    console.log("Item click!!!", { data })
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
          readings={readings}
          filtered={filtered}
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
          <div className="chart">
          </div>
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
  ReadingDateTimeUTC: Date;
}

export default App;
