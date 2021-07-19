const session = require('express-session');
const express = require('express');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const app = express();
const secretkey = 'taxvpxsjil';
const axios = require('axios');

const requiresAccess = () => {
	return [
		(req, res, next) => {
			if (req.session && req.session.access_key && req.session.access_key === secretkey) {
				next();
			} else {
				let templateString = fs.readFileSync('login.ejs', 'utf-8');
				res.end(ejs.render(templateString));
			}
		}
	]
};

app.use(session({ secret: secretkey }));

app.get('/validate-key/:key', (req, res) => {
	if (req.params.key === undefined || req.params.key === "" || req.params.key === null) {
		res.status(200).send({success: false, message: 'Invalid key'});
	}
	else if (req.params.key === secretkey) {
		req.session.access_key = secretkey;
		res.status(200).send({success: true, message: 'valid key'});
	}else {
		res.status(200).send({success: false, message: 'Invalid key'});
	}
})

// /**-- Comment below line to skip authentication of access --**/
// app.use('*', requiresAccess());

app.use(express.static(path.join(__dirname, '')));

app.get('/', function(request, response) {
  const filePath = path.resolve(__dirname, '', 'index.html');
  response.sendFile(filePath);
});

app.get('/signIn', function(request, response) {
  const filePath = path.resolve(__dirname, '', 'index.html');
  response.sendFile(filePath);
});

app.get('/signUp', function(request, response) {
  const filePath = path.resolve(__dirname, '', 'index.html');
  response.sendFile(filePath);
});

app.get('/profile', function(request, response) {
  const filePath = path.resolve(__dirname, '', 'index.html');
  response.sendFile(filePath);
});

app.get('/metrics', function(request, response) {
  const filePath = path.resolve(__dirname, '', 'index.html');
  response.sendFile(filePath);
});

app.get('/alerts', function(request, response) {
  const filePath = path.resolve(__dirname, '', 'index.html');
  response.sendFile(filePath);
});

app.get('/documents', function(request, response) {
  const filePath = path.resolve(__dirname, '', 'index.html');
  response.sendFile(filePath);
});

app.get('/devices', function(request, response) {
  const filePath = path.resolve(__dirname, '', 'index.html');
  response.sendFile(filePath);
});

app.get('/encyclopedia', function(request, response) {
  const filePath = path.resolve(__dirname, '', 'index.html');
  response.sendFile(filePath);
});

app.get('/symptomChecker', function(request, response) {
  const filePath = path.resolve(__dirname, '', 'index.html');
  response.sendFile(filePath);
});

app.get('/adminTools', function(request, response) {
  const filePath = path.resolve(__dirname, '', 'index.html');
  response.sendFile(filePath);
});

app.get('/about', function(request, response) {
  const filePath = path.resolve(__dirname, '', 'index.html');
  response.sendFile(filePath);
});

app.get('/newsfeed/:text', (req, res) => {
	axios.get('https://fitfortis-be.azurewebsites.net/api/1.0/news/' + req.params.text)
	.then(response => {
		const filePath = path.resolve(__dirname, '', 'index.html');
		const item = response.data.item;
		fs.readFile(filePath, 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			data = data.replace(/\$OG_TITLE/g, item.title);
			data = data.replace(/\$OG_DESCRIPTION/g, item.description.indexOf('<p>') > -1 ? (item.description.substring(item.description.indexOf('<p>') + 3, item.description.indexOf('</p>')).trim()) : '');
			result = data.replace(/\$OG_IMAGE/g, item.pictureUrl);
			res.send(result);
		});
	});
});


app.post('/upload', (req, res) => {
	console.log('Upload File');
});
app.listen(process.env.PORT || 8080, err => {
  if (err) {
    /* eslint-disable no-console */
    console.log('err to serve reactjs-blank build', err);
  } else {
    /* eslint-disable no-console */
    console.log('reactjs-blank serve started' + process.env.PORT || 8080);
  }
});
