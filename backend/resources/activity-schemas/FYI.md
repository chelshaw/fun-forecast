# Activity schema

There are many considerations when it comes to deciding whether to go do a thing outside. Three main factors intertwine to make the conditions suitable or not for a given activity, and each activity has a different threshold of these components. 

The factors are:
- Temperature
- Wind
- Weather conditions (sunny, rain, fog, etc)

Other factors (UV, allergens, ground conditions) may be added in the future, but these are most universal to outdoor activities.

## Structure
On the top level, we have the verb for the activity. This is a unique reference key for the base schemas. Under that, we have a few blocks. All of the numbers in the blocks are *inclusive*.

```
{
    "verb": "swim",
    "wind": {...},
    "temp": {...},
    "weather_conditions": {...},
    "light_conditions": {...}
}
```

`wind` and `temp` have similar structures, defining the min, max, and ideal units for the given activity so that each factor has its own bell curve for suitability. The `ideal` number assumes that the weather condition is partly sunny. 

```
"temp": {
    "min": 75,
    "ideal": 89,
    "max": 102,
    "units": "F"
},
```

The `weather_conditions` block includes an `acceptable` block which describes the offset (from ideal) for temperature if the hourly condition matches that key. 

Within the block for weather conditions is also a `never` stanza, which includes weather in which the activity is never suitable, no matter the other factors. 

```
"weather_conditions": {
    "acceptable": {
        "sunny": -5,
        "foggy": 10,
    },
    "never": [
        "sleet",
        "lightning"
    ]
},
```

Lastly is `light_conditions`, which simply describes whether the activity can be done in daytime, nighttime, or both

```
"light_conditions": {
    "daytime": true,
    "nighttime": true
}
```
