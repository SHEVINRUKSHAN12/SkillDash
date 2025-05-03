const express = require('express');
const app = require('./app');
const path = require('path');
const PORT = process.env.PORT || 5000;

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
