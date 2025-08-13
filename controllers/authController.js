const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');
const axios = require('axios'); // Use axios for cleaner requests
const querystring = require('querystring');
const activeTokens = new Set();
module.exports.activeTokens = activeTokens;

const {
  isString,
  isShorterThan,
  isLongerThan,
  isValidMobileNumber,
  isEmpty,
  isInt
} = require('../_utils/validators');


const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.JWT_KEY;

// user access roles
exports.createUserRole = async (req, res) => {
  const { role_name, role_desc } = req.body;

  if(!role_name || !role_desc) {
    return res.status(400).json({ message: 'Input Error. missing role name or description.' });
  }

  if(isEmpty(role_name) || isEmpty(role_desc)) {
    return res.status(400).json({ message: 'Validation Error. role name or description can not be empty.' });
  }

  try {
    authModel.userRoleExists(role_name, async (checkErr, results) => {
      if (checkErr) {
        console.error('Error checking for existing roles modules:', checkErr);
        return res.status(500).json({ message: 'Server error while checking for duplicates.' });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: 'User module already exists.' });
      }

      // Proceed to insert
      const result = await authModel.createUserRole(role_name, role_desc);
      res.status(201).json({ message: 'success', data: result.role_id });
    });
  } catch (error) {
    console.error('Role module creation failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserRoles = (req, res) => {
  authModel.getUserRoles((err, results) => {
    if (err) {
      console.error('Error fetching user access roles:', err);
      return res.status(500).json({ message: 'Server error. Could not fetch user access roles.' });
    }

    res.status(200).json({
      message: 'success',
      rows: results
    });
  });
};

exports.updateRole = (req, res) => {
  const { role_id } = req.params;
  const { fieldName, newValue } = req.body;

  if (!role_id || !fieldName || typeof newValue === 'undefined') {
    return res.status(400).json({ message: 'Required parameters not found' });
  }

  if (isEmpty(newValue) || !isString(newValue) || isLongerThan(newValue, 255) || isShorterThan(newValue, 1)) {
    return res.status(400).json({ message: 'New value is not valid.' });
  }

  const trimmedValue = typeof newValue === 'string' ? newValue.trim() : newValue;

  authModel.updateRole(role_id, fieldName, trimmedValue, (err, result) => {
    if (err) {
      console.error('Error updating user access roles:', err);
      return res.status(500).json({ message: `Server error. Could not update user access role. ${err}` });
    }

    res.status(200).json({
      message: `success`,
      affectedRows: result.affectedRows
    });
  });
};

// MODULES
exports.getModules = (req, res) => {
  authModel.getModules((err, results) => {
    if (err) {
      console.error('Error fetching system modules:', err);
      return res.status(500).json({ message: 'Server error. Could not fetch system modules.' });
    }

    res.status(200).json({
      message: 'success',
      rows: results
    });
  });
};

// role modules
exports.addRoleModule = async (req, res) => {
  const { role_id, module_id } = req.body;

  if(!role_id || !module_id) {
    return res.status(400).json({ message: 'Input Error. missing role or module.' });
  }

  if(isEmpty(role_id) || isEmpty(module_id)) {
    return res.status(400).json({ message: 'Validation Error. role or module can not be empty.' });
  }
  try {
    authModel.roleModuleExists(role_id, module_id, async (checkErr, results) => {
      if (checkErr) {
        console.error('Error checking for existing role modules:', checkErr);
        return res.status(500).json({ message: 'Server error while checking for duplicates.' });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: 'Role module already exists.' });
      }

      // Proceed to insert
      const result = await authModel.addRoleModule(role_id, module_id);
      res.status(201).json({ message: 'success' });
    });
  } catch (error) {
    console.error('Role module creation failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.addSystemModule = async (req, res) => {
  const { moduleName } = req.body;
  if (!moduleName) {
    return res.status(400).json({ message: 'Input Error: module name not found.' });
  }


  try {
    authModel.systemModuleExists(moduleName, async (checkErr, results) => {
      if (checkErr) {
        console.error('Error checking for existing system modules:', checkErr);
        return res.status(500).json({ message: 'Server error while checking for duplicates.' });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: 'System module already exists.' });
      }

      // Proceed to insert
      const result = await authModel.addSystemModule(moduleName);
      res.status(201).json({ message: 'success' });
    });
  } catch (error) {
    console.error('System module creation failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getRoleModules = (req, res) => {
  const { role_id } = req.params;
  authModel.getRoleModules((role_id),(err, results) => {
    if (err) {
      console.error('Error fetching role modules:', err);
      return res.status(500).json({ message: 'Server error. Could not fetch role modules.' });
    }

    res.status(200).json({
      message: 'success',
      rows: results
    });
  });
};

exports.deleteRoleModule = async (req, res) => {
  const { role_id, module_id } = req.params;

  try {
    authModel.roleModuleExists(role_id, module_id, async (checkErr, results) => {
      if (checkErr) {
        console.error('Error checking for existing role modules:', checkErr);
        return res.status(500).json({ message: 'Server error while checking for duplicates.' });
      }

      if (results.length < 1) {
        return res.status(404).json({ message: 'Role module does not exist.' });
      }

      const result =  await authModel.deleteRoleModule(role_id, module_id);
      res.status(201).json({ message: 'success' });
    });
  } catch (error) {
    console.error('deleting Role module failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// USER REGISTRATION AND LOGIN
exports.register = async (req, res) => {
  const ip = req.ip;
  let { staff_id, user_name, password, role_id } = req.body;

  // Server-side validation (unchanged)
  if (isEmpty(user_name) || !isString(user_name) || isLongerThan(user_name, 20) || isShorterThan(user_name, 5)) {
    return res.status(400).json({ message: 'Server-side Validation Failed: User name must be a string of 5-20 characters' });
  }

  if (isEmpty(password)) {
    return res.status(400).json({ message: 'Server-side Validation Failed: Invalid password' });
  }

  if (isEmpty(staff_id) || !isInt(staff_id)) {
    return res.status(400).json({ message: 'Server-side Validation Failed: Invalid Staff ID.' });
  }

  if (isEmpty(role_id) || !isInt(role_id)) {
    return res.status(400).json({ message: 'Server-side Validation Failed: Invalid Access Level.' });
  }

  try {
    authModel.userExists(staff_id, user_name, async (checkErr, results) => {
      if (checkErr) {
        return res.status(500).json({ message: 'Server error while checking for duplicates.' });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: 'Staff ID or Username already registered.' });
      }

      // Hash the password and save user
      const hashedPassword = await bcrypt.hash(password.toString(), 10);
      const user = { user_name, staff_id, role_id, password: hashedPassword };

      authModel.createUser(user, async (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Internal Server Error: user registration failed' });
        }
        return res.status(201).json({ message: `success` });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  const { user_id } = req.params;
  const { fieldName, newValue } = req.body;
  
  if (!fieldName || !newValue) {
    return res.status(400).json({ message: 'Input Error: field or value not found.' });
  }

  if (isEmpty(user_id) || isEmpty(fieldName) || isEmpty(newValue)) {
    return res.status(400).json({ message: 'Validation error: Required parameters not found' });
  }

  let value = newValue;
  if (fieldName === 'password'){
    const hashedPassword = await bcrypt.hash(newValue.toString(), 10);
    value = hashedPassword;
  }

  authModel.updateUser(user_id, fieldName, value, (err, result) => {
    if (err) {
      console.error('Error updating user account:', err);
      return res.status(500).json({ message: `Server error. Could not update user account. ${err}` });
    }

    if (result.affectedRows === 0){
      res.status(200).json({message: `Could not update user account. No changes made`});
    }else{
      res.status(200).json({
        message: `success`,
        affectedRows: result.affectedRows
      });
    }
  });
};

exports.getUsers = (req, res) => {
  const { role_id } = req.params;

  if (isEmpty(role_id)) {
    return res.status(400).json({ message: 'Invalid or missing user access level parameter.' });
  }
  authModel.getUsers(role_id, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: `Server error. Could not fetch users.${err}` });
    }

    res.status(200).json({
      message: 'success',
      rows: results
    });
  });
};

exports.login = (req, res) => {
  const { user_name, password } = req.body;

  if (!user_name || !password) {
    return res.status(400).json({ message: 'Input Error: username or password not found.' });
  }

  try {
    authModel.getUser(user_name, async (err, user) => {
      const ip = req.ip;

      if (err) {
        return res.status(401).json({ message: `Server error: ${err}` });
      }

      if (!user) {
        return res.status(401).json({ message: 'Incorrect username or password.' });
      }

      if (user.is_active !== 1) {
        return res.status(401).json({ message: 'User account is deactivated. Please contact your system administrator.' });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: 'Incorrect username or password.' });
      }

      const token = jwt.sign(
        { user_id: user.user_id, role_id: user.role_id, email: user.email, user_name: user.user_name },
        secretKey,
        { expiresIn: '3h' }
      );

      activeTokens.add(token);

      res.json({
        message: "success",
        token,
        user: { 
          user_id: user.user_id, 
          email: user.email, 
          user_name: user.user_name, 
          first_name: user.first_name, 
          last_name: user.last_name,
          role_name: user.role_name,
          gender: user.gender,
          mobile_number: user.mobile_number,
          national_id: user.national_id,
          job_title: user.job_title
        }
      });
    });
  } catch (error) {
    res.json({
      message: "Unable to perform user authentication"
    });
  }
};

exports.verifyToken = (req, res) => {
  const ip = req.ip;
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = authHeader;
  }

  if (!authHeader || !token) {
    return res.status(401).json({message: 'Auth Error: token verification failed. no token received.'});
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({message: 'Auth Error: token verification failed.'});
    }
    res.json(decoded);
  });
};

exports.logout = (req, res) => {
  const authHeader = req.headers['authorization'];
  let token;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = authHeader;
  }

  if (token && activeTokens.has(token)) {
    activeTokens.delete(token);
    return res.status(200).json({ message: 'success' });
  }

  return res.status(400).json({ message: 'No valid token provided' });
};

