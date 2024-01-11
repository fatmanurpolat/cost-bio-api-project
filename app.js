const express = require('express');
const app = express();

app.use(express.json());

// Kullanıcı veritabanı simulasyonu
const users = [
  { id: 1, username: 'user1', password: 'pass1' },
  { id: 2, username: 'user2', password: 'pass2' }
];

// Login endpoint'i
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Kullanıcıyı bul
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.json({ message: 'Login başarılı', user });
  } else {
    res.status(401).json({ message: 'Hatalı kullanıcı adı veya şifre' });
  }
});

// Sunucuyu dinle
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
