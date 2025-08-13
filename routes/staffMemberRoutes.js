const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffMemberController');

router.post('/add', staffController.add);
router.get('/get', staffController.get);
router.get('/get-by-id/:staff_id', staffController.getMember);
router.patch('/update/:user_id', staffController.update);

module.exports = router;
