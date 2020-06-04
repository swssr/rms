import React from 'react';
export function ListReadings({ readings, onItemClick, renderLimit, increaseRenderLimit }: any) {
  const _readings = readings.slice(0, renderLimit || 100);
  return <>
    <ol className="list">
      <div className="list-stats">
        <div className="sub-title">{readings.length} Readings</div>
        <div className="sub-title">{_readings.length} Shown</div>
      </div>
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
        )}
    </ol>
    {!!readings.length && readings.length > renderLimit && (
      <button
        className="btn"
        onClick={() => increaseRenderLimit({ renderLimit, list: readings })}
      >Load More...</button>
    )}
  </>;
}
