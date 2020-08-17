const jwt = require('jsonwebtoken');
const db = require('../model/db');
const { promisify } = require('util');
const bcrypt = require('bcryptjs');
const userid = require('../Idgen/Idgen');
var nodemailer = require('nodemailer');
var otpGenerator = require('otp-generator');
var visit = 0;
var global2 = {};


exports.register = (req, res) => {
var dateTime = new Date();
var date = dateTime.getDate()+'/'+(dateTime.getMonth()+1)+'/'+dateTime.getFullYear();
var time = dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();
var formate1 = date+' '+time;
visit++;
  console.log(req.body);
  var  otp =  otpGenerator.generate(4, {upperCase: false, specialChars: false, alphabets: false})
  const { name, email, password, phone, passwordConfirm } = req.body;
  // 2) Check if user exists && password is correct
  db.start.query('SELECT userEmail FROM user_table WHERE userEmail = ?', [email], async (error, results) => {
    if(error) {
      console.log(error)
    }
    if(results.length > 0 ) {
      return res.render('register', {
                message: 'That Email has been taken'
              });
    } else if(password !== passwordConfirm) {
      return res.render('register', {
        message: 'Passwords do not match'
      });
    }
      
    let hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);

      
    db.start.query('INSERT INTO user_table SET ?', { user_Id: userid+visit, userName: name, userEmail: email, userPhno: phone, userPwd: hashedPassword, otp: otp, profileIsVerified: 'No', signUpDate: formate1, forgotPasswordIsVerified: 'No', userDiamonds: '25', userCoins: '100' }, (error, result) => {
      if(error) {
        console.log(error)
      } else {
        db.start.query('SELECT user_Id,userEmail FROM user_table WHERE userEmail = ?', [email], (error, result) => {
         if(error){
           console.log(error)
         }
         //token generate for Register
         console.log('Register user_Id is '+result[0].user_Id)
         global2.Rid = result[0].user_Id;
         function rid() {
          console.log(global2.Rid);
      }
      rid();
  const id = result[0].user_Id;
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

          //Mail
          var smtpConfig = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: process.env.USER,
                pass: process.env.PASSWORD
            }
          };
          var transporter = nodemailer.createTransport(smtpConfig);
          
          var mailOptions = {
            from: process.env.USER,
            to: 'abcs@gmail.com',
            subject: 'Mail From Anthyakshari',
            text: `Your four digit verification code for anthyakshri is `+otp
          };
                  
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent has sent to register Email Address');
              console.log('otp is '+otp)
            }
          });    
          res.status(201).render('otpverify')
        });
      }
    });
  });
};

//otpveify
exports.otpverify = (req, res) => {
console.log(req.body)
     const { otp } = req.body;
     console.log(global2.Rid)
     db.start.query('SELECT otp FROM user_table WHERE user_Id = ?', [global2.Rid], (error, results) => {
       if(error){
         console.log(error)
      }else{
      if(otp == results[0].otp)
      {
        db.start.query('UPDATE user_table SET profileIsVerified = "Yes" WHERE user_Id = ?', [global2.Rid], (error, result) =>{
          console.log(result)
          res.status(201).redirect('/login')
        })
    }else{
      res.send('error')
    }
    } 
    });
};
//Resend code
exports.resendcode = (req, res) => {
  var  otp =  otpGenerator.generate(4, {upperCase: false, specialChars: false, alphabets: false})
  console.log(otp);
  console.log('my user_id is '+global2.Rid);
  db.start.query('UPDATE user_table SET otp = ? WHERE user_Id = ?', [otp, global2.Rid], (error, results) => {
    if(error){
      console.log(error)
    }
    res.redirect('/otpverify')
  })
}
//ResetPassword
exports.resetpass = (req, res) => {
var dateTime = new Date();
var date = dateTime.getDate()+'/'+(dateTime.getMonth()+1)+'/'+dateTime.getFullYear();
var time = dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();
var formate2 = date+' '+time;
  console.log('database user_Id '+global2.Rid);
  const { password, confirmpassword } = req.body;
  console.log(req.body)
  db.start.query('SELECT userPwd FROM user_table WHERE user_Id = ?', [global2.Rid], async (error, results) =>{
    if(error){
      console.log(error)
    }
    if(password !== confirmpassword) {
      return res.render('resetpass', {
        message: 'Passwords do not match'
      });
    }else{
      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);
      lastModified = formate2;
      db.start.query('UPDATE user_table SET userPwd = ?, lastModified = ?, forgotPasswordIsVerified	= "Yes" WHERE user_Id = ?',[hashedPassword, lastModified, global2.Rid], (error, results) =>{
        if(error){
          console.log(error)
        }
        res.send('Updated Password');
      })
    }
  })
}
//ForgotPassword
exports.forgotpass = (req, res) => {
  var  otp1 =  otpGenerator.generate(4, {upperCase: false, specialChars: false, alphabets: false})
  console.log('database user_Id '+global2.Rid)
  console.log('Forgot password otp is '+otp1)
  const { otpemail } = req.body;
  console.log(req.body)
  db.start.query('SELECT userEmail FROM user_table WHERE user_Id = ?', [global2.Rid], (error, results) =>{
  if(error){
    console.log(error)
  }
  if(otpemail == results[0].userEmail){
    console.log('Exist')
    console.log(results[0].userEmail)
    //Mail
    var smtpConfig = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
          user: process.env.USER,
          pass: process.env.PASSWORD
      }
    };
    var transporter = nodemailer.createTransport(smtpConfig);
    
    var mailOptions = {
      from: process.env.USER,
      to: 'abcd@gmail.com',
      subject: 'Mail From Anthyakshari',
      text: `Your four digit verification code for anthyakshri is `+otp1
    };
            
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent has sent to register Email Address');
        console.log('otp is '+otp1)
      }
    });
    db.start.query('UPDATE user_table SET otp = ? WHERE user_Id = ?', [otp1, global2.Rid], (error, results) =>{
      if(error){
        console.log(error)
      }
     })
     res.render('forgototp') 
  }else{
    return res.render('forgotpass', {
      message: 'That Email do not Exist'
    });
  }
})
}
//forgototp
exports.forgototp = (req, res) =>{
 console.log(global2.Rid)
 const { otp } = req.body;
 db.start.query('SELECT otp FROM user_table WHERE user_Id = ?',[global2.Rid], (error, results) =>{
   if(error){
     console.log(error)
   }
   console.log(results[0].otp)
   if(results[0].otp == otp){
     res.redirect('/resetpass')
   }else{
     res.send('Error')
   }
 })
}
//forotpresend
exports.forotpresend = (req, res) => {
  console.log(global2.Rid)
  var  otp2 =  otpGenerator.generate(4, {upperCase: false, specialChars: false, alphabets: false})
  console.log('Forgototpresend otp is '+ otp2)
  db.start.query('SELECT otp FROM user_table WHERE user_Id = ?',[global2.Rid], (error, results) =>{
    if(error){
      console.log(error)
    }
    db.start.query('UPDATE user_table SET otp = ? WHERE user_Id = ?',[otp2, global2.Rid], (error, results) =>{
     if(error){
       console.log(error)
     }
     res.redirect('/forgototp')
    })
  })
}

// Only for rendered pages, no errors!
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
 
      // 2) Check if user still exists
      db.start.query('SELECT * FROM user_table WHERE user_Id = ?', [decoded.id], (error, result) => {
        console.log(result)
        if(!result) {
          return next();
        }
        // THERE IS A LOGGED IN USER
        req.user = result[0];
        // res.locals.user = result[0];
        console.log("next")
        return next();
      });
    } catch (err) {
      return next();
    }
  } else {
    next();
  }
};







exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).redirect("/");
};