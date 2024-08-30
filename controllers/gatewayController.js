const { db } = require("../config/dbConfig");



module.exports.getGatewayData = async (req, res) => {
  try {
    const so_code = req.params.so_code;
    const sql = `
        SELECT * FROM 3_sonchoy_collection_gateway WHERE so_code = ? AND re_check = ?;
        `;

    const result = await db.execute(sql, [so_code, 2]);

    console.log(result);


    if (!result[0] || result[0].length === 0) {
      return res.status(404).json({ error: "Sheet not found" });
    }

    let result_data = result[0];

    res.json(result_data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getRecheckFormValue = async (req, res) => {
  const gateway_submit_id = req.params.id;
  try {
    const account_sector_id_query = await db.execute(`SELECT ac_sector_id FROM 3_sonchoy_collection_gateway WHERE sl_2 = ?`, [gateway_submit_id]);
    const account_sector_id =
      account_sector_id_query[0][0]["account_sector_id"];

      

    const account_no_query_result = await db.execute(
      `SELECT account_no FROM 3_sonchoy_collection_gateway WHERE sl_2 = ?`, [gateway_submit_id]
    );
    const account_no = account_no_query_result[0][0]["account_no"];
    
    let online_collection_bl; 
    
    let gateway_collection_amount;
    

    if(account_sector_id === 5007){
      const gateway_collected_kisti_amount_result = await db.execute(
      `SELECT dr_amount FROM 3_sonchoy_collection_gateway WHERE sl_2 = ?`,
      [gateway_submit_id]
    );
      if (gateway_collected_kisti_amount_result[0][0] != null) {
        gateway_collection_amount =
          gateway_collected_kisti_amount_result[0][0]["dr_amount"];
      } else {
        res.status(500).json({
          error: "gateway_collection_amount not available",
        });
        return;
      }

      const online_kisti_bl_result = await db.execute(
        `SELECT online_kisti_bl FROM 7_sodosso_vorti WHERE serial = ?`,
        [account_no]
      );
      if (online_kisti_bl_result[0][0] != undefined) {
        online_collection_bl = online_kisti_bl_result[0][0]["online_kisti_bl"];
      } else {
        res.status(500).json({
          error: "online_kisti_bl not available",
        });
        return;
      }
    } else {
      const gateway_collected_sonchoy_amount_result = await db.execute(
        `SELECT cr_amount FROM 3_sonchoy_collection_gateway WHERE sl_2 = ?`,
        [gateway_submit_id]
      );

      if (gateway_collected_sonchoy_amount_result[0][0] != undefined) {
        gateway_collection_amount =
          gateway_collected_sonchoy_amount_result[0][0]["cr_amount"];
      } else {
        res.status(500).json({
          error: "cr_amount not available",
        });
        return;
      }
      

      const online_sonchoy_bl_result = await db.execute(
        `SELECT online_sonchoy_bl FROM 7_sodosso_vorti WHERE serial = ?`,
        [account_no]
      );
      console.log(online_sonchoy_bl_result[0][0]);
      if (online_sonchoy_bl_result[0][0] != undefined) {
        online_collection_bl =
          online_sonchoy_bl_result[0][0]["online_sonchoy_bl"];
      } else {
        res.status(500).json({
          error: "online_sonchoy_bl not available",
        });
        return;
      }
    }

    const collection_receipt_query = await db.execute(
      `SELECT url FROM collection_receipt WHERE collection_id = ?`,[gateway_submit_id]
    );
    let collection_receipt_url;

    if (collection_receipt_query[0][0] != undefined) {
      collection_receipt_url = collection_receipt_query[0][0]["url"];
    }else {
      collection_receipt_url = "";
      // res.status(500).json({
      //   error: "collection_receipt_url not available",
      // });
      // return;
    }

      const collected_bl =
        online_collection_bl + gateway_collection_amount;

    const final_result = {
      receipt_url: collection_receipt_url,
      online_collection_bl: String(online_collection_bl),
      collected_bl: collected_bl,
      collected_amount: gateway_collection_amount,
      formType: account_sector_id === 5007 ? "sonchoy" : "kisti"
    };
    res.json(final_result);
  } catch (error) {
    console.error(error);
    res.status(500).json(
      {
        error: error
      }
    )
  }
}

module.exports.getRecheckRequiredData = async (req, res) => {
  try {
    const so_code = req.params.so_code;
    const sql = `
        SELECT * FROM 3_sonchoy_collection_gateway WHERE so_code = ? AND re_check = ?;
        `;

    const result = await db.execute(sql, [so_code, 0]);

    console.log(result);

    if (!result[0] || result[0].length === 0) {
      return res.status(404).json({ error: "Sheet not found" });
    }

    let result_data = result[0];

    res.json(result_data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports.gatewayKistiRecheck = async (req, res)=>{
  const account_no = req.body['account_no'];
  const gateway_submit_id = req.body['getway_submit_id'];
  const kisti_book_bl = req.body["kisti_book_bl"];
  try {
  

  const gateway_collected_kisti_amount_result = await db.execute(
    `SELECT dr_amount FROM 3_sonchoy_collection_gateway WHERE sl_2 = ?`,
    [gateway_submit_id]
  );

  const online_kisti_bl_result = await db.execute(
    `SELECT online_kisti_bl FROM 7_sodosso_vorti WHERE serial = ?`,
    [account_no]
  );

  const online_kisti_bl = online_kisti_bl_result[0][0]["online_kisti_bl"];
  const gateway_collection_kisti_amount =
    gateway_collected_kisti_amount_result[0][0]["dr_amount"];
  
  const collected_kisti_bl = online_kisti_bl + gateway_collection_kisti_amount;

  if (Number(collected_kisti_bl) == Number(kisti_book_bl)) {
    const result1 = await db.execute(
      `UPDATE 7_sodosso_vorti SET online_kisti_bl = ? AND kisti_book_bl=? WHERE serial = ?`,
      [collected_kisti_bl, kisti_book_bl, account_no]
    );

    const result2 = await db.execute(
      `UPDATE 3_sonchoy_collection_gateway SET gateway_chk = ? WHERE sl_2 = ?`,
      [2, gateway_submit_id]
    );

    

    console.log(result1);
    console.log(result2);

    if (result1 != null && result2 != null) {
      res.json({
        data: "Recheck success",
      });
    } else {
      res.status(404).json({
        data: "recheck failed",
      });
    }
  } else {
    res.status(404).json({
      data: "Collected Kisti Bl & Kisti Book Bl is Not Same",
    });
  }
  } catch (error) {
    res.status(500).json({
      data: error,
    });
  }

  
}

module.exports.recheckSubmit = async (req, res) => {
  const account_no = req.body["account_no"];
  const gateway_submit_id = req.body["gateway_submit_id"];
  const book_bl = req.body["book_bl"];

  console.log({
    "a": account_no,
    "b": gateway_submit_id,
    "c": book_bl
  })

  let online_bl_result;
  let gateway_collected_amount_result;
  let update_7_sodosso_vorti;
  let update_3_sonchoy_collection_gateway;

  let gateway_collection_amount;
  let online_bl;
  let collected_bl;


  // check file is for sonchoy or kisti
  const ac_des_id_result =  await db.execute(`SELECT ac_des_id FROM 3_sonchoy_collection_gateway WHERE sl_2 = ?`, [gateway_submit_id]);
  const ac_des_id = ac_des_id_result[0][0]["ac_des_id"];

  if(ac_des_id === '1006'){
    // sonchoy
    online_bl_result = await db.execute(
      `SELECT online_sonchoy_bl FROM 7_sodosso_vorti WHERE serial = ?`,
      [account_no]
    );

    gateway_collected_amount_result = await db.execute(
      `SELECT cr_amount FROM 3_sonchoy_collection_gateway WHERE sl_2 = ?`,
      [gateway_submit_id]
    );

    gateway_collection_amount =
      gateway_collected_amount_result[0][0]["cr_amount"];
    online_bl = online_bl_result[0][0]["online_sonchoy_bl"];
    collected_bl = online_bl + gateway_collection_amount;

    if (Number(collected_bl) == Number(sonchoy_bl)) {
      update_7_sodosso_vorti = await db.execute(
        `UPDATE 7_sodosso_vorti SET online_sonchoy_bl = ? AND sonchoy_book_bl=? WHERE serial = ?`,
        [collected_sonchoy_bl, sonchoy_book_bl, account_no]
      );

      update_3_sonchoy_collection_gateway = await db.execute(
        `UPDATE 3_sonchoy_collection_gateway SET gateway_chk = ? WHERE sl_2 = ?`,
        [2, gateway_submit_id]
      );

      console.log(update_7_sodosso_vorti);
      console.log(update_3_sonchoy_collection_gateway);

      if (
        update_7_sodosso_vorti != null &&
        update_3_sonchoy_collection_gateway != null
      ) {
        res.json({
          data: "Recheck success",
        });
      } else {
        res.status(404).json({
          data: "recheck failed",
        });
      }
    } else {
      res.status(404).json({
        data: "Collected Sonchoy Bl & Sonchoy Book Bl is Not Same",
      });
    }
  }else{
    // kisti

    online_bl_result = await db.execute(
      `SELECT online_kisti_bl FROM 7_sodosso_vorti WHERE serial = ?`,
      [account_no]
    );

    gateway_collected_amount_result = await db.execute(
      `SELECT dr_amount FROM 3_sonchoy_collection_gateway WHERE sl_2 = ?`,
      [gateway_submit_id]
    );

    gateway_collection_amount = parseInt(
      gateway_collected_amount_result[0][0]["dr_amount"]
    );
    online_bl = online_bl_result[0][0]["online_kisti_bl"];
    console.log({
      online_bl: online_bl,
      gateway_collection_amount: gateway_collection_amount,
    });
    collected_bl = online_bl + gateway_collection_amount;

    if (Number(collected_bl) == Number(book_bl)) {
      update_7_sodosso_vorti = await db.execute(
        `UPDATE 7_sodosso_vorti SET online_kisti_bl = ? AND kisti_book_bl=? WHERE serial = ?`,
        [collected_bl, book_bl, account_no]
      );

      update_3_sonchoy_collection_gateway = await db.execute(
        `UPDATE 3_sonchoy_collection_gateway SET re_check = ? WHERE sl_2 = ?`,
        [2, gateway_submit_id]
      );

      console.log(update_7_sodosso_vorti);
      console.log(update_3_sonchoy_collection_gateway);

      if (
        update_7_sodosso_vorti != null &&
        update_3_sonchoy_collection_gateway != null
      ) {
        res.status(200).json({
          data: "Recheck success",
        });
      } else {
        res.status(404).json({
          data: "Recheck failed",
        });
      }
    } else {
      res.status(404).json({
        data: "Collected Kisti Bl & Kisti Book Bl is Not Same",
        collected_bl: collected_bl,
        book_bl: book_bl
      });
    }

  }


}

module.exports.gatewaySonchoyRecheck = async (req, res) => {
  const account_no = req.body["account_no"];
  const gateway_submit_id = req.body["getway_submit_id"];
  const sonchoy_book_bl = req.body["sonchoy_book_bl"];
  try {
    const online_sonchoy_bl_result = await db.execute(
      `SELECT online_sonchoy_bl FROM 7_sodosso_vorti WHERE serial = ?`,
      [account_no]
    );
    const gateway_collected_sonchoy_amount_result = await db.execute(
      `SELECT cr_amount FROM 3_sonchoy_collection_gateway WHERE sl_2 = ?`,
      [gateway_submit_id]
    );
    const gateway_collection_sonchoy_amount =
      gateway_collected_sonchoy_amount_result[0][0]["cr_amount"];
    const online_sonchoy_bl =
      online_sonchoy_bl_result[0][0]["online_sonchoy_bl"];
    const collected_sonchoy_bl =
      online_sonchoy_bl + gateway_collection_sonchoy_amount;

    if (Number(collected_sonchoy_bl) == Number(sonchoy_book_bl)) {
      const result1 = await db.execute(
        `UPDATE 7_sodosso_vorti SET online_sonchoy_bl = ? AND sonchoy_book_bl=? WHERE serial = ?`,
        [collected_sonchoy_bl, sonchoy_book_bl, account_no]
      );

      const result2 = await db.execute(
        `UPDATE 3_sonchoy_collection_gateway SET gateway_chk = ? WHERE sl_2 = ?`,
        [2, gateway_submit_id]
      );

      console.log(result1);
      console.log(result2);

      if (result1 != null && result2 != null) {
        res.json({
          data: "Recheck success",
        });
      } else {
        res.status(404).json({
          data: "recheck failed",
        });
      }
    } else {
      res.status(404).json({
        data: "Collected Sonchoy Bl & Sonchoy Book Bl is Not Same",
      });
    }
  } catch (error) {
    res.status(500).json({
      data: error,
    });
  }
};


module.exports.finalSubmit = async (req, res) => {
    const serial = req.body['serial'];

    try {
        const selectSql = `SELECT * FROM 3_sonchoy_collection_gateway WHERE sl_2 = ?`;
        const gatewaySelectionResult = await db.execute(selectSql, [serial]);
        

        if (
          !gatewaySelectionResult[0] ||
          gatewaySelectionResult[0].length === 0
        ) {
          return res.status(404).json({ error: "Sheet not found" });
        }


        let gatewayResult = gatewaySelectionResult[0][0];


        
    const finalInsertSql = `INSERT INTO 3_sonchoy_collection (
    receipt_num, date, account_no, name, ac_sector_id, ac_sector_name, ac_des_id, ac_des_name,
    dr_amount, cr_amount, balance, total_balance, comments, comment, select_dr_cr, s_id_c_s, s_name,
    s_ac_sector_id, s_ac_sector_name, s_ac_des_id, s_ac_des_name, s_dr_balance, s_cr_balance,
    s_balance, s_total_balance, s_comments, s_select_dr_cr, pp_s_name, serial, kisti, check_value,
    cc, so_code, password, phone_no, barir_code, withdraw, name_sabek_cash, invoice, kaliya_ac,
    op_code, kisti_sale, a, b, current_sonchoy, jomakarir_name, cash_joma, Q_total, cashier_name,
    aday_biboron, cash_kha_s_numb, submit_by, jomakarir_id, date_2, value_2, c_so_code,
    pokky_jomakarir_name, chk_5, check_value_2, kisti_reposting, old_sl_2, dr_due,
    cr_due, collection_bar, p_code, cash_kha_s_name, sr_dhoron, meyad
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      gatewayResult.receipt_num,
      gatewayResult.date,
      gatewayResult.account_no || "",
      gatewayResult.name || "",
      gatewayResult.ac_sector_id,
      gatewayResult.ac_sector_name,
      gatewayResult.ac_des_id,
      gatewayResult.ac_des_name,
      gatewayResult.dr_amount,
      gatewayResult.cr_amount,
      gatewayResult.balance,
      gatewayResult.total_balance,
      gatewayResult.comments || "",
      gatewayResult.comment,
      gatewayResult.select_dr_cr,
      gatewayResult.s_id_c_s || "",
      gatewayResult.s_name || "",
      gatewayResult.s_ac_sector_id,
      gatewayResult.s_ac_sector_name,
      gatewayResult.s_ac_des_id,
      gatewayResult.s_ac_des_name,
      gatewayResult.s_dr_balance,
      gatewayResult.s_cr_balance,
      gatewayResult.s_balance,
      parseInt(gatewayResult.s_total_balance),
      gatewayResult.s_comments,
      gatewayResult.s_select_dr_cr,
      gatewayResult.pp_s_name,
      gatewayResult.serial || 0,
      gatewayResult.kisti || 0,
      gatewayResult.check_value,
      gatewayResult.cc || 0,
      gatewayResult.so_code || 0,
      gatewayResult.password,
      gatewayResult.phone_no || "",
      gatewayResult.barir_code || 0,
      gatewayResult.withdraw,
      gatewayResult.name_sabek_cash,
      gatewayResult.invoice,
      gatewayResult.kaliya_ac,
      gatewayResult.op_code || "",
      gatewayResult.kisti_sale,
      gatewayResult.a,
      gatewayResult.b,
      gatewayResult.current_sonchoy,
      gatewayResult.jomakarir_name,
      gatewayResult.cash_joma,
      gatewayResult.Q_total,
      gatewayResult.cashier_name,
      gatewayResult.aday_biboron,
      gatewayResult.cash_kha_s_numb,
      gatewayResult.submit_by,
      gatewayResult.jomakarir_id,
      gatewayResult.date_2,
      gatewayResult.value_2,
      gatewayResult.c_so_code,
      gatewayResult.pokky_jomakarir_name,
      gatewayResult.chk_5,
      gatewayResult.check_value_2,
      gatewayResult.kisti_reposting,
      gatewayResult.old_sl_2,
      gatewayResult.dr_due,
      gatewayResult.cr_due,
      gatewayResult.collection_bar || "",
      gatewayResult.p_code,
      gatewayResult.cash_kha_s_name,
      "",
      ""
    ];


    const deleteSql = `DELETE FROM 3_sonchoy_collection_gateway WHERE sl_2 = ?`;

    const drcrCheckSql = `SELECT s_select_dr_cr FROM 3_sonchoy_collection_gateway WHERE sl_2 = ?`;

    const drcrCheckResult = await db.execute(drcrCheckSql, [serial]);

    if (drcrCheckResult[0][0]["s_select_dr_cr"] === "dr") {

    const gatewayCheckSonchoy = `UPDATE 7_sodosso_vorti SET gateway_check_sonchoy = ? WHERE serial = ?`;

    await db.execute(gatewayCheckSonchoy, [0, serial]);
    } else {
      const gatewayCheckSonchoy = `UPDATE 7_sodosso_vorti SET gateway_check_kisti = ? WHERE serial = ?`;

      await db.execute(gatewayCheckSonchoy, [0, serial]);
    }

    


    console.log(values);

    const result = await db.execute(finalInsertSql, values);

    await db.execute(deleteSql, [serial])

    console.log({
      message: "from sonchoy model",
      data: result,
    });

    ////////////////////////////////
    console.log(result);

    if (result != null) {


      res.json({
        data: "successfully saved data",
      });
    } else {
      res.status(404).json({
        data: "failed to save data",
      });
    }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}