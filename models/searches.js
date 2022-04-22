const axios = require("axios");

class Searches {
    history = [];
    
    constructor() {};

    get paramsMapBox() {
        return {
            "access_token": process.env.MAPBOX_KEY,
            "limit": 5,
            "language": "en",
            "types": "place",
            "proximity": "ip"
        };
    };

    get paramsWeather() {
        return {
            "appid": process.env.OPENWEATHER_KEY,
            "units": "metric",
            "lang": "en"
        };
    };

    async city(place) {
        const instance = axios.create({
            baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
            params: this.paramsMapBox
        });

        const resp = await instance.get();
        return resp.data.features.map( place => ({
            id: place.id,
            name: place.place_name,
            lng: place.center[0],
            lat: place.center[1]
        }));
    };

    async cityWeather(lat, lng) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon:lng}
            });

            const resp = await instance.get();
            const { weather, main } = resp.data;

            return {
                "desc": weather[0].description,
                "temp": main.temp,
                "min": main.temp_min,
                "max": main.temp_max
            };
        } catch(err) {
            console.log(err);
        };
    };

    addToHistory(place) {
        if( this.history.includes(place.toLowerCase())) {
            return;
        } else {
            this.history.unshift( place.toLowerCase() );
            if( this.history.length == 6 ) this.history.pop();
        };
    };
}

module.exports = Searches;