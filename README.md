# Steam Reviews Service

[![Build Status](https://travis-ci.org/FEC-Bell/steam-reviews.svg?branch=master)](https://travis-ci.org/FEC-Bell/steam-reviews) [![Coverage Status](https://coveralls.io/repos/github/FEC-Bell/steam-reviews/badge.svg?branch=master)](https://coveralls.io/github/FEC-Bell/steam-reviews?branch=master)

Reviews service for Team Bell's Steam app clone

## Related Projects

- [Reviews Graph](https://github.com/FEC-Bell/steam-reviews-graph)
- [Downloadable Content](https://github.com/FEC-Bell/downloadable_content)
- [Photo Carousel](https://github.com/FEC-Bell/photo-carousel)
- [User Tags](https://github.com/FEC-Bell/steam-user-tags)
- [Game Description](https://github.com/FEC-Bell/steam-game-description)

## Table of Contents

1. [Usage](#usage)
2. [Requirements](#requirements)
3. [Development](#development)
4. [Service Endpoints](#service-endpoints)
5. [Troubleshooting](#troubleshooting)
    - [Troubleshooting PostgreSQL](#troubleshooting-postgresql)

## Usage

The Steam Reviews microservice is intended to be used in conjunction with its [Related Projects](#related-projects) to create a realistic Steam item details page clone using Docker and AWS. [Here](https://github.com/FEC-Bell/christina-proxy) is an example of a proxy server created with this service.

```
git clone https://github.com/FEC-Bell/steam-reviews.git`
cd steam-reviews
npm install
```

## Requirements

- Node JS v12
- PostgreSQL v12

## Development

1. Clone repo & install dependencies:
    ```
    git clone https://github.com/FEC-Bell/steam-reviews.git`
    cd steam-reviews
    npm install
    ```

2. **PostgreSQL v12** must be set up before continuing:
    - [Linux setup](https://www.postgresql.org/download/linux/ubuntu/) (assuming Ubuntu v16.04+)
    - [MacOS setup](https://www.postgresql.org/download/macosx/)
    - [Windows setup](https://www.postgresql.org/download/windows/)

    If using Windows, you may also install PostgreSQL as a Linux service via Windows Subsystem for Linux. However, you'll need to upgrade to WSL 2.0 if using Ubuntu v20.04. [See this journal post](https://github.com/FEC-Bell/steam-reviews/blob/master/fec-engineering-journal/JOURNAL.md#set-up-postgresql) for details on how this can be done.

    [Verify](https://linuxize.com/post/how-to-check-postgresql-version/) that PostgreSQL is version 12.

    Start the PostgreSQL service:
    ```
    sudo service postgresql start
    ```
    Stop the service:
    ```
    sudo service postgresql stop
    ```
    Check the service status:
    ```
    sudo service postgresql status
    ```

    Further development assumes that PostgreSQL is running on its default port, 5432, and has been installed with the default settings otherwise.

3. Create file named `.env` containing the following line:
    ```
    PG_PASS=your_password_here
    ```
    This line is the password for accessing your PostgreSQL service. You may add other environment variables to this file, and access them throughout your code via adding the line `require('dotenv').config()` in your code. If you did not provide a password during PostgreSQL installation, delete `your_password_here` from the above line. The `.env` file has been `.gitignore`d for your convenience.

4. Seed the database with `npm run seed`.
    - You may check that the DB has the proper entries via `psql` CLI tool:
    ```
    psql -d steam_reviews         // connect to steam_reviews database
    \dt                           // describe tables
    select count(*) from badges;  // 16
    select count(*) from users;   // 750
    select count(*) from reviews; // 1000
    \q                            // quit psql
    ```

5. Ensure that all tests pass with `npm run test`.

6. Start the server with `npm run server:dev`.
    - Alternatively, start a production server with `npm run start`.

7. Start the client with `npm run client:dev`.
    - Alternatively, build a production-ready minified `bundle.js` with `npm run build`.

## Service Endpoints

### `GET /api/reviews/:gameid`

Data shape:
```
{
  steamPurchasedCount: Number,
  otherPurchasedCount: Number,
  data: [
    {
        "id": Number,
        "id_user": Number,
        "user": {
            "id": Number, // matches id_user
            "username": String,
            "profile_url": String,
            "is_online": Boolean,
            "num_products": Number,
            "num_reviews": Number,
            "steam_level": Number,
            "id_badge": Number, // id may be null, in which case badge entry won't be present
            "badge": Null || {
                "id": Number, // matches id_badge
                "title": String,
                "xp": Number,
                "badge_url": String
            }
            "is_in_game": Boolean,
            "in_game_id": Null || Number,
            "in_game_status": Null || String
        },
        "id_game": Number,
        "is_recommended": Boolean,
        "hours_on_record": Single-precision Float String (“1800.3”),
        "hours_at_review_time": Single-precision Float String (“1800.3”),
        "purchase_type": String (either `direct` or `key`),
        "date_posted": ISODateString ("2020-06-03T15:00:00.000Z"),
        "received_free": Boolean,
        "review_text": String,
        "num_found_helpful": Number,
        "num_found_funny": Number,
        "num_comments": Number
    },
    {
      id: Number
      ... etc etc. Total data count will be 10 or less every time
    }
  ],
  recent: [
    ...
    // Same content as data, but ordered by date. Recent will only appear when the endpoint is hit with a display=summary query, or when the display query is absent (defaults to summary in that case).
  ]
}

```

### Query parameters ([URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)) for `/api/reviews/:gameid`:

- Review type param:
    - `review_type={all || positive || negative}`
    - Default: `all`

- Purchase type param:
    - `purchase_type={all || steam || other}`
    - Default: `all`

- Date range params:
    - `from={yyyy-mm-dd}`
    - `to={yyyy-mm-dd}`
    - Default: omit this query param to get the default search range, which is all reviews -- only 10 reviews per game are in the dataset
    - `from={yyyy-mm-dd}` & `to={yyyy-mm-dd}` are both optional
    - Interacts with [Reviews Graph](https://github.com/FEC-Bell/steam-reviews-graph) service

- Exclude date range param:
    - `exclude={true || false}`
    - Default: `false`
    - If true, filter results will be of dates EXCLUDING the range parameter specified above. If no date range parameter with `from={yyyy-mm-dd}` AND `to={yyyy-mm-dd}` is specified, this parameter does nothing.

- Playtime params:
    - `play_min={[0-100]}`
    - `play_max={[0-100]}`
    - Default: you may omit these queries to get the default, which is no min & no max
    - One or both queries may be used to specify upper/lower range
    - Valid ranges from client UI are:
        - No minimum
        - Over 1 hour: `play_min=1`
        - Over 10 hours: `play_min=10`
        - Over 100 hours: `play_min=100`
        - More granular filter options with double-ended slider

- Display as param:
    - `display={summary || helpful || recent || funny}`
    - Default: `summary`
    - ONLY Summary will bring up the right-sided "Recently Posted" reviews sub-module

- Example:
    - `/api/reviews/:gameid?review_type=negative&from=365&play_min=50`
    - Get all negative reviews from a year ago until now from people who`ve played at least 50 hours


## Troubleshooting

Any uncovered problems, or errors that you solved and want to share? Feel free to [open a issue](https://github.com/FEC-Bell/steam-reviews/issues/new).

### Troubleshooting PostgreSQL
1. If using `psql -d steam_reviews` via CLI to check that the database was  seeded properly, an error
    ```
    psql: error: could not connect to server: FATAL:  role "<USERNAME>" does not exist
    ```
    might appear. If this happens, use `sudo su postgres` to switch to the postgres account, and run `psql -d steam_reviews` again. Typing `sudo su YOUR_USERNAME` will switch you back to your user account.

