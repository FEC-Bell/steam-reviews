# HR Front End Capstone: Engineering Journal
## Christina Wang - RPT21 Bell Team

Cloning the [Steam](https://store.steampowered.com/app/289070/Sid_Meiers_Civilization_VI/) app. My modules: Reviews, Game Description. This journal concerns the __Reviews__ module.

## [PR1](https://github.com/FEC-Bell/steam-reviews/pull/1): Set up developer environment and dependencies

Decided on webpack-dev-server for its hot reload feature, which will come in handy when coding the frontend. Also good for its proxy server feature for redirecting requests from the frontend to the backend localhost.

## [PR2](https://github.com/FEC-Bell/steam-reviews/pull/2): Generate db seed data

### Set up PostgreSQL
Decided to install PostgreSQL via WSL instead of through Windows, thus had to re-familiarize self with WSL again. Upgraded Ubuntu to v.20.04 & started installing Postgres. These are the steps to install on Linux:

1. Create the file repository configuration:
`sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'`

2. Import the repository signing key:
`wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -`

3. Update the package lists:
`sudo apt-get update`

4. Install the latest version of PostgreSQL. If you want a specific version, use 'postgresql-12' or similar instead of 'postgresql':
`sudo apt-get install postgresql`

Ran into problems in step 2:
`gpg: can't connect to the agent: IPC connect call failed`
Apparently Ubuntu 20.04 is [incompatible](https://discourse.ubuntu.com/t/ubuntu-20-04-and-wsl-1/15291) with WSL1.

[Upgrading to WSL2](https://devblogs.microsoft.com/commandline/wsl2-will-be-generally-available-in-windows-10-version-2004/) (available in beta since March 2020) requires Win10 v2004 at minimum, which one must manually update to, since v2004 doesn't seem to be a general release as of June 2020.

Upgraded Win10 to v2004. This triggered an automatic system backup, taking up most of the remainder of the space on my SSD. (Time to upgrade storage size?) Then, installed WSL2. Problems solved, and PostgreSQL successfully installed.

### Seeding

#### Write SQL seed file

Decided to write the seed file in raw SQL for practice. Had to familiarize self with slight differences in Postgres syntax & command constraints, such as:

1. Connecting via psql CLI without the `-c` flag connects you to the default postgres system DB. Must use `-c` or `\c` from within psql to connect to a certain DB.

2. Small datatype differences. ~~Based on [this SO thread](https://stackoverflow.com/questions/55300370/postgresql-serial-vs-identity), I decided to use the `GENERATED ALWAYS AS IDENTITY` declaration for my primary key fields.~~ *(Note from PR 7: `GENERATED ALWAYS AS IDENTITY` was triggering an error in Travis CI builds, thus switched to `SERIAL`.)*

I didn't want to manually type each row using the `INSERT INTO table_name` command, so needed to find a solution that would allow piping large amounts of generated data into either the raw SQL file or the DB itself. Enter `COPY`:

>COPY moves data between PostgreSQL tables and standard file-system files.

*Via [Postgres 12 docs](https://www.postgresql.org/docs/current/sql-copy.html)*

Most importantly, `COPY` supports copying from files with any format, **including .csv**. CSV would be good for storing large amounts of generated data, possibly in the millions (when SDC rolls around), so it's ideal for data storage. For example, [29 mil rows = ~600MB](https://stackoverflow.com/questions/44362395/how-to-read-huge-csv-file-with-29-million-rows-of-data-using-net). Decided on writing `COPY FROM` statements after my table schema declarations in the SQL file, and after inserting data for the `badges` table, which was only and would only ever be 16 rows.

#### Generate .CSV data

No issues arose.

#### Pipe generated .csv files into DB

Ran into an issue with the `COPY FROM` statement:
```
COPY users(
  username,
  profile_url,
  is_online,
  num_products,
  num_reviews,
  steam_level,
  id_badge,
  is_in_game,
  in_game_id,
  in_game_status
)
FROM './data-gen/csv-seeds/users.csv'
DELIMITER ','
CSV HEADER;
```
Apparently it's best practice to provide absolute file paths to `COPY FROM`. Relative paths work, but the server is running in a different root than the client, typically `/var/lib/postgresql` instead of `/mnt/c/path/to/my/local/repo`. Thus relative pathing would not find my generated file, which is located in my local repo.

Resolved issue by using absolute path. However, this exposes my local file paths, and furthermore can't be used as a seed file by others without changing the absolute path. TODO: use Knex's migrate/seed functionality to get around this.

## [PR3](https://github.com/FEC-Bell/steam-reviews/pull/3): Ensure not all users have a badge id in generated data

This was a hotfix. I didn't exactly follow GH flow for this, since it was a one-line change & my time difference would have made the process a **lot** longer than it needed to be.

## [PR4](https://github.com/FEC-Bell/steam-reviews/pull/4): Change placeholders to hosted image URLs

Before this PR, I was using placeholder images for my seed data from [picsum.photos](https://picsum.photos/). Per GLearn specs:

>If you are building a media-centric widget, you must transfer original media to and serve those media files from either S3 or Cloudfront. Media is defined as: photos or songs. For movies, it's ok to serve content from the original source such as YouTube or Vimeo.

Set up Cloudinary account, scraped the placeholder images I had from the relevant places ([Site for badge icons](https://steamtreasurehunt.fandom.com/wiki/Badges), [API for cute user avatars](http://avatars.adorable.io/)), uploaded to Cloudinary, used [Cloudinary admin API](http://avatars.adorable.io/) to acquire all the hosted URLs in one go, and updated seeding scripts & CSV files to reflect changes.

## [PR5](https://github.com/FEC-Bell/steam-reviews/pull/5): Automate db seed task with Knex

Currently, seeding has to be done manually by piping seed.sql into Postgres via CLI (psql), and the machine-specific file paths in seed.sql meant that whoever cloned the repo would have to manually change the path, which wasn't ideal.

Knex provides a query building interface, but I didn’t want to rewrite the content I’d already written in seed.sql. Thus I'm using Knex's [raw SQL interface](http://knexjs.org/#Raw-Queries) in conjunction with its [migrate & seed CLI tools](http://knexjs.org/#Migrations-CLI).

Seed.sql contains `COPY FROM` functionality, which Knex doesn't natively have an interface for. [Found](https://github.com/knex/knex/issues/756) that I could copy CSV files into the DB directly with the `pg` package, while using Knex's connection pooling for efficiency. Migrate & seed CLI commands now work as expected.

When other users run my seed script, if Knex isn't installed globally, it'll result in an error. Thus I had to choose between two options for the seed script, currently `"seed": knex migrate:rollback && knex migrate:latest && knex seed:run`:

Options:
1. Preface each of the 3 subcommands with `npx`
2. Install Knex globally before and uninstall globally after (in case user doesn't want global install)

Speed tests of each command showed these results:

**Global**:

![Global Knex Speed](./assets/global-knex-speed.png)

**Npx**:

![Npx Knex Speed](./assets/npx-knex-speed.png)

Thus decided on global install method. Seed script: `"seed": npm i -g knex && knex migrate:rollback && knex migrate:latest && knex seed:run && npm un -g knex`

## [PR6](https://github.com/FEC-Bell/steam-reviews/pull/6): Setup & write tests, add CI & coverage

Installed Cypress and gave it a *test* run, but it was really slow, since each tests opens a headless browser. Makes sense, since Cypress is meant for E2E tests but just happens to support unit/integration testing. Settled on Jest for its nice assertion syntax and compatibility with React-Testing-Library, which I'll be using later to test DOM.

How does one mock the file system for unit testing? Jest has a `.mockImplementation` method, which I'll combine with a virtual file system (really just an object) for checking that the correct contents were written to the file system. Resulted in [this unit test](https://github.com/FEC-Bell/steam-reviews/pull/6/files#diff-196c73e724290f6e7eca5d66a215c127R21) which was a good learning moment for me about mocking.

Excluded some files from Jest test coverage, since they're internal scripts.

**Coverage**:

![Unit Test Coverage - PR6](./assets/unit-test-coverage-pr6.png)

Set a global coverage threshold of 80% in accordance with best practice minimum (said in lecture maybe?)

Set up continuous integration with [Travis CI](https://travis-ci.org/) and coverage reporting with [Coveralls](https://coveralls.io/). First time using CI and coverage reporters, so another good learning moment for me. The .travis.yml script setup was surprisingly simple.

## [PR7](https://github.com/FEC-Bell/steam-reviews/pull/7): Complete backend: routes, db, tests

Wrote DB methods to get review data for a valid `req.params.gameid` from DB. The returned review data had to have user and badge data nested in it, but pg's query interface doesn't support nesting.

So I had to make two separate calls per reviews returned to the users and badges table respectively and in that order, in order to get the complete data shape my tests were expecting. I knew that JS's native `.forEach` didn't handle async callbacks well, and this task would definitely require async, so I wrote my own asyncForEach helper for this purpose.

Base methods were easy, but then had to support `URLSearchParams` querying according to contract set forth in App & Service Plan.

Had to write utils to filter out invalid `req.query` key-value pairs, then build a raw SQL string from remaininig `req.query` pairs to query the DB via Knex. This being done successfully, I had to check if the req.query had a display value of summary or didn't have a display value, and send back a response with two sets of data, sorted according to most helpful and most recent respectively, if that was the case.

Got kind of sidetracked in creating a more feature-complete command line tool for my data generation so I could use it to generate exactly how much test data I wanted. In hindsight, kind of superfluous. TODO: I'll need to create documentation for this.

**First issue I ran into**: integration testing the DB/routes. Originally I had db.test.js and routes.test.js as separate files. Jest being a parallel test runner, this became problematic when these two files referenced the same NODE_ENV=test database while each script had its own migration & seed hooks.

**Solution for this issue**: Considered extending the default jest test runner into a custom file for serial running, and using the projects option in jest.config.js to specify that only my integration tests be run serially while my unit tests be run in parallel. However, this seemed like too much hassle. I ended up removing the `.test.` part from db and routes tests and bringing them into an `index.test.js` file, then calling them synchronously, thus ensuring they run in serial.

**Second issue I ran into**: The newly created `index.test.js` integration test file was hanging for 7+ seconds instead of completing. The error:

`A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --runInBand --detectOpenHandles to find leaks.`

**Solution for this issue**: I used the `--detectOpenHandles` flag, to find that, after bringing my server in and using Supertest to test it, `app.listen` was the hanging process. It seems that the server wasn't shutting down after tests. After trawling through the entirety of [this GitHub issues thread](https://github.com/visionmedia/supertest/issues/520) without any luck, I looked in Express's documentation to find the following line:

>The app.listen() method returns an http.Server object...

The server object has a `.close` method luckily, so I just imported it into my test and called `.close` on it directly in the `afterAll()` hook.

**Third issue I ran into**: After forgetting to include postgresql as a service, including it, and increasing the test timeout of my Jest tests (integration test takes ~7.5 seconds, so set --testTimeout=10000)... During the Travis CI build of my now-completed PR, I ran into a syntax issue in the `GENERATED ALWAYS AS IDENTITY` lines of my Knex migrate scripts.

**Solution for this issue**: Changed `GENERATED ALWAYS AS IDENTITY` to `SERIAL` with the help of Help Desk, which fixed the problem.

**Finally, current test and coverage**:

![Test Coverage PR7](./assets/test-coverage-pr7.png)

Biggest PR & journal entry yet! Next up: Complete frontend client.