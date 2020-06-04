const csv = require("csvtojson");
const path = require("path");

async function GetReadings() {
  const csvFilePath = path.join(__dirname, "metering_data.csv");
  return await csv().fromFile(csvFilePath);
}

module.exports = {
  GetReadings,
};
