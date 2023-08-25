const { db } = require("../config/dbConfig");
const collectionSheet = require("../models/collectionSheetModel");

module.exports.getCollectionSheet = async (req, res) => {
  try {
    const { soCode, collectionDay, collectionDate } = req.body;
    const sheet = await collectionSheet.getCollectionSheet(
      soCode,
      collectionDay
    );
    if (!sheet) {
      return res.status(404).send("Sheet not found");
    }

    let result_data = sheet[0];
    const promises = sheet[0].map(async (item) => {
      if (item.sonchoy_collection_status == 30) {
        const date = new Date(collectionDate);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const sonchoy = await collectionSheet.collectionSheetFilter(
          month,
          year,
          item.serial
        );
        if (sonchoy[0]?.length) {
          result_data = result_data.filter(
            (v) => v.serial != sonchoy[0][0]?.account_no
          );
        }
      }
    });

    Promise.all(promises)
      .then(() => {
        res.json(result_data);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
