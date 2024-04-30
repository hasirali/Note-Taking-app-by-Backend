const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path'); // Importing path module

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));




app.get('/', (req, res) => {
    fs.readdir(`./files`, function (err, files) {
        res.render("index", { files: files });
    });
});

app.post('/create', (req, res) => {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.description, function (err) {
        if (err) {
            console.error('Error writing file:', err);
            res.status(500).send('Error writing file');
        } else {
            console.log('File created successfully');
            res.redirect('/');
        }
    });
});

app.get('/file/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, filedata) {
        res.render('show', { filename: req.params.filename, filedata: filedata });
        console.log(filedata);
    });
});
app.get('/edit/:filename', (req, res) => {
    res.render('edit', { filename: req.params.filename });
});
// app.post('/edit', (req, res) => {
//     console.log(req.body);
// });
app.post('/edit', (req, res) => {
    console.log(req.body.old , req.body.new);
    const oldFilename = req.body.old;
    const newFilename = req.body.new;

    // Ensure new filename is not empty
    if (!newFilename.trim()) {
        return res.status(400).send("New filename cannot be empty.");
    }

    fs.rename(`./files/${oldFilename}`, `./files/${newFilename}`, function (err) {
        if (err) {
            console.error('Error renaming file:', err);
            res.status(500).send('Error renaming file');
        } else {
            console.log('File renamed successfully');
            res.redirect('/');
        }
    });
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
