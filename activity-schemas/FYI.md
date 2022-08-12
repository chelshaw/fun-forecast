# Activity schema

There's a lot of considerations when it comes to whether you want to go do a thing outside. It's not quite as simple as weather X temperature -- sometimes you're ok with doing something when it's sunny and below 70°, but if it's above 70° you want some cover. 

To cover this complexity, the activity schema has some essential properties and philosophy:

## "Never" scenarios
Some temperatures you don't want to do something, no matter the type of weather. Vice versa as well -- if there's a tornado, no matter how nice the temperature, you don't want to be outside. So the activity schema has some "never" values, which get checked first:

```json
{
    "temp_never_below": 60, // exclusive
    "temp_never_above": 97, // exclusive
    "weather_never": [
        "sleet",
        "rain",
        "lightning"
    ],
    "wind_never_above": 18, // exclusive
    "wind_never_below": 0, // exclusive
    "daytime_only": true,
}
```

Think of these as the moment you *don't* want to go outside. 

## Desired ranges
Once you know there isn't weather you never want to be in, you want to know whether the temperature and weather combinations are ideal for your activity. That's where ranges come in. This is an array of scenarios in which you would be ok with being outside.

You'll notice in the "never" blocks the integer values are exclusive. That means the evaluation will use `<` and `>`, and will not match if equal. The ranges, in contrast, are inclusive (`>=` or `<=`). So you must make sure the lowest temp of the ranges matches the "never below" value, and the highest temp of the ranges matches the "never above" value. Additionally, there should never be overlap between the highest and lowest ranges. 

With weather is also inclusive, so the values represented are the desired limits of weather for the activity. 

### Invalid ranges
```json
{
    "ranges": [
        {
            "low": 60,
            "high": 70,
            "with_weather": [
                0,
                3
            ]
        },
        {
            "low": 70,
            "high": 80,
            "with_weather": [
                0,
                5
            ]
        }
    ]
}
```