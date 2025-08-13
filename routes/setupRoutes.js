const express = require('express');
const router = express.Router();
const setupController = require('../controllers/setupController');

router.post('/add', setupController.add);
router.get('/get', setupController.get);
router.get('/get-by-id/:setup_id', setupController.getMember);
router.patch('/update/:setup_id', setupController.update);

module.exports = router;
