const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// user access roles routes
router.post('/create-role', authController.createUserRole);
router.get('/user-roles', authController.getUserRoles);
router.patch('/update-role/:role_id', authController.updateRole);

// role modules routes
router.post('/add-system-module', authController.addSystemModule);
router.post('/add-role-module', authController.addRoleModule);
router.get('/role-modules/:role_id', authController.getRoleModules);
router.get('/modules', authController.getModules);
router.delete('/delete/:role_id/:module_id', authController.deleteRoleModule);

// user routes
router.post('/create-user', authController.register);
router.patch('/update-user/:user_id', authController.updateUser);
router.get('/users/:role_id', authController.getUsers);
router.post('/open/login', authController.login);
router.get('/open/verify', authController.verifyToken);
router.post('/open/logout', authController.logout);

module.exports = router;
