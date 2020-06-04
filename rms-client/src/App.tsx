import React, { useState, useEffect } from 'react';

const API_URL = "http://localhost:8080/api/data";

function App() {
  const [readings, setReadings] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [current, setCurrent] = useState({ Serial: "", WV: "", VARH: "", ReadingDateTimeUTC: "" });
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
    // setCurrent(data);
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
        open={open}
        className="container container--dialog">
        <h2>{current.Serial}</h2>
        <div className="chart">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum incidunt inventore, sit totam quis explicabo eaque earum est nesciunt distinctio iure nam eius enim fugiat praesentium dolorem consectetur id reiciendis.
        </div>
        <button onClick={() => setOpen(false)} className="btn btn--primary">Close</button>
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
          <div className="meter__reading">{data.WH}WH | {data.VARH}VARH</div>
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
