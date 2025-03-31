const express = require('express');
const bodyParser = require('body-parser');
const profile = require('./api/profiles');

const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
app.use('/profile', profile);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});