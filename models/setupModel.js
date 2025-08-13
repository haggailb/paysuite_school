
const { db, promisePool } = require('../_config/db');

exports.ruleExists = (rule_name, prefix, callback) => {
  try{
    const sql = 'SELECT * FROM number_rules WHERE rule_name = ? OR prefix = ? LIMIT 1';
    db.query(sql, [rule_name, prefix], callback);
  } catch (e){
    return callback(new Error(`${e.message}`));
  }
};

exports.saveRule = (rule, callback) => {
  try{
    const sql = `INSERT INTO number_rules 
    (rule_name, prefix, start_number) 
    VALUES 
    (?, ?, ?)`;
    db.query(sql, [rule.rule_name, rule.prefix, rule.start_number], callback);
  } catch (e){
    return callback(new Error(`${e.message}`));
  }
};

exports.updateRule = (rule_id, fieldName, newValue, callback) => {
  try{
    const allowedFields = ['prefix','start_number'];
    if (!allowedFields.includes(fieldName)) {
      return callback(new Error('Requested field cannot be updated.'));
    }

    const sql = `UPDATE number_rules SET ${fieldName} = ? WHERE rule_id = ?`;
    db.query(sql, [newValue, rule_id], callback);
  } catch (e){
    return callback(new Error(`${e.message}`));
  }
};

exports.getRules = (rule_id, callback) => {
  let sql ='';
  try{
    if (rule_id === 0 || rule_id === '0') {
      sql = 'SELECT * FROM number_rules ORDER BY rule_name ASC';
    }else{
    sql = 'SELECT * FROM number_rules WHERE rule_id = ? LIMIT 1';
    }
  db.query(sql, [rule_id], callback);
  } catch (e){
    return callback(new Error(`${e.message}`));
  }
};