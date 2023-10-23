const express = require('express');
const db = require('./db');

const app = express();
const port = 5000;

// Разрешаем парсинг JSON-запросов
app.use(express.json());

// Получение списка задач
app.get('/tasks', function(req, res){
  const sql = 'SELECT * FROM tasks';
  db.query(sql, function(error, tasks){
    if(error) {
      console.error('Ошибка при получении задач:', error.message);
      return res.status(500).send('Ошибка при получении задач'); // Возвращает 500 Internal Server Error
    }
    res.send(tasks);
  });
});

// Добавление новой задачи
app.post('/tasks', function(req, res){
  const title = req.body.title;

  // Проверка наличия обязательного поля "title"
  if (!title) {
    return res.status(400).json({ error: 'Поле "title" обязательно' });
    // Возвращаем статус 400 Bad Request и сообщение об ошибке
  }

  const sql = 'INSERT INTO tasks (title, completed) VALUES (?, 0)';

  db.query(sql, [title], function(error, results)  {
    if (error) {
      console.error('Ошибка при добавлении задачи:', error.message);
      return res.status(500).json({ error: 'Ошибка при добавлении задачи' });
    }

    const newTask = { id: results.insertId, title, completed: 0 };
    res.status(201).json(newTask);
  });
});

// Обновление задачи (пометка как выполненной)
app.post('/tasks/:id', function(req, res){
  const id = req.params.id;

  const sqlSelect = 'SELECT completed FROM tasks WHERE id = ?';

  db.query(sqlSelect, [id], function(error, results){
    if (error) {
      console.error('Ошибка при обновлении задачи (получение данных):', error.message);
      return res.status(500).json({ error: 'Ошибка при обновлении задачи' });
    }

    const currentCompleted = results[0].completed;
    const newCompleted = currentCompleted === 1 ? 0 : 1;

    const sqlUpdate = 'UPDATE tasks SET completed = ? WHERE id = ?';
    db.query(sqlUpdate, [newCompleted, id], function(error, results){
      if (error) {
        console.error('Ошибка при обновлении задачи (обновление данных):', error.message);
        return res.status(500).json({ error: 'Ошибка при обновлении задачи' });
      }

      res.status(200).json({ completed: newCompleted });
    });
  });
});

// Удаление задачи
app.delete('/tasks/:id', function(req, res){
  const id = req.params.id;
  const sqlDel = 'DELETE FROM tasks WHERE id = ?';
  db.query(sqlDel, [id], function(error){
    if (error) {
      console.error('Ошибка при удалении задачи:', error.message);
      return res.status(500).send('Ошибка при удалении задачи');
    }
    res.send(id);
  });
});

app.use(express.static('client/build'));

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});