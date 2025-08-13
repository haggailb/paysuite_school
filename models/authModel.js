
const { db, promisePool } = require('../_config/db');

// user access roles
exports.userRoleExists = (role_name, callback) => {
  const sql = 'SELECT * FROM user_roles WHERE role_name = ? LIMIT 1';
  db.query(sql, [role_name], callback);
};

exports.createUserRole = async (role_name, role_desc) => {
  try {
    const [roleResult] = await promisePool.query(
      'INSERT INTO user_roles (role_name, role_desc) VALUES (?, ?)',
      [role_name, role_desc]
    );

    const role_id = roleResult.insertId;

    return { role_id };
  } catch (error) {
    throw error;
  }
};

exports.getUserRoles = (callback) => {
  const sql = 'SELECT * FROM user_roles ORDER BY role_name ASC';
  db.query(sql, callback);
};

exports.updateRole = (role_id, fieldName, newValue, callback) => {
  const allowedFields = ['role_name', 'role_desc'];
  if (!allowedFields.includes(fieldName)) {
    return callback(new Error('Error: Invalid data please use the correct form.'));
  }

  const sql = `UPDATE user_roles SET ${fieldName} = ? WHERE role_id = ?`;
  db.query(sql, [newValue, role_id], callback);
};

// SYSTEM MODULES
exports.systemModuleExists = (module_name, callback) => {
  const sql = 'SELECT * FROM system_modules WHERE module_name = ? LIMIT 1';
  db.query(sql, [module_name], callback);
};

exports.addSystemModule = async (module_name) => {
  try {
    const [roleResult] = await promisePool.query(
      'INSERT INTO system_modules (module_name) VALUES (?)',
      [module_name]
    );
    return { roleResult };
  } catch (error) {
    throw error;
  }
};

exports.getModules = (callback) => {
  const sql = 'SELECT * FROM system_modules ORDER BY module_name ASC';
  db.query(sql, callback);
};

// role modules
exports.roleModuleExists = (role_id, module_id, callback) => {
  const sql = 'SELECT * FROM role_modules WHERE role_id = ? AND module_id = ? LIMIT 1';
  db.query(sql, [role_id, module_id], callback);
};

exports.addRoleModule = async (role_id, module_id) => {
  try {
    const [roleResult] = await db.promise().query(
      'INSERT INTO role_modules (role_id, module_id) VALUES (?, ?)',
      [role_id, module_id]
    );
    return { roleResult };
  } catch (error) {
    throw error;
  }
};

exports.getRoleModules = (role_id, callback) => {
  const sql = 'SELECT * FROM tv_role_modules WHERE role_id = ? ORDER BY role_name ASC, module_name ASC';
  db.query(sql, [role_id], callback);
};

exports.deleteRoleModule = (role_id, module_id, callback) => {
  const sql = 'DELETE FROM role_modules WHERE role_id = ? AND module_id = ?';
  db.query(sql, [role_id, module_id], callback);
};

// USER REGISTRATION AND LOGIN
exports.userExists = (staff_id, user_name, callback) => {
  const sql = 'SELECT * FROM system_users WHERE staff_id = ? OR user_name = ? LIMIT 1';
  db.query(sql, [staff_id, user_name], callback);
};

exports.createUser = (user, callback) => {
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

exports.updateUser = (user_id, fieldName, newValue, callback) => {
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

exports.getUsers = (role_id, callback) => {
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

exports.getUser = (user_name, callback) => {
  const sql = `SELECT * FROM tv_system_users WHERE ( user_name = ? OR email = ? )`;
  db.query(sql, [user_name, user_name], (err, results) => {
    if (err || results.length === 0) return callback(err, null);
    callback(null, results[0]);
  });
};
