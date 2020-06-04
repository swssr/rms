import React from 'react';
export function ChartDialog({ open, handleClose, data, chartRef }: any) {
  return <dialog
    open={open}>
    <button
      className="btn btn--icon"
      onClick={() => handleClose()}
    >
      <img src="https://image.flaticon.com/icons/svg/748/748122.svg" alt="close icon" className="icon" />
    </button>
    <div className="container">
      <div className="container__head">
        <h2 className="reading">{data?.Serial}</h2>
        <div className="reading">{data?.WH}<span className="units">WH</span> | {data?.VARH}<span className="units">VARH</span></div>
        <div className="reading">{data?.ReadingDateTimeUTC}</div>
      </div>
      <canvas
        ref={chartRef}
        className="chart">
      </canvas>
      <button onClick={() => handleClose()} className="btn btn--primary">Close</button>
    </div>
  </dialog>;
}
