const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
        req.sendfile(path.resolve(__dirname, 'build', 'index.html'));
    })
}

app.listen(PORT, () => {
    console.log("App up and running on port: " + PORT);
})

// export {}