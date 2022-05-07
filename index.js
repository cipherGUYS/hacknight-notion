const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const handlebars = require('express-handlebars');
const { Client } = require('@notionhq/client');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const notion = new Client({ auth: "secret_5kIkC5WycsVDKGRPAeJTqQAot4aNHHSQZ9po1krUCve" });
const dbID = "e555720a4ed74fba840a80e598d41cd9";

app.set('views', path.join(__dirname, 'views'));
app.set('view-engine', 'hbs');
app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'layout'
}));
app.use(express.static('public'));

app.get('/home', (req, res) => {
    res.status(200).render('home.hbs');
});

app.post('/home', async (req, res) => {
    const name = req.body.name;
    const year = req.body.year;
    const request = req.body.request;

    try {
        const response = await notion.pages.create({
            parent: { database_id: dbID },
            properties: {
                Name: {
                    title: [
                        {
                            text: {
                                content: name
                            }
                        }
                    ]
                },
                "Year": {
                    rich_text: [
                        {
                            text: {
                                content: year
                            }
                        }
                    ]
                },
                "Request": {
                    rich_text: [
                        {
                            text: {
                                content: request
                            }
                        }
                    ]
                },
            }
        })
        res.status(200).render('success.hbs');
    }
    catch (error) {
        console.log(error)
    }
});

app.get('/signin', (req, res) => {
    res.status(200).render('signin.hbs');
});

app.post('/signin', async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;

    if (name == "admin" && password == "admin") {
    
        var data = [];
        var temp_data;
        const response = await notion.databases.query({
            database_id: dbID,
        });
        let i = 0;
        while (({ response }.response.results[i].properties.Name.title).length) {
            var JSONname = { response }.response.results[i].properties.Name.title[0].plain_text;
            var JSONyear = { response }.response.results[i].properties.Year.rich_text[0].text.content;
            var JSONrequest = { response }.response.results[i].properties.Request.rich_text[0].text.content;
            i++;
            temp_data = { "Name": JSONname, "Year": JSONyear, "Request": JSONrequest };
            data.push(temp_data);
        }
        res.status(200).render('admin.hbs', {data});
    }
    else {
        res.status(200).render('signin.hbs');
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening at Port ${port}`));