const express = require('express');
const router = express.Router();
const userControler = require('../conrollers/userControler')
router.get('/', userControler.view)
router.post('/', userControler.find)
router.get('/:id', userControler.delete); // Changed to DELETE method for RESTful convention
router.post('/adduser', userControler.create)

router.get('/adduser', userControler.form)
router.get('/edituser/:id', userControler.edit)
router.post('/edituser/:id', userControler.update)




// router.get('', (req, res) => {
//     res.render('home'); // Render the "home.hbs" view
// });


module.exports = router;