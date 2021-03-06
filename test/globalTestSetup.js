const knex = require('knex');

const createDb = async () => {
  const dbConnection = knex({
    client: 'postgres',
    debug: true,
    connection: {
      host: '127.0.0.1',
      database: 'postgres',
      port: '5432',
      password: '',
      user: 'postgres'
    }
  });

  try {
    await dbConnection.raw('CREATE DATABASE steam_reviews_test');
  } catch (e) {
    console.error(e);
  } finally {
    await dbConnection.destroy();
  }
};

module.exports = async () => {
  await createDb();
};
