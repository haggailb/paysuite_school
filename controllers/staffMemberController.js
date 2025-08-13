
const setupModel = require('../models/setupModel');
const { isString, isShorterThan, isLongerThan, isValidMobileNumber, isEmpty, isInt } = require('../_utils/validators');

exports.add = async (req, res) => {
  const ip = req.ip;
  let { user_name, password } = req.body;

  if (isEmpty(user_name) || !isString(user_name) || isLongerThan(user_name, 20) || isShorterThan(user_name, 5)) {
    return res.status(400).json({ message: 'Server-side Validation Failed: User name must be a string of 5-20 characters' });
  }

  if (isEmpty(password)) {
    return res.status(400).json({ message: 'Server-side Validation Failed: Invalid password' });
  }

  if (isEmpty(staff_id) || !isInt(staff_id)) {
    return res.status(400).json({ message: 'Server-side Validation Failed: Invalid Staff ID.' });
  }

  if (isEmpty(staff_id) || !isInt(staff_id)) {
    return res.status(400).json({ message: 'Server-side Validation Failed: Invalid Access Level.' });
  }

  try {
    setupModel.memberExists(staff_id, user_name, async (checkErr, results) => {
      if (checkErr) {
        return res.status(500).json({ message: 'Server error while checking for duplicates.' });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: 'Staff ID or Username already registered.' });
      }

      // Hash the password and save user
      const hashedPassword = await bcrypt.hash(password.toString(), 10);
      const user = { user_name, staff_id, staff_id, password: hashedPassword };

      setupModel.saveMember(user, async (err, result) => {
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

exports.update = async (req, res) => {
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

  setupModel.updateStaff(user_id, fieldName, value, (err, result) => {
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

exports.get = (req, res) => {
  const { staff_id } = req.params;

  if (isEmpty(staff_id)) {
    return res.status(400).json({ message: 'Invalid or missing user access level parameter.' });
  }
  setupModel.getMembers(staff_id, (err, results) => {
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

exports.getMember = (req, res) => {
  const { staff_id } = req.params;

  if (!staff_id || isEmpty(staff_id)) {
    return res.status(400).json({ message: 'Invalid or missing user access level parameter.' });
  }

  setupModel.getMembers(staff_id, (err, results) => {
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
