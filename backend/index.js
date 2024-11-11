const server = require('./src/app.js');
const { conn } = require('./src/db.js');

// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
  server.listen(8000, () => {
    console.log('%s listening at 8000'); // eslint-disable-line no-console
  });
});