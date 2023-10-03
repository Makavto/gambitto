const express = require('express');

const PORT = provess.env.PORT || 8080;

const app = express();

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));