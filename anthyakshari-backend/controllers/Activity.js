const jwt = require('jsonwebtoken');
const db = require('../model/db');
const { promisify } = require('util');
const bcrypt = require('bcryptjs');
const contactid = require('../Idgen/Idgen');
var visits = 0;
const global1 = {}


exports.login = async (req, res, next) => {
    const { email, password } = req.body;
  
    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).render("login", {
        message: 'Please provide email and password'
      });
    }
  

    // 2) Check if user exists && password is correct
    db.start.query('SELECT * FROM user_table WHERE userEmail = ?', [email], async (error, results) => {
      if(error){
        console.log(error)
      }
      console.log(results);
      console.log(password);
      /*if(results[0].userEmail == 'null'){
        return res.status(401).render("login", {
          message: 'Email do not exist'
        });
      }*/
      const isMatch = await bcrypt.compare(password, results[0].userPwd);
      console.log(isMatch);
      if(!results || !isMatch ) {
        return res.status(401).render("login", {
          message: 'Incorrect email or password'
        });
      } else {
        // 3) If everything ok, send token to client
            global1.id = results[0].user_Id;
            function Lid() {
                console.log(global1.id);
            }
            Lid();
        const id = results[0].user_Id;
        console.log(id)
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
        });
  
        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
          ),
          httpOnly: true
        };
        res.cookie('jwt', token, cookieOptions);
        db.start.query('SELECT * FROM delete_user WHERE user_Id = ?',[global1.id], (error, results) =>{
          if(error){
            console.log(error)
          }
          console.log(results)
          if(results[0].account_Status == 'Yes' && results[0].present_DateTime < results[0].expiry_DateTime ){
            res.status(200).redirect("/redirect");
          } else {
            res.status(200).redirect("/profile")
      }
          })
      }
    });
      












  };
  
  //Profile
  exports.profile = (req, res) => {
    console.log(req.body)
    console.log('Profile user_Id is '+global1.id)
    const { firstname, lastname, email, language, dob, gender, phone, uploaded_image } = req.body;
    console.log('My image is '+uploaded_image)
    db.start.query('UPDATE user_table SET userFirst = ?, userLast = ?, userEmail = ?, userPhno = ?, userLanguage = ?, userDob = ?, userGender = ?, userImage = ? WHERE user_Id = ?', [firstname, lastname, email, phone, language, dob, gender, uploaded_image, global1.id], (error, result) => {
    if(error){
        console.log(error)
    }
    });
    res.redirect('/profile')
}
//My page
exports.mypage = (req, res) => {
  console.log(req.body)
  console.log('My page user_Id is '+global1.id)
  const { bio, achievements, goals, portflio, awards, website } = req.body;
  db.start.query('UPDATE user_table SET userBio = ?, userAchievements = ?, userGoals = ?, userPortflioLink = ?, userAwards = ?, userWebsite =? WHERE user_Id = ?',[ bio, achievements, goals, portflio, awards, website, global1.id ], (error, result) =>{
    if(error){
      console.log(error)
    }
    res.redirect('/mypage')
  })
}
//Spin coins
exports.spin = (req, res) =>{
  console.log(req.body)
  console.log('My Spin coins user_Id is '+global1.id)
  const { coinvalue } = req.body
  db.start.query('SELECT userCoins FROM user_table WHERE user_Id = ?', [global1.id], (error, results) =>{
    if(error){
      console.log(error)
    }
    const Total = (parseInt(results[0].userCoins)+(parseInt(coinvalue)))
    db.start.query('UPDATE user_table SET userCoins = ? WHERE user_Id = ?', [Total, global1.id], (error, results) =>{
      if(error){
        console.log(error)
      }
      res.redirect('/spin')
    })
  })  
}

//Change password
exports.changepass = (req, res) =>{
  console.log('My Change Password user_Id is '+global1.id)
  console.log(req.body)
  const { currentpassword, password, confirmpassword } = req.body;
  db.start.query('SELECT userPwd FROM user_table WHERE user_Id = ?',[global1.id], async (error, results) =>{
    if(error){
      console.log(error)
    } 
    console.log('my current password is '+results[0].userPwd)
    const isMatch = await bcrypt.compare(currentpassword, results[0].userPwd);
    if(!results || !isMatch ) {
      return res.status(401).render("changepass", {
        message: ' Current Password is Incorrect'
      });
    } else if(password !== confirmpassword) {
        return res.render('changepass', {
          message: 'Passwords do not match'
        });
      } else {
        let hashedPassword = await bcrypt.hash(password, 8);
        db.start.query('UPDATE user_table SET userPwd = ? WHERE user_Id = ?',[hashedPassword, global1.id], (error, results) =>{
          if(error){
            console.log(error)
          }
          res.redirect('/changepass')
        })
      }
  })
}
//Contact Us
exports.contact = (req, res) =>{
  const count = 'SUPN'+contactid+visits++
  console.log('My contact page user_Id is '+global1.id)
  console.log(req.body)
  const { name, email, message } = req.body;
  db.start.query('INSERT INTO contact_Us SET ?', {contact_Id: count, user_Id: global1.id, userName: name, userEmail: email, userMessage: message}, (error, results) =>{
    if(error){
      console.log(error)
    }
    console.log(results)
    res.render('contact', {
      message: 'Thanks for contacting keep this support ticket for future reference '+'#'+count
    });
  })
}
// Account Delete 
exports.delete = (req, res) =>{
var dateTime = new Date();
var date = dateTime.getFullYear()+''+(dateTime.getMonth()+1)+''+dateTime.getDate();
var time = dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();
var formate = date+' '+time;
var date1 = dateTime.getFullYear()+''+(dateTime.getMonth()+2)+''+dateTime.getDate();
var time1 = dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();
var formate2 = date1+' '+time1;
db.start.query('INSERT INTO delete_user SET ?', { user_Id: global1.id, present_DateTime: formate, expiry_DateTime: formate2, account_Status: 'Yes' }, (error, results) =>{
  if(error){
    console.log(error)
  }
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).redirect("/login");
  console.log('my date '+formate2)
})
}
//Top players
exports.topplayers = (req, res) =>{
  var inc = 0;
  console.log('Top players user_Id is '+global1.id)
  var dateTime = new Date();
  var date = dateTime.getFullYear()+'-'+(dateTime.getMonth()+1)+'-'+dateTime.getDate();
  var time = dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();
  var formate = date+' '+time;
  db.start.query('SELECT livecmp_Count FROM game_table WHERE user_Id = ?',[global1.id], (error, results) =>{
    if(error){
      console.log(error)
    }
    inc++
    const Total = (parseInt(results[0].livecmp_Count)+0+inc)
     console.log('Increment by one '+Total)
  db.start.query('UPDATE game_table SET user_Id = ?, livecmp_TimeDate = ?, livecmp_Count = ? WHERE user_Id = ?',[global1.id, formate, Total, global1.id], (error, results) => {
   if(error){
     console.log(error)
   }
   db.start.query('SELECT userCoins FROM user_table WHERE user_Id = ?', [global1.id], (error, results) =>{
     if(error){
       console.log(error)
     }
     var Total1 = results[0].userCoins+100
     db.start.query('UPDATE user_table SET userCoins =? WHERE user_Id = ?',[Total1, global1.id], (error, results) =>{
       if(error){
         console.log(error)
       }
  db.start.query('SELECT * FROM game_table join user_table on user_table.user_Id=game_table.user_Id ORDER BY livecmp_Count DESC',(error, results) =>{
    if(error){
      console.log(error)
    }
    console.log(results)
    res.render('topplayers', {data: results}); 
  })
})
})
})
})
}
//Week Top


exports.isLoggedIn = async (req, res, next) => {
    console.log(req.cookies); 
    if (req.cookies.jwt) {
      try {
        // 1) verify token
        const decoded = await promisify(jwt.verify)(
          req.cookies.jwt,
          process.env.JWT_SECRET
        );
        console.log("decoded");
        console.log(decoded);

      } catch (err) {
        return next();
      }
    } else {
      next();
    }
  };
 


  // function intervalFunc() {
  //   var dateTime = new Date();
  //   var date = dateTime.getDate()+'/'+(dateTime.getMonth()+1)+'/'+dateTime.getFullYear();
  //   var time = dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();
  //   var formate2 = date+' '+time;
  //   console.log('My present Time is '+formate2)
  //   console.log('My future time is '+formate3)
  //        if(formate3 == formate2)
  //        {
  //            clearInterval(intervalFunc)
  //            console.log('exiting')
  //        }
  //        }
  //   setInterval(intervalFunc,2000);