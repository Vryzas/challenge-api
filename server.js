const dotenv = require('dotenv');
dotenv.config({ path: `./config.env` });
const server = require('./socket');

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`App listening on port ${port}...`);
});
