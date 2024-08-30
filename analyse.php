<?php 

$sql_1 = "SELECT sum(dr_amount) AS total FROM  3_sonchoy_collection WHERE account_no=$account_no AND ac_sector_id=$ac_sector_id";
$query_run = mysqli_query($con,$sql_1);
while($row = $query_run->fetch_assoc()){
    $customer_total_dr = $row['total'];
}

$sql_2 = "SELECT sum(cr_amount) AS total FROM  3_sonchoy_collection WHERE account_no=$account_no AND ac_sector_id=$ac_sector_id";
$query_run = mysqli_query($con,$sql_2);
while($row = $query_run->fetch_assoc()){
    $customer_total_cr = $row['total'];
}

$sql_3 = "SELECT sum(s_dr_balance) AS total FROM  3_sonchoy_collection WHERE s_id_c_s=$s_id_c_s AND s_ac_sector_id=$s_ac_sector_id";
$query_run = mysqli_query($con,$sql_3);
while($row = $query_run->fetch_assoc()){
    $staff_total_dr = $row['total'];
}

$sql_4 = "SELECT sum(s_cr_balance) AS total FROM  3_sonchoy_collection WHERE s_id_c_s=$s_id_c_s AND s_ac_sector_id=$s_ac_sector_id";
$query_run = mysqli_query($con,$sql_4);
while($row = $query_run->fetch_assoc()){
    $staff_total_cr = $row['total'];
}

$balance = ($customer_total_dr - $customer_total_cr)-$cr_amount+$dr_amount;
$s_balance = ($staff_total_dr - $staff_total_cr)+$s_dr_balance-$s_cr_balance;



//this is total balance accounting
$sql_5 = "SELECT sum(dr_amount) AS total FROM  3_sonchoy_collection WHERE ac_sector_id=$ac_sector_id";
$query_run = mysqli_query($con,$sql_5);
while($row = $query_run->fetch_assoc()){
    $cust_ac_sec_dr = $row['total'];
}

$sql_6 = "SELECT sum(cr_amount) AS total FROM  3_sonchoy_collection WHERE ac_sector_id=$ac_sector_id";
$query_run = mysqli_query($con,$sql_6);
while($row = $query_run->fetch_assoc()){
    $cust_ac_sec_cr = $row['total'];
}

$sql_7 = "SELECT sum(s_dr_balance) AS total FROM  3_sonchoy_collection WHERE s_ac_sector_id=$s_ac_sector_id";
$query_run = mysqli_query($con,$sql_7);
while($row = $query_run->fetch_assoc()){
    $staff_ac_sec_dr = $row['total'];
}

$sql_8 = "SELECT sum(s_cr_balance) AS total FROM  3_sonchoy_collection WHERE s_ac_sector_id=$s_ac_sector_id";
$query_run = mysqli_query($con,$sql_8);
while($row = $query_run->fetch_assoc()){
    $staff_ac_sec_cr = $row['total'];
}

$total_balance = ($cust_ac_sec_dr - $cust_ac_sec_cr)-$cr_amount;
$s_total_balance = ($staff_ac_sec_dr - $staff_ac_sec_cr)+$s_dr_balance;




if($negative_possitive == "negative"){
    if($balance<=0){
        // echo "inserted negative 1";
    }else{
        $_SESSION['status'] = "   সদস্যর একাউন্টে পর্যাপ্ত  পরিমাণ টাকা নাই 2";
        $_SESSION['status_code'] = "error";
        header("Location: 47_1_a_accounts_dr.php");die();
    }
   
}elseif($negative_possitive == "possitive"){
    if($balance>=0){
        // echo "inserted postive 3";
    }else{
        $_SESSION['status'] = "dont Inserted possitive 4";
        $_SESSION['status_code'] = "error";
        header("Location: 47_1_a_accounts_dr.php");die();
    }
}

if($s_negative_possitive == "negative"){
    if($s_balance<=0){
        // echo "inserted negative 5";
    }else{
        $_SESSION['status'] = " আপনার    রিচার্জ  ব্যালেন্স কম।দয়া করে রিচার্জ করুন 6";
        $_SESSION['status_code'] = "error";
        header("Location: 47_1_a_accounts_dr.php");die();
    }
   
}elseif($s_negative_possitive == "possitive"){
    if($s_balance>=0){
        // echo "inserted postive 7";
    }else{
        $_SESSION['status'] = "don't Inserted possitive 8";
        $_SESSION['status_code'] = "error";
        header("Location: 47_1_a_accounts_dr.php");die();
    }
}



$query = "INSERT INTO 3_sonchoy_collection(receipt_num, date, account_no, name,ac_sector_id, ac_sector_name, ac_des_id, ac_des_name, dr_amount, cr_amount,balance,total_balance,comments,select_dr_cr, s_id_c_s, s_name, s_ac_sector_id, s_ac_sector_name, s_ac_des_id, s_ac_des_name, s_dr_balance, s_cr_balance,s_balance,s_total_balance,s_comments,s_select_dr_cr)
VALUES ('$receipt_num','$date','$account_no','$name','$ac_sector_id','$ac_sector_name','$ac_des_id','$ac_des_name','$dr_amount','$cr_amount','$balance','$total_balance','$comments','$select_dr_cr','$s_id_c_s','$s_name','$s_ac_sector_id','$s_ac_sector_name','$s_ac_des_id','$s_ac_des_name','$s_dr_balance','$s_cr_balance','$s_balance','$s_total_balance','$s_comments','$s_select_dr_cr')";
$query_run = mysqli_query($con,$query);
if($query_run){

     
   
    $sql_001 = "SELECT sl_2 From 3_sonchoy_collection where account_no='$account_no' ORDER BY sl_2 DESC LIMIT 1";
    $query_run = mysqli_query($con,$sql_001);
    $row = $query_run->fetch_assoc();
    $sl_2 = $row['sl_2'];

    $_SESSION['status'] = "  সফল 12 ";
    $_SESSION['status_code'] = "success";
    $_SESSION['name'] = $name;
    $_SESSION['sl_2'] = $sl_2;
    $_SESSION['$cr_amount'] = $cr_amount;
    $_SESSION['balance'] = $balance;
    $_SESSION['date'] = $date;

    //$ staff
    $_SESSION['s_name'] = $s_name;
    $_SESSION['s_dr_balance'] = $s_dr_balance;
    $_SESSION['s_balance'] = $s_balance;
    $_SESSION['date'] = $date;
    header("Location: 47_1_a_accounts_dr.php");
   
   
}else{
    $_SESSION['sl_2'] = $sl_2;
    $_SESSION['status'] = "Data Don't Insert_13";
    $_SESSION['status_code'] = "error";
    header("Location: 47_1_a_accounts_dr.php");
}







?>