const mysql = require('mysql');
// Создаем подключение к базе данных
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todolist'
  });
  
  // Подключаемся к базе данных
  db.connect(err => {
    if (err) {
      throw err;
    }
    console.log('Connected to database');
  });

module.exports = db;