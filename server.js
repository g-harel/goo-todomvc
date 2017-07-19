'use strict';

const express = require('express');

const port = 8080;

const app = express();

app.get('/(*/)?:name.:extension', (req, res) => {
	const {name, extension} = req.params;
	const dir = req.params[0];
	res.sendFile(__dirname + `/${dir||''}/${name}.${extension}`);
});

app.get('**', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
	console.log('running at ' + port);
});
