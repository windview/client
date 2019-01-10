# WindView

WindView is a collaborative effort between the National Renewable Energy Lab [[NREL]](https://www.nrel.gov) and Argonne National Lab [[ANL]](https://www.anl.gov) with support from the U.S. Department of Energy [[DOE]](https://www.energy.gov/). WindView is wind power visualization software which enables power system operators to better understand static and forecast information on their power system, relating to wind.

With wind power becoming increasingly more prevalent, power system operators will increasingly value being able to better interpret forecast errors early and understand the probabilities associated with wind power forecasts. As such, wind power forecasts are becoming common place, however understanding their outputs isn’t always intuitive and immediate.

WindView offers a dynamic map with an ability to zoom and pan with automatic aggregation of wind power forecasts in surrounding charts allowing a greater understanding of the forecast outputs. A forecaster or a network system operator wishing to display their wind power forecast outputs would find great value in WindView.

Data required is at least wind farm location and wind power forecast data and will display these geographically on an interactive map allowing the user to zoom in and out. Surrounding charts with automatic aggregation show summaries of the map as well as individual wind farm information. This allows fast switching between pinpointing specific pertinent information and seeing summaries of larger user-defined areas, in order to increase situational awareness. There is also capability to visualize probabilistic forecasts which would allow a power system operator to assess system wind uncertainty. Wind ramping visuals help the user understand the forecasted change in wind power.

With customizable alert visuals and different options for the user to define areas of interest, ramping thresholds and more, WindView has been made to fit multiple different power systems and remain future proof to any evolving power system, particularly in the expansion of wind power penetration.

The WindView system is divided into three basic categories of functionality. Each category has a specific role to play in the overall system architecture. The categories are
  -	Web Client - Display information to users
  -	Serverside API – Manage communication between the User Interface and the Data Streams
  -	Data Streams – Raw data from a variety of sources. Data streams are unique and in many cases proprietary for each unique installation. See the [links](#links) section for information on possible data streams of interest.

## Table of contents
- [Web Client](#web-client)
  - [Development Environment](#development-environment)
  - [Configuration](#configuration)
  - [Deployment](#deployment)
- [Serverside API](#serverside-api)
- [Data Streams](#data-streams)
  - [Wind Farms](#wind-farms)
    - [Farm Formats](#farm-formats)
  - [Forecast](#forecast)
    - [Forecast Formats](#forecast-formats)
  - [Other](#Other)
- [License](#license)
- [Links](#links)

## Web Client
The web client is an application constructed according the latest industry standards for performance, scalability, and most importantly cutting edge visualization techniques. The user interface is implemented as a collection of components with varying degrees of interconnectivity. The UI components include things like a central map with a variety of data being updated in real time, ramp event probability forecasts, detailed analysis charts, configuration pages, and meteorological data over time.

The UI widgets each consume one or more data streams provided by the API endpoints. Some refresh regularly to always display the latest data, while others respond to user inputs. Furthermore some components exist in isolation, while others depend on the state of the application and/or content contained in other components.

### Development Environment
Once you have cloned the repository, there are a few dependencies that need to be installed.

* `NodeJS >- v6.9.0`

``` bash
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install nodejs
```

* `yarn`

``` bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```

* `yarn dependencies`
This installs all of the app dependencies into your local environment

``` bash
# install dependencies with yarn
yarn

# serve with hot reload at localhost:8088
yarn start

# build for production with minification
yarn build

# run unit tests
yarn test
```

### Configuration
First create a configuration file for your instance. Copy `<PROJECT-ROOT>/settings.example.env.txt` into `<PROJECT-ROOT>/.env`. Edit as needed.
  - **API_URL** - the URL of the WindView [Serverside API](#serverside-api)
  - **TILE_SERVER_URL** - the URL of a tile server that will provide the map tiles to the viewer
  - **LOG_ACTIONS** - [true|false] Flag to enable/disable the [Logger for Redux](https://github.com/evgenyrodionov/redux-logger) middleware. Very useful for observing what's going on under the covers for informational and debugging purposes.

In addition to the above please review the [react-app documentation](https://github.com/facebook/create-react-app/blob/next/README.md) for a plethora of additional tips and tricks for working within this web framework including
  - the use of the public directory
  - custom environment variables
  - the `.env` file
  - testing
  - build optimizations
  - much more

### Deployment
Compiling and minifying the source is as simple as

```
yarn build
```

This produces a `build` directory containing the full WindView client application ready to be deployed. During development we deployed behind an NGINX reverse proxy server to handle routing, https, and things like CORS for the API routes.

## Serverside API

In order to facilitate the consumption of a varied set of data streams we have provided a set of API endpoints. API endpoints provide mechanisms for receiving, storing, searching, and delivering data to and from both a wide variety of data streams, as well as the WindView web client components.

Our implementation of the API endpoints includes a means for extending the system by adding custom data streams. Generic data formats coupled with configurable data hooks in the user interface allow users of the software to add in their own data streams. [Visit the README](https://github.com/wind-view/server)


### Wind Farms
Wind farm data is stored in the database behind the API. Wind farms can contain as many arbitrary metadata fields as is desired. When adding metadata fields to the wind farm records keep in mind that these fields will be displayed in detail components within the web client, so exercise discretion with potentially sensitive data. The minimum required fields include:
  - name
  - longitude
  - latitude
  - capacity_mw

#### Farm Formats
When requesting information about a single data farm the response will be in the following format
```json
{
    "farm": {
        "provider_id": 1,
        "provider_farm_ref": "6734",
        "name": "Awesome Wind Farm",
        "longitude": -97.678589,
        "latitude": 30.26123,
        "id": 20,
        "capacity_mw": 60
    }
}
```
The recommended method for loading wind farm data into the API is the write a data seed script. This is a standard RAILS feature and provides ease of deployment, data redundancy, as well as facilitating testing. Details in the API section of these docs.

### Forecast
Forecast data is published by forecasters. This project does not provide any built-in forecasters. The data format for data submitted to the API as well as for data retrieved from the API must adhere to the following formats.

#### Forecast Implementations
There are two reference implementations available. Information including installation details and integration with WindView can be found at their respective homepages:
  * M3 [View on Github](https://github.com/UTD-DOES/M3)

#### Forecast Formats
Point forecast data as POSTed to the API, Forecast can contain as many data points as are available!
```json
{
  "forecast": {
    "type": "point",
    "provider_forecast_ref": "3",
    "horizon_minutes": 7200,
    "generated_at": "2018-02-21T19:14:00Z",
    "begins_at": "2016-11-12T00:00:00Z",
    "farm_id": 230,
    "data": [
      [
        "2016-11-16T15:15:00Z",
        0
      ],
      [
        "2016-11-16T15:30:00Z",
        0
      ],
      [
        "2016-11-16T15:45:00Z",
        0
      ],
      [
        "2016-11-16T16:00:00Z",
        0
      ],
      [
        "2016-11-16T16:15:00Z",
        0
      ],
      [
        "2016-11-16T16:30:00Z",
        0
      ]
    ]
  }
}
```

Probabilistic forecast data
```json
{
  "forecast": {
    "begins_at": "2016-11-12T00:00:00Z",
    "farm_id": 230,
    "generated_at": "2018-02-21T19:14:00Z",
    "horizon_minutes": 7200,
    "provider_forecast_ref": "2",
    "type": "probabilistic",
    "data": [
      [
        "2016-11-12T00:00:00Z",
        0,
        0,
        0.078,
        0,
        0
      ],
      [
        "2016-11-12T00:15:00Z",
        0,
        0,
        0.052,
        0,
        0
      ],
      [
        "2016-11-12T00:30:00Z",
        0,
        0,
        0.033,
        0,
        0
      ],
      [
        "2016-11-12T00:45:00Z",
        0,
        0,
        0.003,
        0,
        0
      ],
      [
        "2016-11-12T01:00:00Z",
        0,
        0,
        0,
        0,
        0
      ],
      [
        "2016-11-12T01:15:00Z",
        0,
        0,
        0,
        0,
        0
      ]
    ]
  }
}
```

Forecast as fetched from the API
```json
{
    "forecast": {
        "type": "point",
        "provider_id": 3,
        "provider_forecast_ref": "llano_estacado_wind_ranch_at_texico_phase_ii-1530302896655",
        "id": 12631,
        "horizon_minutes": 360,
        "generated_at": "2018-06-29T20:07:48.000000Z",
        "farm_id": 235,
        "data": [
            [
                "2018-06-28T22:00:00Z",
                0.376922626578263
            ],
            [
                "2018-06-28T23:00:00Z",
                0.420103855319567
            ],
            [
                "2018-06-29T00:00:00Z",
                0.383864783480275
            ],
            [
                "2018-06-29T01:00:00Z",
                0.247625355181211
            ],
            [
                "2018-06-29T02:00:00Z",
                0.160466982982444
            ],
            [
                "2018-06-29T03:00:00Z",
                0.330518045619912
            ]
        ],
        "begins_at": "2018-06-28T22:00:00.000000Z"
    }
}
```

### Other
WindView is designed to support the addition of arbitrary data fields provided by the operators of each installation. These arbitrary fields can represent
  - additional Wind Farm metrics
  - additional alerting factors (icing, curtailment, ...)
  - additional site data
  - observational weather data
  - etc

## License

[View License](LICENSE)

## Links

[Demo Site](https://windview-beta.nrel.gov)
