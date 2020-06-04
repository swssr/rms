/** Main imports  **/
const express = require("express");
const app = express();

/** Other imports   */
const cors = require("cors");

/** Middleware   */
app.use(cors());

/** Import Services   */
const MeterService = require("./meter.service");

app.get("/api/data", async (req, res) => {
  await MeterService.GetReadings()
    .then(() => {
      res.status(200).json(data || []);
    })
    .catch(() => res.status(500).send({ error: "Whoops. Something, went terribly wrong!" }))
});

/** Start server */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Application started at port: ${PORT}`));
