const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

// router.get('/', authController.isLoggedIn, (req, res) => {
//   console.log("inside");
//   res.render('index');
// });

router.get('/', authController.isLoggedIn, (req, res) => {
  console.log("inside");
  console.log(req.user);
  res.render('index', {
    user: req.user
  });
});

router.get('/profile', authController.isLoggedIn, (req, res) => {
  if(req.user) {
    res.render('profile', {
      user: req.user
    });
  } else {
    res.redirect("/login");
  }
});

router.get('/mypage', authController.isLoggedIn, (req, res) => {
  if(req.user) {
    res.render('mypage', {
      user: req.user
    });
  } else {
    res.redirect("/login");
  }
});

router.get('/spin', authController.isLoggedIn, (req, res) => {
  if(req.user) {
    res.render('spin', {
      user: req.user
    });
  } else {
    res.redirect("/login");
  }
});

router.get('/changepass', authController.isLoggedIn, (req, res) => {
  if(req.user) {
    res.render('changepass', {
      user: req.user
    });
  } else {
    res.redirect("/login");
  }
});
router.get('/dashboard', authController.isLoggedIn, (req, res) => {
  if(req.user) {
    res.render('dashboard', {
      user: req.user
    });
  } else {
    res.redirect("/login");
  }
});
router.get('/contact', authController.isLoggedIn, (req, res) => {
  if(req.user) {
    res.render('contact', {
      user: req.user
    });
  } else {
    res.redirect("/login");
  }
});
router.get('/delete', authController.isLoggedIn, (req, res) => {
  if(req.user) {
    res.render('delete', {
      user: req.user
    });
  } else {
    res.redirect("/login");
  }
});
router.get('/topplayers', authController.isLoggedIn, (req, res) => {
  if(req.user) {
    res.render('topplayers', {
      user: req.user
    });
  } else {
    res.redirect("/login");
  }
});
router.get('/weektop', authController.isLoggedIn, (req, res) => {
  if(req.user) {
    res.render('weektop', {
      user: req.user
    });
  } else {
    res.redirect("/login");
  }
});

router.get('/sample', authController.isLoggedIn, (req, res) => {
  console.log("inside");
  console.log(req.user);
  if(req.user) {
    res.render('sample', {
      user: req.user
    });
  } else {
    res.redirect("/login");
  }
  
});



router.get('/login', (req, res) => {
  res.render('login');
});
router.get('/register', (req, res) => {
  res.render('register');
});
router.get('/otpverify', (req, res)=>{
  res.render('otpverify')
});
router.get('/resetpass',(req, res) => {
  res.render('resetpass')
})
router.get('/forgotpass',(req, res) => {
  res.render('forgotpass')
})
router.get('/forgototp',(req, res) =>{
  res.render('forgototp')
})
router.get('/redirect',(req, res) =>{
  res.render('redirect')
})
router.get('/logout',authController.logout,(req,res)=>{
  res.redirect('/login');
})

module.exports = router;
