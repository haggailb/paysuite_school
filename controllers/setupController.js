
const setupModel = require('../models/setupModel');
const { isString, isShorterThan, isLongerThan, isEmpty, isInt } = require('../_utils/validators');

exports.add = async (req, res) => {
  let { rule_name, prefix, start_number } = req.body;

  try {
    if(!rule_name || !prefix || start_number){
      return res.status(400).json({ message: 'Invalid Input: rule name, prefix, or starting number not found.' });
    }

    if (isEmpty(rule_name) || !isString(rule_name) || isLongerThan(rule_name, 20) || isShorterThan(rule_name, 3)) {
      return res.status(400).json({ message: 'Validation Error: Rule name must be a string of 3 to 20 characters' });
    }

    if (isEmpty(prefix) || !isString(prefix) || isInt(prefix) || isLongerThan(ruleprefix_name, 4) || isShorterThan(prefix, 1)) {
      return res.status(400).json({ message: 'Validation Error: Prefix must be a string of 1 to 4 characters' });
    }

    if (isEmpty(start_number) || !isInt(start_number) || start_number > 9999999 || start_number < 1) {
      return res.status(400).json({ message: 'Validation Error: Starting number must be a positive integer between 1 and 9999999' });
    }

    setupModel.ruleExists(rule_name, prefix, async (checkErr, results) => {
      if (checkErr) {
        return res.status(500).json({ message: 'Server error while checking for duplicates.' });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: 'A rule with similar name of prefix already exists.' });
      }

      const rule = { rule_name, prefix, start_number };

      setupModel.saveRule(rule, async (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Internal Server Error: unable to save numbering rule' });
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
