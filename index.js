const express = require('express')
const mysql = require('mysql2/promise')

const app = express()
const port = 8000


let connection 

async function initMySQL() {
  let retries = 5;

  while (retries) {
    try {
        connection = await mysql.createConnection({
        host: "db",
        user: "root",
        password: "root",
        database: "tutorial",
      });

      console.log("MySQL connected!");
      return connection;
    } catch (err) {
      console.log("MySQL not ready, retrying...");
      retries--;
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

initMySQL();

app.get('/hello-world', (req, res) => {
  res.send('hello world')
})

// path = GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
app.get('/users', async (req, res) => {
  const [results] = await connection.query('SELECT * FROM users')
  res.json(results)
})

app.listen(port, async () => {
  await initMySQL()
  console.log(`Server running at http://localhost:${port}/`)
})