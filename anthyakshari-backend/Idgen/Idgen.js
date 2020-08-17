var dateTime = new Date();
var date = dateTime.getFullYear()+''+dateTime.getMonth()+''+dateTime.getDate();
var time = dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();
var formate = date+' '+time;
var num1 = 0;



var userid = 'AN'+dateTime.getFullYear()+''+(dateTime.getMonth()+1)+''+dateTime.getDate()+num1;
var contactid = 'TNOAN'+dateTime.getFullYear()+''+(dateTime.getMonth()+1)+''+dateTime.getDate()+num1;


module.exports = contactid;
module.exports = userid;
// ==================================================================================

// if delete is clicked
// {
//     update userid,presenttime,presenttime+30,status="yes"
//     redirect to login
// }

// if login{
//     sql=(select user_table.userEmail,user_table.userPWd,delete_user.account_Status from user_table join delete_user where email = ? on user_table.user_Id=delete_user.user_Id)
//    if email and password matchMedia
//    {

//             if results[0].account_Status="no"{
//             redirect('Landing page')
//             }
//             else {
                
//                 redirect('restore')
//             }
// }
// }

// if rrstore{
//     update delete tabel status ="no" where userid
//     redirect('Landing page')
// }
