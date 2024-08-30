const { db } = require("../config/dbConfig");
const collectionSheet = require("../models/collectionSheetModel");

module.exports.getCollectionSheet = async (req, res) => {
  try {
    const { soCode, collectionDay, collectionDate } = req.body;
    const sheet = await collectionSheet.getCollectionSheet(
      soCode,
      collectionDay
    );

    console.log(sheet);

    if (!sheet[0] || sheet[0].length === 0) {
      return res.status(404).json({error:"Sheet not found"});
    }

    let result_data = sheet[0];
    console.log(result_data);
    const promises = result_data.map(async (item) => {
      if (
        item.sonchoy_collection_status == 30 ||
        item.kisti_collection_status == 30
      ) {
        const date = new Date(collectionDate);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        console.log(month);

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


    console.log(result_data);

    const  final_result = [];

    for (let index = 0; index < result_data.length; index++) {
      const element = result_data[index];

        const kisti_collection_last_date = new Date(element.kisti_last_collection_month);
        const sonchoy_collection_last_date = new Date(element.sv_last_collection_month);
        const current_date = new Date(collectionDate);

        if(kisti_collection_last_date.getMonth() != current_date.getMonth() && element.kisti_collection_status === "30"){
          final_result.push(element)
        }

        if(sonchoy_collection_last_date.getMonth() != current_date.getMonth() && element.sonchoy_collection_status === "30"){
          const exist = final_result.find(item=> item.serial === element.serial);
          if(!exist){
            final_result.push(element);
          }
        }


        if(element.sonchoy_collection_status === "7"){
          const exist = final_result.find(
            (item) => item.serial === element.serial
          );
          if (!exist) {
            final_result.push(element);
          }
        }

        if(element.kisti_collection_status === "7"){
          const exist = final_result.find(
            (item) => item.serial === element.serial
          );
          if (!exist) {
            final_result.push(element);
          }
        }


        if (
          element.sv_last_collection_month === null ||
          element.sv_last_collection_month === "" ||
          element.kisti_last_collection_month === null ||
          element.kisti_last_collection_month === ""
        ) {
          const exist = final_result.find(
            (item) => item.serial === element.serial
          );
          if (!exist) {
            final_result.push(element);
          }
        }
    }

    Promise.all(promises)
      .then(() => {
        res.json(final_result);
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


module.exports.getSingleCollectionSheet = async (req, res) => {
  try {
    const serial = req.params.serial;
    const sheet = await collectionSheet.getSingleCollectionSheet(
      serial
    );

    console.log(sheet);

    if (!sheet[0] || sheet[0].length === 0) {
      return res.status(404).json({ error: "Sheet not found" });
    }

    let result_data = sheet[0][0];

    res.json(result_data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}