const { db } = require("../config/dbConfig");


module.exports.kistiSubmit = async (req, res) => {
  try {
    const data = req.body;
    // default value
    const cr_amount = data.kisti;
    const dr_amount = 0;
    const s_dr_balance = data.kisti;
    const s_cr_balance = 0;
    const c_ac_sector_id = "5007";
    const c_ac_sector_name = "dadon_balance";
    const c_ac_des_id = "1007";
    const c_ac_des_name = "kisti_joma";
    const negative_positive = "positive";
    const s_negative_positive = "negative";
    const c_select_dr_cr = "cr";
    const s_select_dr_cr = "dr";
    const s_ac_sector_id = "5024";
    const s_ac_sector_name = "recharge_balance";
    const s_ac_des_id = new Date().getFullYear();
    const s_ac_des_name = "send_money";
    const currentDate = new Date().toISOString().slice(0, 10);

    // data received from request
    const account_no = data.account_no;
    const sonchoy = data.sonchoy;
    const kisti = data.kisti;
    const name = data.name;
    const comments = data.comments;
    const s_id_c_s = data.s_id_c_s;
    const s_name = data.name;
    const serial = data.serial;
    const cc = data.cc;
    const so_code = data.so_code;
    const phone_no = data.phone_no;
    const barir_code = data.barir_code;
    const op_code = data.op_code;
    const collection_status = data.sonchoy_collection_status;
    const collection_bar = data.collection_bar;

    // customer total dr
    const c_total_dr_sql = `SELECT sum(dr_amount) AS total FROM  3_sonchoy_collection WHERE account_no=? AND ac_sector_id=?`;
    const ctdrs_result = await db.execute(c_total_dr_sql, [
      data.account_no,
      c_ac_sector_id,
    ]);
    const c_total_dr = ctdrs_result[0][0]["total"];
    console.log({ total: c_total_dr });

    //customer total cr
    const c_total_cr_sql = `SELECT sum(cr_amount) AS total FROM  3_sonchoy_collection WHERE account_no=? AND ac_sector_id=?`;
    const ctcrs_result = await db.execute(c_total_cr_sql, [
      data.account_no,
      c_ac_sector_id,
    ]);
    const c_total_cr = ctcrs_result[0][0]["total"];
    console.log({ total: c_total_cr });

    // staff total dr
    const s_total_dr_sql = `SELECT sum(dr_amount) AS total FROM  3_sonchoy_collection WHERE account_no=? AND ac_sector_id=?`;
    const stdrs_result = await db.execute(s_total_dr_sql, [
      data.account_no,
      s_ac_sector_id,
    ]);
    const s_total_dr = stdrs_result[0][0]["total"];
    console.log({ total: s_total_dr });

    //staff total cr
    const s_total_cr_sql = `SELECT sum(cr_amount) AS total FROM  3_sonchoy_collection WHERE s_id_c_s=? AND s_ac_sector_id=?`;
    const stcrs_result = await db.execute(s_total_cr_sql, [
      data.s_id_c_s,
      s_ac_sector_id,
    ]);
    const s_total_cr = stcrs_result[0][0]["total"];
    console.log({ total: s_total_cr });

    const c_balance = c_total_dr - c_total_cr - (cr_amount + dr_amount);
    const s_balance = s_total_dr - s_total_cr + (s_dr_balance - s_cr_balance);

    console.log({
      c_balance: c_balance,
      s_balance: c_balance,
    });

    // account sector dr/cr calculation
    const c_ac_sec_dr_sql = `SELECT sum(dr_amount) AS total FROM  3_sonchoy_collection WHERE ac_sector_id=?`;
    const c_ac_sec_dr_sql_result = await db.execute(c_ac_sec_dr_sql, [
      c_ac_sector_id,
    ]);
    const c_ac_sec_dr = c_ac_sec_dr_sql_result[0][0]["total"];
    console.log({ total: c_ac_sec_dr });

    const c_ac_sec_cr_sql = `SELECT sum(cr_amount) AS total FROM  3_sonchoy_collection WHERE ac_sector_id=?`;
    const c_ac_sec_cr_sql_result = await db.execute(c_ac_sec_cr_sql, [
      c_ac_sector_id,
    ]);
    const c_ac_sec_cr = c_ac_sec_cr_sql_result[0][0]["total"];
    console.log({ total: c_ac_sec_cr });

    const s_ac_sec_dr_sql = `SELECT sum(s_dr_balance) AS total FROM  3_sonchoy_collection WHERE s_ac_sector_id=?`;
    const s_ac_sec_dr_sql_result = await db.execute(s_ac_sec_dr_sql, [
      s_ac_sector_id,
    ]);
    const s_ac_sec_dr = s_ac_sec_dr_sql_result[0][0]["total"];
    console.log({ total: s_ac_sec_dr });

    const s_ac_sec_cr_sql = `SELECT sum(s_cr_balance) AS total FROM  3_sonchoy_collection WHERE s_ac_sector_id=?`;
    const s_ac_sec_cr_sql_result = await db.execute(s_ac_sec_cr_sql, [
      s_ac_sector_id,
    ]);
    const s_ac_sec_cr = s_ac_sec_cr_sql_result[0][0]["total"];
    console.log({ total: s_ac_sec_cr });

    const c_total_balance = c_ac_sec_dr - c_ac_sec_cr - cr_amount;
    const s_total_balance = s_ac_sec_dr - s_ac_sec_cr + s_dr_balance;

    console.log({
      c_total_balance: c_total_balance,
      s_total_balance: s_total_balance,
    });

    // if (negative_positive === "negative") {
    //   if (c_balance >= 0) {
    //     res.status(406).json({
    //       data: "don't Inserted negative  2",
    //     });
    //     return;
    //   }
    // } else if (negative_positive === "positive") {
    //   if (c_balance <= 0) {
    //     res.status(406).json({
    //       data: "সদস্যর নিকট আরও কম টাকা পাওনা 4",
    //     });
    //     return;
    //   }
    // }

    // if (s_negative_positive === "negative") {
    //   if (s_balance >= 0) {
    //     res.status(406).json({
    //       data: "Insufficient recharge balance",
    //     });
    //     return;
    //   }
    // } else if (s_negative_positive === "positive") {
    //   if (s_balance <= 0) {
    //     res.status(406).json({
    //       data: "Dont inserted possitive 8",
    //     });
    //     return;
    //   }
    // }

    const sql = `INSERT INTO 3_sonchoy_collection_gateway (
    receipt_num, date, account_no, name, ac_sector_id, ac_sector_name, ac_des_id, ac_des_name,
    dr_amount, cr_amount, balance, total_balance, comments, comment, select_dr_cr, s_id_c_s, s_name,
    s_ac_sector_id, s_ac_sector_name, s_ac_des_id, s_ac_des_name, s_dr_balance, s_cr_balance,
    s_balance, s_total_balance, s_comments, s_select_dr_cr, pp_s_name, serial, kisti, check_value,
    cc, so_code, password, phone_no, barir_code, withdraw, name_sabek_cash, invoice, kaliya_ac,
    op_code, kisti_sale, a, b, current_sonchoy, jomakarir_name, cash_joma, Q_total, cashier_name,
    aday_biboron, cash_kha_s_numb, submit_by, jomakarir_id, date_2, value_2, c_so_code,
    pokky_jomakarir_name, chk_5, check_value_2, kisti_reposting, old_sl_2, dr_due,
    cr_due, collection_bar, p_code, collection_status, chk_skip, re_check, cash_kha_s_name
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      "",
      currentDate,
      account_no || "",
      name || "",
      c_ac_sector_id,
      c_ac_sector_name,
      c_ac_des_id,
      c_ac_des_name,
      dr_amount,
      cr_amount,
      c_balance,
      c_total_balance,
      comments || "",
      "",
      c_select_dr_cr,
      s_id_c_s || "",
      s_name || "",
      s_ac_sector_id,
      s_ac_sector_name,
      s_ac_des_id,
      s_ac_des_name,
      s_dr_balance,
      s_cr_balance,
      s_balance,
      parseInt(s_total_balance),
      "",
      s_select_dr_cr,
      "",
      serial || 0,
      kisti || 0,
      0,
      cc || 0,
      so_code || 0,
      0,
      phone_no || "",
      barir_code || 0,
      0,
      "",
      "",
      "",
      op_code || "",
      0,
      0,
      0,
      0,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      0,
      "",
      "",
      0,
      "",
      0,
      0,
      "",
      "",
      "",
      "",
      collection_bar || "",
      0,
      collection_status || 0,
      0,
      0,
      "",
    ];


    console.log(values);

    const result = await db.execute(sql, values);

    console.log({
      message: "from sonchoy model",
      data: result,
    });

    ////////////////////////////////
    console.log(result);

    if (result != null) {

      const collectionStatusSql = `SELECT kisti_collection_status FROM 7_sodosso_vorti WHERE serial = ?`;

      const collectionStatusResult = await db.execute(collectionStatusSql, [
        serial,
      ]);

      console.log(collectionStatusResult);

      const gatewayCheckKisti = `UPDATE 7_sodosso_vorti SET gateway_check_kisti = ? WHERE serial = ?`;

      await db.execute(gatewayCheckKisti, [1, serial]);


      if (collectionStatusResult[0][0]["kisti_collection_status"] === 30) {
        const kistiLastCollectionMonthUpdateSql = `UPDATE 7_sodosso_vorti SET kisti_last_collection_month = ? WHERE serial = ?`;

        await db.execute(kistiLastCollectionMonthUpdateSql, [
          currentDate,
          serial,
        ]);
      }

      

      


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
};




module.exports.bokeyaKistiSubmit = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    // default value
    const cr_amount = data.kisti;
    const dr_amount = 0;
    const s_dr_balance = 0;
    const s_cr_balance = 0;
    const c_ac_sector_id = "";
    const c_ac_sector_name = "";
    const c_ac_des_id = "";
    const c_ac_des_name = "";
    const negative_positive = "positive";
    const s_negative_positive = "negative";
    const c_select_dr_cr = "";
    const s_select_dr_cr = "";
    const s_ac_sector_id = "";
    const s_ac_sector_name = "";
    const s_ac_des_id = new Date().getFullYear();
    const s_ac_des_name = "";
    const currentDate = new Date().toISOString().slice(0, 10);

    // data received from request
    const account_no = data.account_no;
    const sonchoy = data.sonchoy;
    const kisti = data.kisti;
    const name = data.name;
    const comments = data.comments;
    const s_id_c_s = data.s_id_c_s;
    const s_name = data.name;
    const serial = data.serial;
    const cc = data.cc;
    const so_code = data.so_code;
    const phone_no = data.phone_no;
    const barir_code = data.barir_code;
    const op_code = data.op_code;
    const collection_status = data.sonchoy_collection_status;
    const collection_bar = data.collection_bar;

    // // customer total dr
    // const c_total_dr_sql = `SELECT sum(dr_amount) AS total FROM  3_sonchoy_collection WHERE account_no=? AND ac_sector_id=?`;
    // const ctdrs_result = await db.execute(c_total_dr_sql, [
    //   data.account_no,
    //   c_ac_sector_id,
    // ]);
    // const c_total_dr = ctdrs_result[0][0]["total"];
    // console.log({ total: c_total_dr });

    // //customer total cr
    // const c_total_cr_sql = `SELECT sum(cr_amount) AS total FROM  3_sonchoy_collection WHERE account_no=? AND ac_sector_id=?`;
    // const ctcrs_result = await db.execute(c_total_cr_sql, [
    //   data.account_no,
    //   c_ac_sector_id,
    // ]);
    // const c_total_cr = ctcrs_result[0][0]["total"];
    // console.log({ total: c_total_cr });

    // // staff total dr
    // const s_total_dr_sql = `SELECT sum(dr_amount) AS total FROM  3_sonchoy_collection WHERE account_no=? AND ac_sector_id=?`;
    // const stdrs_result = await db.execute(s_total_dr_sql, [
    //   data.account_no,
    //   s_ac_sector_id,
    // ]);
    // const s_total_dr = stdrs_result[0][0]["total"];
    // console.log({ total: s_total_dr });

    // //staff total cr
    // const s_total_cr_sql = `SELECT sum(cr_amount) AS total FROM  3_sonchoy_collection WHERE s_id_c_s=? AND s_ac_sector_id=?`;
    // const stcrs_result = await db.execute(s_total_cr_sql, [
    //   data.s_id_c_s,
    //   s_ac_sector_id,
    // ]);
    // const s_total_cr = stcrs_result[0][0]["total"];
    // console.log({ total: s_total_cr });

    // const c_balance = c_total_dr - c_total_cr - (cr_amount + dr_amount);
    // const s_balance = s_total_dr - s_total_cr + (s_dr_balance - s_cr_balance);

    // console.log({
    //   c_balance: c_balance,
    //   s_balance: c_balance,
    // });

    // // account sector dr/cr calculation
    // const c_ac_sec_dr_sql = `SELECT sum(dr_amount) AS total FROM  3_sonchoy_collection WHERE ac_sector_id=?`;
    // const c_ac_sec_dr_sql_result = await db.execute(c_ac_sec_dr_sql, [
    //   c_ac_sector_id,
    // ]);
    // const c_ac_sec_dr = c_ac_sec_dr_sql_result[0][0]["total"];
    // console.log({ total: c_ac_sec_dr });

    // const c_ac_sec_cr_sql = `SELECT sum(cr_amount) AS total FROM  3_sonchoy_collection WHERE ac_sector_id=?`;
    // const c_ac_sec_cr_sql_result = await db.execute(c_ac_sec_cr_sql, [
    //   c_ac_sector_id,
    // ]);
    // const c_ac_sec_cr = c_ac_sec_cr_sql_result[0][0]["total"];
    // console.log({ total: c_ac_sec_cr });

    // const s_ac_sec_dr_sql = `SELECT sum(s_dr_balance) AS total FROM  3_sonchoy_collection WHERE s_ac_sector_id=?`;
    // const s_ac_sec_dr_sql_result = await db.execute(s_ac_sec_dr_sql, [
    //   s_ac_sector_id,
    // ]);
    // const s_ac_sec_dr = s_ac_sec_dr_sql_result[0][0]["total"];
    // console.log({ total: s_ac_sec_dr });

    // const s_ac_sec_cr_sql = `SELECT sum(s_cr_balance) AS total FROM  3_sonchoy_collection WHERE s_ac_sector_id=?`;
    // const s_ac_sec_cr_sql_result = await db.execute(s_ac_sec_cr_sql, [
    //   s_ac_sector_id,
    // ]);
    // const s_ac_sec_cr = s_ac_sec_cr_sql_result[0][0]["total"];
    // console.log({ total: s_ac_sec_cr });

    // const c_total_balance = c_ac_sec_dr - c_ac_sec_cr - cr_amount;
    // const s_total_balance = s_ac_sec_dr - s_ac_sec_cr + s_dr_balance;

    // console.log({
    //   c_total_balance: c_total_balance,
    //   s_total_balance: s_total_balance,
    // });

    // if (negative_positive === "negative") {
    //   if (c_balance >= 0) {
    //     res.status(406).json({
    //       data: "don't Inserted negative  2",
    //     });
    //     return;
    //   }
    // } else if (negative_positive === "positive") {
    //   if (c_balance <= 0) {
    //     res.status(406).json({
    //       data: "সদস্যর নিকট আরও কম টাকা পাওনা 4",
    //     });
    //     return;
    //   }
    // }

    // if (s_negative_positive === "negative") {
    //   if (s_balance >= 0) {
    //     res.status(406).json({
    //       data: "Insufficient recharge balance",
    //     });
    //     return;
    //   }
    // } else if (s_negative_positive === "positive") {
    //   if (s_balance <= 0) {
    //     res.status(406).json({
    //       data: "Dont inserted possitive 8",
    //     });
    //     return;
    //   }
    // }

    const sql = `INSERT INTO 3_sonchoy_collection_gateway (
    receipt_num, date, account_no, name, ac_sector_id, ac_sector_name, ac_des_id, ac_des_name,
    dr_amount, cr_amount, balance, total_balance, comments, comment, select_dr_cr, s_id_c_s, s_name,
    s_ac_sector_id, s_ac_sector_name, s_ac_des_id, s_ac_des_name, s_dr_balance, s_cr_balance,
    s_balance, s_total_balance, s_comments, s_select_dr_cr, pp_s_name, serial, kisti, check_value,
    cc, so_code, password, phone_no, barir_code, withdraw, name_sabek_cash, invoice, kaliya_ac,
    op_code, kisti_sale, a, b, current_sonchoy, jomakarir_name, cash_joma, Q_total, cashier_name,
    aday_biboron, cash_kha_s_numb, submit_by, jomakarir_id, date_2, value_2, c_so_code,
    pokky_jomakarir_name, chk_5, check_value_2, kisti_reposting, old_sl_2, dr_due,
    cr_due, collection_bar, p_code, collection_status, chk_skip, re_check, cash_kha_s_name
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      "",
      currentDate,
      account_no || "",
      name || "",
      c_ac_sector_id,
      c_ac_sector_name,
      c_ac_des_id,
      c_ac_des_name,
      dr_amount,
      0,
      0,
      0,
      comments || "",
      "",
      c_select_dr_cr,
      s_id_c_s || "",
      s_name || "",
      s_ac_sector_id,
      s_ac_sector_name,
      s_ac_des_id,
      s_ac_des_name,
      s_dr_balance,
      s_cr_balance,
      0,
      0,
      "",
      s_select_dr_cr,
      "",
      serial || 0,
      kisti || 0,
      0,
      cc || 0,
      so_code || 0,
      0,
      phone_no || "",
      barir_code || 0,
      0,
      "",
      "",
      "",
      op_code || "",
      0,
      0,
      0,
      0,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      0,
      "",
      "",
      0,
      "",
      0,
      0,
      "",
      "",
      cr_amount,
      "",
      collection_bar || "",
      0,
      collection_status || 0,
      0,
      0,
      "",
    ];

    console.log(values);

    const result = await db.execute(sql, values);

    console.log({
      message: "from kisti model",
      data: result,
    });

    ////////////////////////////////
    console.log(result);

    if (result != null) {




      const collectionStatusSql = `SELECT kisti_collection_status FROM 7_sodosso_vorti WHERE serial = ?`;

      const collectionStatusResult = await db.execute(collectionStatusSql, [
        serial,
      ]);

      console.log(collectionStatusResult);

      const kistiLastCollectionMonthUpdateSql = `UPDATE 7_sodosso_vorti SET kisti_last_collection_month = ? WHERE serial = ?`;
      const gatewayCheckKisti = `UPDATE 7_sodosso_vorti SET gateway_check_kisti = ? WHERE serial = ?`;

      await db.execute(gatewayCheckKisti, [1,serial]);

      if (collectionStatusResult[0][0]["kisti_collection_status"] === 30) {
        await db.execute(kistiLastCollectionMonthUpdateSql, [
          currentDate,
          serial,
        ]);
      }







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
};
