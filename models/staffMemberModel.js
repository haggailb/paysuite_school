
const { db, promisePool } = require('../_config/db');

exports.memberExists = (staff_id, user_name, callback) => {
  const sql = 'SELECT * FROM system_users WHERE staff_id = ? OR user_name = ? LIMIT 1';
  db.query(sql, [staff_id, user_name], callback);
};

exports.saveMember = (user, callback) => {
  try{
    const sql = `INSERT INTO system_users 
    (staff_id, role_id, user_name, password, date_added) 
    VALUES 
    (?, ?, ?, ?, NOW())`;
    db.query(sql, [user.staff_id, user.role_id, user.user_name, user.password], callback);
  } catch (e){
    return callback(new Error(`${e.message}`));
  }
};

exports.updateStaff = (user_id, fieldName, newValue, callback) => {
  const allowedFields = ['role_id', 'password', 'is_active'];
  if (!allowedFields.includes(fieldName)) {
    return callback(new Error('Requested field cannot be updated.'));
  }

  try{
    const sql = `UPDATE system_users SET ${fieldName} = ? WHERE user_id = ?`;
    db.query(sql, [newValue, user_id], callback);
  } catch (e){
    return callback(new Error(`${e.message}`));
  }
};

exports.getMembers = (role_id, callback) => {
  let sql ='';
  try{
    if (role_id === 0 || role_id === '0') {
      sql = 'SELECT * FROM tv_system_users WHERE is_active = 1 ORDER BY user_name ASC';
    }else{
    sql = 'SELECT * FROM tv_system_users WHERE role_id = ? AND is_active = 1  ORDER BY user_name ASC';
    }
  db.query(sql, [role_id], callback);
  } catch (e){
    return callback(new Error(`${e.message}`));
  }
};

exports.getMember = (user_name, callback) => {
  const sql = `SELECT * FROM tv_system_users WHERE ( user_name = ? OR email = ? )`;
  db.query(sql, [user_name, user_name], (err, results) => {
    if (err || results.length === 0) return callback(err, null);
    callback(null, results[0]);
  });
};
