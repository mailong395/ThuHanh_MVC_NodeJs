const express = require('express');
const multer = require('multer');

const data = require('./store');
const app = express();
const upload = multer();

app.use(express.static('./templates'));
app.set('view engine', 'ejs');
app.set('views', './templates');

app.get('/', (req, res) => {
    return res.render('index', { data: data });
});

app.post('/', upload.fields([]), (req, res) => {
    data.push(req.body);
    return res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});