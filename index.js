require('dotenv').config();

const { inquirerMenu, pause, readInput, listPlaces } = require('./inquirerMenu');
const Searches = require('./models/searches');

const main = async() => {
    const searches = new Searches();
    let opt;

    do {
        opt = await inquirerMenu();

        switch(opt) {
            case 1:
                const place = await readInput('City: ');
                const places = await searches.city(place);
                const selectedId = await listPlaces(places);

                if( selectedId === '0') continue;

                const selectedPlace = await places.find( place => place.id === selectedId );
                searches.addToHistory( selectedPlace.name );
                
                const weather = await searches.cityWeather( selectedPlace.lat, selectedPlace.lng );
                
                console.log("\nCity information\n".green);
                console.log("City:", selectedPlace.name);
                console.log("Lat:", selectedPlace.lat);
                console.log("Lng:", selectedPlace.lng);
                console.log("Temperature:", weather.temp);
                console.log("Min:", weather.min);
                console.log("Max:", weather.max);
                console.log("How is the weather:", weather.desc);
                
                break;
        
            case 2:
                searches.history.forEach( (place, i) => {
                    const idx = `${i+1}`.green;
                    console.log(`${idx} ${place}`);
                });

                break;
        };

        if(opt !== 0) await pause();
    } while(opt !== 0);
};

main();