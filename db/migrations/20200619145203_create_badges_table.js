// Migrated straight from legacy seed.sql file, thus using .raw to not rewrite anything
exports.up = function (knex) {
  return knex.raw(
    'CREATE TABLE badges (' +
      'id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,' +
      'title VARCHAR(50),' +
      'xp SMALLINT,' +
      'badge_url TEXT' +
    ')'
  );
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('badges');
};