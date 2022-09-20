const express = require('express');
const multer = require('multer');

const data = require('./store');
const app = express();
const upload = multer();

app.use(express.static('./templates'));
app.set('view engine', 'ejs');
app.set('views', './templates');
const AWS = require('aws-sdk');
const config = new AWS.Config({
    accessKeyId: 'AKIAZL5VN7I7HKLOCZSV',
    secretAccessKey: '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',
    region: 'ap-southeast-1'
});
AWS.config = config;

const docClient = new AWS.DynamoDB.DocumentClient();

const tableName = 'SanPham';

app.get('/', (request, response) => {
    const params = {
        TableName: tableName,
    };

    docClient.scan(params, (err, data) => {
        if (err) {
            response.send('Internal Server Error' + err);
        } else {
            return response.render('index', { sanPhams: data.Items});
        }
    });
});

app.post('/', upload.fields([]), (req, res) => {
    const { ten_sp, so_luong } = req.body;
    const ma_sp = parseInt(req.body.ma_sp);

    const params = {
        TableName: tableName,
        Item: {
            "ma_sp": ma_sp,
            "ten_sp": ten_sp,
            "so_luong": so_luong
        }
    }

    docClient.put(params, (err, data) => {
        if(err) {
            console.log(err);
            return res.send('Internal Server Error' + err);
        } else {
            return res.redirect("/");
        }
    });
});

app.post('/delete', upload.fields([]), (req, res) => {
    const ListItems = Object.keys(req.body);

    if (ListItems.length === 0) {
        return res.redirect("/");
    }

    function onDeleteItem(index) {
        const ma_sp = parseInt(ListItems[index]);
        const params = {
            TableName: tableName,
            Key: {
                "ma_sp": ma_sp
            }
        }

        docClient.delete(params, (err, data) => {
            if (err) {
                console.log(err);
                return res.send('Internal Server Error' + err);
            } else {
                if (index > 0) {
                    onDeleteItem(index - 1);
                } else {
                    return res.redirect("/");
                }
            }
        });
    }

    onDeleteItem(ListItems.length - 1);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});