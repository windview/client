export default {
  "version": 8,
  "name": "Dark Matter",
  "metadata": {
    "mapbox:autocomposite": false,
    "mapbox:type": "template",
    "mapbox:groups": {
      "b6371a3f2f5a9932464fa3867530a2e5": {
        "name": "Transportation",
        "collapsed": false
      },
      "a14c9607bc7954ba1df7205bf660433f": {
        "name": "Boundaries"
      },
      "101da9f13b64a08fa4b6ac1168e89e5f": {
        "name": "Places",
        "collapsed": false
      }
    },
    "openmaptiles:version": "3.x",
    "openmaptiles:mapbox:owner": "openmaptiles",
    "openmaptiles:mapbox:source:url": ""
  },
  "center": [
    20.745027854803,
    50.39944115761509
  ],
  "zoom": 3.8053494517746405,
  "bearing": 0,
  "pitch": 0,
  "sources": {
    "openmaptiles": {
      "type": "vector",
      "url": process.env.TILE_SERVER_URL + "/united_states_of_america/metadata.json"
    }
  },
  "sprite": "https://openmaptiles.github.io/dark-matter-gl-style/sprite",
  "glyphs": "https://free.tilehosting.com/fonts/{fontstack}/{range}.pbf",
  "layers": [
    {
      "id": "background",
      "type": "background",
      "paint": {
        "background-color": "rgb(12,12,12)"
      }
    },
    {
      "id": "water",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "water",
      "filter": [
        "==",
        "$type",
        "Polygon"
      ],
      "layout": {
        "visibility": "visible"
      },
      "paint": {
        "fill-color": "rgb(27 ,27 ,29)",
        "fill-antialias": false
      }
    },
    {
      "id": "landcover_ice_shelf",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "landcover",
      "maxzoom": 8,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "Polygon"
        ],
        [
          "==",
          "subclass",
          "ice_shelf"
        ]
      ],
      "layout": {
        "visibility": "visible"
      },
      "paint": {
        "fill-color": "rgb(12,12,12)",
        "fill-opacity": 0.7
      }
    },
    {
      "id": "landcover_glacier",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "landcover",
      "maxzoom": 8,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "Polygon"
        ],
        [
          "==",
          "subclass",
          "glacier"
        ]
      ],
      "layout": {
        "visibility": "visible"
      },
      "paint": {
        "fill-color": "hsl(0, 1%, 2%)",
        "fill-opacity": {
          "base": 1,
          "stops": [
            [
              0,
              1
            ],
            [
              8,
              0.5
            ]
          ]
        }
      }
    },
    {
      "id": "landuse_residential",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "landuse",
      "maxzoom": 9,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "Polygon"
        ],
        [
          "==",
          "class",
          "residential"
        ]
      ],
      "layout": {
        "visibility": "visible"
      },
      "paint": {
        "fill-color": "hsl(0, 2%, 5%)",
        "fill-opacity": 0.4
      }
    },
    {
      "id": "landcover_wood",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "landcover",
      "minzoom": 10,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "Polygon"
        ],
        [
          "==",
          "class",
          "wood"
        ]
      ],
      "layout": {
        "visibility": "visible"
      },
      "paint": {
        "fill-color": "rgb(32,32,32)",
        "fill-opacity": {
          "base": 0.3,
          "stops": [
            [
              8,
              0
            ],
            [
              10,
              0.8
            ],
            [
              13,
              0.4
            ]
          ]
        },
        "fill-translate": [
          0,
          0
        ],
        "fill-pattern": "wood-pattern"
      }
    },
    {
      "id": "landuse_park",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "landuse",
      "filter": [
        "all",
        [
          "==",
          "$type",
          "Polygon"
        ],
        [
          "==",
          "class",
          "park"
        ]
      ],
      "layout": {
        "visibility": "visible"
      },
      "paint": {
        "fill-color": "rgb(32,32,32)"
      }
    },
    {
      "id": "waterway",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "waterway",
      "filter": [
        "==",
        "$type",
        "LineString"
      ],
      "layout": {
        "visibility": "visible"
      },
      "paint": {
        "line-color": "rgb(27 ,27 ,29)"
      }
    },
    {
      "id": "water_name",
      "type": "symbol",
      "source": "openmaptiles",
      "source-layer": "water_name",
      "filter": [
        "==",
        "$type",
        "LineString"
      ],
      "layout": {
        "text-field": "{name}",
        "symbol-placement": "line",
        "text-rotation-alignment": "map",
        "symbol-spacing": 500,
        "text-font": [
          "Metropolis Medium Italic",
          "Klokantech Noto Sans Italic",
          "Klokantech Noto Sans CJK Regular"
        ],
        "text-size": 12
      },
      "paint": {
        "text-color": "hsla(0, 0%, 0%, 0.7)",
        "text-halo-color": "hsl(0, 0%, 27%)"
      }
    },
    {
      "id": "building",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "building",
      "minzoom": 12,
      "filter": [
        "==",
        "$type",
        "Polygon"
      ],
      "paint": {
        "fill-color": "rgb(10,10,10)",
        "fill-outline-color": "rgb(27 ,27 ,29)",
        "fill-antialias": true
      }
    },
    {
      "id": "aeroway-taxiway",
      "type": "line",
      "metadata": {
        "mapbox:group": "1444849345966.4436"
      },
      "source": "openmaptiles",
      "source-layer": "aeroway",
      "minzoom": 12,
      "filter": [
        "all",
        [
          "in",
          "class",
          "taxiway"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible"
      },
      "paint": {
        "line-color": "#181818",
        "line-width": {
          "base": 1.55,
          "stops": [
            [
              13,
              1.8
            ],
            [
              20,
              20
            ]
          ]
        },
        "line-opacity": 1
      }
    },
    {
      "id": "aeroway-runway-casing",
      "type": "line",
      "metadata": {
        "mapbox:group": "1444849345966.4436"
      },
      "source": "openmaptiles",
      "source-layer": "aeroway",
      "minzoom": 11,
      "filter": [
        "all",
        [
          "in",
          "class",
          "runway"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible"
      },
      "paint": {
        "line-color": "rgba(60,60,60,0.8)",
        "line-width": {
          "base": 1.5,
          "stops": [
            [
              11,
              5
            ],
            [
              17,
              55
            ]
          ]
        },
        "line-opacity": 1
      }
    },
    {
      "id": "aeroway-area",
      "type": "fill",
      "metadata": {
        "mapbox:group": "1444849345966.4436"
      },
      "source": "openmaptiles",
      "source-layer": "aeroway",
      "minzoom": 4,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "Polygon"
        ],
        [
          "in",
          "class",
          "runway",
          "taxiway"
        ]
      ],
      "layout": {
        "visibility": "visible"
      },
      "paint": {
        "fill-opacity": 1,
        "fill-color": "#000"
      }
    },
    {
      "id": "aeroway-runway",
      "type": "line",
      "metadata": {
        "mapbox:group": "1444849345966.4436"
      },
      "source": "openmaptiles",
      "source-layer": "aeroway",
      "minzoom": 11,
      "filter": [
        "all",
        [
          "in",
          "class",
          "runway"
        ],
        [
          "==",
          "$type",
          "LineString"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible"
      },
      "paint": {
        "line-color": "#000",
        "line-width": {
          "base": 1.5,
          "stops": [
            [
              11,
              4
            ],
            [
              17,
              50
            ]
          ]
        },
        "line-opacity": 1
      }
    },
    {
      "id": "highway_path",
      "type": "line",
      "metadata": {
        "mapbox:group": "b6371a3f2f5a9932464fa3867530a2e5"
      },
      "source": "openmaptiles",
      "source-layer": "transportation",
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "==",
          "class",
          "path"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible"
      },
      "paint": {
        "line-color": "rgb(27 ,27 ,29)",
        "line-width": {
          "base": 1.2,
          "stops": [
            [
              13,
              1
            ],
            [
              20,
              10
            ]
          ]
        },
        "line-opacity": 0.9,
        "line-dasharray": [
          1.5,
          1.5
        ]
      }
    },
    {
      "id": "highway_minor",
      "type": "line",
      "metadata": {
        "mapbox:group": "b6371a3f2f5a9932464fa3867530a2e5"
      },
      "source": "openmaptiles",
      "source-layer": "transportation",
      "minzoom": 8,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "in",
          "class",
          "minor",
          "service",
          "track"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible"
      },
      "paint": {
        "line-color": "#181818",
        "line-width": {
          "base": 1.55,
          "stops": [
            [
              13,
              1.8
            ],
            [
              20,
              20
            ]
          ]
        },
        "line-opacity": 0.9
      }
    },
    {
      "id": "highway_major_casing",
      "type": "line",
      "metadata": {
        "mapbox:group": "b6371a3f2f5a9932464fa3867530a2e5"
      },
      "source": "openmaptiles",
      "source-layer": "transportation",
      "minzoom": 11,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "in",
          "class",
          "primary",
          "secondary",
          "tertiary",
          "trunk"
        ]
      ],
      "layout": {
        "line-cap": "butt",
        "line-join": "miter",
        "visibility": "visible"
      },
      "paint": {
        "line-color": "rgba(60,60,60,0.8)",
        "line-dasharray": [
          12,
          0
        ],
        "line-width": {
          "base": 1.3,
          "stops": [
            [
              10,
              3
            ],
            [
              20,
              23
            ]
          ]
        }
      }
    },
    {
      "id": "highway_major_inner",
      "type": "line",
      "metadata": {
        "mapbox:group": "b6371a3f2f5a9932464fa3867530a2e5"
      },
      "source": "openmaptiles",
      "source-layer": "transportation",
      "minzoom": 11,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "in",
          "class",
          "primary",
          "secondary",
          "tertiary",
          "trunk"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible"
      },
      "paint": {
        "line-color": "hsl(0, 0%, 7%)",
        "line-width": {
          "base": 1.3,
          "stops": [
            [
              10,
              2
            ],
            [
              20,
              20
            ]
          ]
        }
      }
    },
    {
      "id": "highway_major_subtle",
      "type": "line",
      "metadata": {
        "mapbox:group": "b6371a3f2f5a9932464fa3867530a2e5"
      },
      "source": "openmaptiles",
      "source-layer": "transportation",
      "maxzoom": 11,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "in",
          "class",
          "primary",
          "secondary",
          "tertiary",
          "trunk"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible"
      },
      "paint": {
        "line-color": "#2a2a2a",
        "line-width": {
          "stops": [
            [
              6,
              0
            ],
            [
              8,
              2
            ]
          ]
        }
      },
      "minzoom": 6
    },
    {
      "id": "highway_motorway_casing",
      "type": "line",
      "metadata": {
        "mapbox:group": "b6371a3f2f5a9932464fa3867530a2e5"
      },
      "source": "openmaptiles",
      "source-layer": "transportation",
      "minzoom": 6,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "==",
          "class",
          "motorway"
        ]
      ],
      "layout": {
        "line-cap": "butt",
        "line-join": "miter",
        "visibility": "visible"
      },
      "paint": {
        "line-color": "rgba(60,60,60,0.8)",
        "line-width": {
          "base": 1.4,
          "stops": [
            [
              5.8,
              0
            ],
            [
              6,
              3
            ],
            [
              20,
              40
            ]
          ]
        },
        "line-dasharray": [
          2,
          0
        ],
        "line-opacity": 1
      }
    },
    {
      "id": "highway_motorway_inner",
      "type": "line",
      "metadata": {
        "mapbox:group": "b6371a3f2f5a9932464fa3867530a2e5"
      },
      "source": "openmaptiles",
      "source-layer": "transportation",
      "minzoom": 6,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "==",
          "class",
          "motorway"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible"
      },
      "paint": {
        "line-color": {
          "base": 1,
          "stops": [
            [
              5.8,
              "hsla(0, 0%, 85%, 0.53)"
            ],
            [
              6,
              "#000"
            ]
          ]
        },
        "line-width": {
          "base": 1.4,
          "stops": [
            [
              4,
              2
            ],
            [
              6,
              1.3
            ],
            [
              20,
              30
            ]
          ]
        }
      }
    },
    {
      "id": "highway_motorway_subtle",
      "type": "line",
      "metadata": {
        "mapbox:group": "b6371a3f2f5a9932464fa3867530a2e5"
      },
      "source": "openmaptiles",
      "source-layer": "transportation",
      "maxzoom": 6,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "==",
          "class",
          "motorway"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible"
      },
      "paint": {
        "line-color": "#181818",
        "line-width": {
          "base": 1.4,
          "stops": [
            [
              4,
              2
            ],
            [
              6,
              1.3
            ]
          ]
        }
      }
    },
    {
      "id": "railway_minor",
      "type": "line",
      "metadata": {
        "mapbox:group": "b6371a3f2f5a9932464fa3867530a2e5"
      },
      "source": "openmaptiles",
      "source-layer": "transportation",
      "minzoom": 16,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "all",
          [
            "==",
            "class",
            "rail"
          ],
          [
            "has",
            "service"
          ]
        ]
      ],
      "layout": {
        "visibility": "visible",
        "line-join": "round"
      },
      "paint": {
        "line-color": "rgb(35,35,35)",
        "line-width": 3
      }
    },
    {
      "id": "railway_minor_dashline",
      "type": "line",
      "metadata": {
        "mapbox:group": "b6371a3f2f5a9932464fa3867530a2e5"
      },
      "source": "openmaptiles",
      "source-layer": "transportation",
      "minzoom": 16,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "all",
          [
            "==",
            "class",
            "rail"
          ],
          [
            "has",
            "service"
          ]
        ]
      ],
      "layout": {
        "visibility": "visible",
        "line-join": "round"
      },
      "paint": {
        "line-color": "rgb(12,12,12)",
        "line-width": 2,
        "line-dasharray": [
          3,
          3
        ]
      }
    },
    {
      "id": "railway",
      "type": "line",
      "metadata": {
        "mapbox:group": "b6371a3f2f5a9932464fa3867530a2e5"
      },
      "source": "openmaptiles",
      "source-layer": "transportation",
      "minzoom": 13,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "==",
          "class",
          "rail"
        ]
      ],
      "layout": {
        "visibility": "visible",
        "line-join": "round"
      },
      "paint": {
        "line-width": {
          "base": 1.3,
          "stops": [
            [
              16,
              3
            ],
            [
              20,
              7
            ]
          ]
        },
        "line-color": "rgb(35,35,35)"
      }
    },
    {
      "id": "railway_dashline",
      "type": "line",
      "metadata": {
        "mapbox:group": "b6371a3f2f5a9932464fa3867530a2e5"
      },
      "source": "openmaptiles",
      "source-layer": "transportation",
      "minzoom": 13,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "==",
          "class",
          "rail"
        ]
      ],
      "layout": {
        "visibility": "visible",
        "line-join": "round"
      },
      "paint": {
        "line-color": "rgb(12,12,12)",
        "line-width": {
          "base": 1.3,
          "stops": [
            [
              16,
              2
            ],
            [
              20,
              6
            ]
          ]
        },
        "line-dasharray": [
          3,
          3
        ]
      }
    },
    {
      "id": "highway_name_other",
      "type": "symbol",
      "metadata": {
        "mapbox:group": "b6371a3f2f5a9932464fa3867530a2e5"
      },
      "source": "openmaptiles",
      "source-layer": "transportation_name",
      "filter": [
        "all",
        [
          "!=",
          "class",
          "motorway"
        ],
        [
          "==",
          "$type",
          "LineString"
        ]
      ],
      "layout": {
        "text-size": 10,
        "text-max-angle": 30,
        "text-transform": "uppercase",
        "symbol-spacing": 350,
        "text-font": [
          "Metropolis Regular",
          "Klokantech Noto Sans Regular",
          "Klokantech Noto Sans CJK Regular"
        ],
        "symbol-placement": "line",
        "visibility": "visible",
        "text-rotation-alignment": "map",
        "text-pitch-alignment": "viewport",
        "text-field": "{name}"
      },
      "paint": {
        "text-color": "rgba(80, 78, 78, 1)",
        "text-translate": [
          0,
          0
        ],
        "text-halo-color": "rgba(0, 0, 0, 1)",
        "text-halo-width": 1,
        "text-halo-blur": 0
      }
    },
    {
      "id": "highway_name_motorway",
      "type": "symbol",
      "metadata": {
        "mapbox:group": "b6371a3f2f5a9932464fa3867530a2e5"
      },
      "source": "openmaptiles",
      "source-layer": "transportation_name",
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "==",
          "class",
          "motorway"
        ]
      ],
      "layout": {
        "text-size": 10,
        "symbol-spacing": 350,
        "text-font": [
          "Metropolis Light",
          "Klokantech Noto Sans Regular",
          "Klokantech Noto Sans CJK Regular"
        ],
        "symbol-placement": "line",
        "visibility": "visible",
        "text-rotation-alignment": "viewport",
        "text-pitch-alignment": "viewport",
        "text-field": "{ref}"
      },
      "paint": {
        "text-color": "hsl(0, 0%, 37%)",
        "text-translate": [
          0,
          2
        ]
      }
    },
    {
      "id": "boundary_state",
      "type": "line",
      "metadata": {
        "mapbox:group": "a14c9607bc7954ba1df7205bf660433f"
      },
      "source": "openmaptiles",
      "source-layer": "boundary",
      "filter": [
        "==",
        "admin_level",
        4
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible"
      },
      "paint": {
        "line-color": "hsl(0, 0%, 21%)",
        "line-width": {
          "base": 1.3,
          "stops": [
            [
              3,
              1
            ],
            [
              22,
              15
            ]
          ]
        },
        "line-blur": 0.4,
        "line-dasharray": [
          2,
          2
        ],
        "line-opacity": 1
      }
    },
    {
      "id": "boundary_country",
      "type": "line",
      "metadata": {
        "mapbox:group": "a14c9607bc7954ba1df7205bf660433f"
      },
      "source": "openmaptiles",
      "source-layer": "boundary",
      "filter": [
        "==",
        "admin_level",
        2
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "hsl(0, 0%, 23%)",
        "line-width": {
          "base": 1.1,
          "stops": [
            [
              3,
              1
            ],
            [
              22,
              20
            ]
          ]
        },
        "line-blur": {
          "base": 1,
          "stops": [
            [
              0,
              0.4
            ],
            [
              22,
              4
            ]
          ]
        },
        "line-opacity": 1
      }
    },
    {
      "id": "place_other",
      "type": "symbol",
      "metadata": {
        "mapbox:group": "101da9f13b64a08fa4b6ac1168e89e5f"
      },
      "source": "openmaptiles",
      "source-layer": "place",
      "maxzoom": 14,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "Point"
        ],
        [
          "in",
          "class",
          "hamlet",
          "isolated_dwelling",
          "neighbourhood"
        ]
      ],
      "layout": {
        "text-size": 10,
        "text-transform": "uppercase",
        "text-font": [
          "Metropolis Regular",
          "Klokantech Noto Sans Regular",
          "Klokantech Noto Sans CJK Regular"
        ],
        "text-justify": "center",
        "visibility": "visible",
        "text-offset": [
          0.5,
          0
        ],
        "text-anchor": "center",
        "text-field": "{name_en}"
      },
      "paint": {
        "text-color": "rgb(101,101,101)",
        "text-halo-color": "rgba(0,0,0,0.7)",
        "text-halo-width": 1,
        "text-halo-blur": 1
      }
    },
    {
      "id": "place_suburb",
      "type": "symbol",
      "metadata": {
        "mapbox:group": "101da9f13b64a08fa4b6ac1168e89e5f"
      },
      "source": "openmaptiles",
      "source-layer": "place",
      "maxzoom": 15,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "Point"
        ],
        [
          "==",
          "class",
          "suburb"
        ]
      ],
      "layout": {
        "text-size": 10,
        "text-transform": "uppercase",
        "text-font": [
          "Metropolis Regular",
          "Klokantech Noto Sans Regular",
          "Klokantech Noto Sans CJK Regular"
        ],
        "text-justify": "center",
        "visibility": "visible",
        "text-offset": [
          0.5,
          0
        ],
        "text-anchor": "center",
        "text-field": "{name_en}"
      },
      "paint": {
        "text-color": "rgb(101,101,101)",
        "text-halo-color": "rgba(0,0,0,0.7)",
        "text-halo-width": 1,
        "text-halo-blur": 1
      }
    },
    {
      "id": "place_village",
      "type": "symbol",
      "metadata": {
        "mapbox:group": "101da9f13b64a08fa4b6ac1168e89e5f"
      },
      "source": "openmaptiles",
      "source-layer": "place",
      "maxzoom": 14,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "Point"
        ],
        [
          "==",
          "class",
          "village"
        ]
      ],
      "layout": {
        "text-size": 10,
        "text-transform": "uppercase",
        "text-font": [
          "Metropolis Regular",
          "Klokantech Noto Sans Regular",
          "Klokantech Noto Sans CJK Regular"
        ],
        "text-justify": "left",
        "visibility": "visible",
        "text-offset": [
          0.5,
          0.2
        ],
        "icon-size": 0.4,
        "text-anchor": "left",
        "text-field": "{name_en}"
      },
      "paint": {
        "text-color": "rgb(101,101,101)",
        "text-halo-color": "rgba(0,0,0,0.7)",
        "text-halo-width": 1,
        "text-halo-blur": 1,
        "icon-opacity": 0.7
      }
    },
    {
      "id": "place_town",
      "type": "symbol",
      "metadata": {
        "mapbox:group": "101da9f13b64a08fa4b6ac1168e89e5f"
      },
      "source": "openmaptiles",
      "source-layer": "place",
      "maxzoom": 15,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "Point"
        ],
        [
          "==",
          "class",
          "town"
        ]
      ],
      "layout": {
        "text-size": 10,
        "icon-image": {
          "base": 1,
          "stops": [
            [
              0,
              "circle-11"
            ],
            [
              9,
              ""
            ]
          ]
        },
        "text-transform": "uppercase",
        "text-font": [
          "Metropolis Regular",
          "Klokantech Noto Sans Regular",
          "Klokantech Noto Sans CJK Regular"
        ],
        "text-justify": "left",
        "visibility": "visible",
        "text-offset": [
          0.5,
          0.2
        ],
        "icon-size": 0.4,
        "text-anchor": {
          "base": 1,
          "stops": [
            [
              0,
              "left"
            ],
            [
              8,
              "center"
            ]
          ]
        },
        "text-field": "{name_en}"
      },
      "paint": {
        "text-color": "rgb(101,101,101)",
        "text-halo-color": "rgba(0,0,0,0.7)",
        "text-halo-width": 1,
        "text-halo-blur": 1,
        "icon-opacity": 0.7
      }
    },
    {
      "id": "place_city",
      "type": "symbol",
      "metadata": {
        "mapbox:group": "101da9f13b64a08fa4b6ac1168e89e5f"
      },
      "source": "openmaptiles",
      "source-layer": "place",
      "maxzoom": 14,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "Point"
        ],
        [
          "any",
          [
            "==",
            "class",
            "city"
          ],
          [
            ">",
            "rank",
            2
          ]
        ]
      ],
      "layout": {
        "text-size": 10,
        "icon-image": {
          "base": 1,
          "stops": [
            [
              0,
              "circle-11"
            ],
            [
              9,
              ""
            ]
          ]
        },
        "text-transform": "uppercase",
        "text-font": [
          "Metropolis Regular",
          "Klokantech Noto Sans Regular",
          "Klokantech Noto Sans CJK Regular"
        ],
        "text-justify": "left",
        "visibility": "visible",
        "text-offset": [
          0.5,
          0.2
        ],
        "icon-size": 0.4,
        "text-anchor": {
          "base": 1,
          "stops": [
            [
              0,
              "left"
            ],
            [
              8,
              "center"
            ]
          ]
        },
        "text-field": "{name_en}"
      },
      "paint": {
        "text-color": "rgb(101,101,101)",
        "text-halo-color": "rgba(0,0,0,0.7)",
        "text-halo-width": 1,
        "text-halo-blur": 1,
        "icon-opacity": 0.7
      }
    },
    {
      "id": "place_city_large",
      "type": "symbol",
      "metadata": {
        "mapbox:group": "101da9f13b64a08fa4b6ac1168e89e5f"
      },
      "source": "openmaptiles",
      "source-layer": "place",
      "maxzoom": 12,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "Point"
        ],
        [
          "all",
          [
            "<=",
            "rank",
            3
          ],
          [
            "==",
            "class",
            "city"
          ]
        ]
      ],
      "layout": {
        "text-size": 14,
        "icon-image": {
          "base": 1,
          "stops": [
            [
              0,
              "circle-11"
            ],
            [
              9,
              ""
            ]
          ]
        },
        "text-transform": "uppercase",
        "text-font": [
          "Metropolis Regular",
          "Klokantech Noto Sans Regular",
          "Klokantech Noto Sans CJK Regular"
        ],
        "text-justify": "left",
        "visibility": "visible",
        "text-offset": [
          0.5,
          0.2
        ],
        "icon-size": 0.4,
        "text-anchor": {
          "base": 1,
          "stops": [
            [
              0,
              "left"
            ],
            [
              8,
              "center"
            ]
          ]
        },
        "text-field": "{name}"
      },
      "paint": {
        "text-color": "rgb(101,101,101)",
        "text-halo-color": "rgba(0,0,0,0.7)",
        "text-halo-width": 1,
        "text-halo-blur": 1,
        "icon-opacity": 0.7
      }
    },
    {
      "id": "place_state",
      "type": "symbol",
      "metadata": {
        "mapbox:group": "101da9f13b64a08fa4b6ac1168e89e5f"
      },
      "source": "openmaptiles",
      "source-layer": "place",
      "maxzoom": 12,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "Point"
        ],
        [
          "==",
          "class",
          "state"
        ]
      ],
      "layout": {
        "visibility": "visible",
        "text-field": "{name_en}",
        "text-font": [
          "Metropolis Regular",
          "Klokantech Noto Sans Regular",
          "Klokantech Noto Sans CJK Regular"
        ],
        "text-transform": "uppercase",
        "text-size": 10
      },
      "paint": {
        "text-color": "rgb(101,101,101)",
        "text-halo-color": "rgba(0,0,0,0.7)",
        "text-halo-width": 1,
        "text-halo-blur": 1
      }
    },
    {
      "id": "place_country_other",
      "type": "symbol",
      "metadata": {
        "mapbox:group": "101da9f13b64a08fa4b6ac1168e89e5f"
      },
      "source": "openmaptiles",
      "source-layer": "place",
      "maxzoom": 8,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "Point"
        ],
        [
          "all",
          [
            "==",
            "class",
            "country"
          ],
          [
            ">=",
            "rank",
            2
          ]
        ]
      ],
      "layout": {
        "visibility": "visible",
        "text-field": "{name_en}",
        "text-font": [
          "Metropolis Regular",
          "Klokantech Noto Sans Regular",
          "Klokantech Noto Sans CJK Regular"
        ],
        "text-transform": "uppercase",
        "text-size": {
          "base": 1,
          "stops": [
            [
              0,
              10
            ],
            [
              6,
              12
            ]
          ]
        }
      },
      "paint": {
        "text-halo-width": 1.4,
        "text-halo-color": "rgba(0,0,0,0.7)",
        "text-color": "rgb(101,101,101)"
      }
    },
    {
      "id": "place_country_major",
      "type": "symbol",
      "metadata": {
        "mapbox:group": "101da9f13b64a08fa4b6ac1168e89e5f"
      },
      "source": "openmaptiles",
      "source-layer": "place",
      "maxzoom": 6,
      "filter": [
        "all",
        [
          "==",
          "$type",
          "Point"
        ],
        [
          "all",
          [
            "<=",
            "rank",
            1
          ],
          [
            "==",
            "class",
            "country"
          ]
        ]
      ],
      "layout": {
        "visibility": "visible",
        "text-field": "{name_en}",
        "text-font": [
          "Metropolis Regular",
          "Klokantech Noto Sans Regular",
          "Klokantech Noto Sans CJK Regular"
        ],
        "text-transform": "uppercase",
        "text-size": {
          "base": 1.4,
          "stops": [
            [
              0,
              10
            ],
            [
              3,
              12
            ],
            [
              4,
              14
            ]
          ]
        },
        "text-anchor": "center"
      },
      "paint": {
        "text-halo-width": 1.4,
        "text-halo-color": "rgba(0,0,0,0.7)",
        "text-color": "rgb(101,101,101)"
      }
    }
  ],
  "id": "ciwf4jmfe00882qmzvu5vh0zx"
};
