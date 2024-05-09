// Seleziona gli elementi HTML
var input = document.querySelector('#cityInput');
var main = document.querySelector('#name');
var coordinates = document.querySelector('.coordinates');
var temp = document.querySelector('.temp');
var desc = document.querySelector('.desc');
var clouds = document.querySelector('.clouds');
var humidity = document.querySelector('.humidity');
var windSpeed = document.querySelector('.wind-speed');
var pressure = document.querySelector('.pressure');
var visibility = document.querySelector('.visibility');
var sunrise = document.querySelector('.sunrise');
var sunset = document.querySelector('.sunset');
var button = document.querySelector('#submitButton');
var forecastButton = document.querySelector('#forecastButton');
var weatherCard = document.querySelector('#weatherCard');
var forecastDiv = document.querySelector('#forecastDiv');
var icon = document.querySelector('#icon');
var currentId;

// Aggiungi un listener per il click sul pulsante di invio
button.addEventListener('click', function () {
    // Effettua una richiesta API per ottenere i dati meteo della città
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + input.value + '&appid=50a7aa80fa492fa92e874d23ad061374&units=metric')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Estrai i dati necessari dalla risposta
            var tempValue = data['main']['temp'];
            var nameValue = data['name'];
            var descValue = data['weather'][0]['description'];
            var humidityValue = data['main']['humidity'];
            var windSpeedValue = data['wind']['speed'];
            var pressureValue = data['main']['pressure'];
            var visibilityValue = data['visibility'];
            var sunriseTime = new Date(data['sys']['sunrise'] * 1000).toLocaleTimeString('en-US');
            var sunsetTime = new Date(data['sys']['sunset'] * 1000).toLocaleTimeString('en-US');
            var weatherIcon = data['weather'][0]['icon'];
            var coordinatesValue = "Coordinates: " + data['coord']['lat'] + ", " + data['coord']['lon'];

            // Aggiorna i contenuti HTML con i dati ottenuti
            main.innerHTML = nameValue;
            coordinates.innerHTML = coordinatesValue;
            desc.innerHTML = "Desc - " + descValue;
            temp.innerHTML = "Temp - " + tempValue + "°C";
            humidity.innerHTML = "Humidity - " + humidityValue + "%";
            windSpeed.innerHTML = "Wind Speed - " + windSpeedValue + " m/s";
            pressure.innerHTML = "Pressure - " + pressureValue + " hPa";
            visibility.innerHTML = "Visibility - " + visibilityValue + " meters";
            sunrise.innerHTML = "Sunrise - " + sunriseTime;
            sunset.innerHTML = "Sunset - " + sunsetTime;
            weatherCard.style.display = 'block';
            input.value = "";
            currentId = data['id'];
            icon.src = 'https://openweathermap.org/img/w/' + weatherIcon + '.png';
        })
        .catch(err => {
            // Se si verifica un errore, nascondi la card meteo e mostra un avviso
            weatherCard.style.display = 'none';
            alert("City not found");
        });
});

// Aggiungi un listener per il click sul pulsante di visualizzazione del forecast
forecastButton.addEventListener('click', function () {
    // Effettua una richiesta API per ottenere il forecast della città
    fetch('https://api.openweathermap.org/data/2.5/forecast?id=' + currentId + '&appid=24f57cc104e5a79c403c6b0f310e8ea0&units=metric')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Estrai i dati del forecast dalla risposta
            var forecastData = data['list'];
            var forecastHTML = "<p>Forecast for the next 5 days</p>";
            // Ciclo attraverso i dati del forecast e crea una lista HTML
            for (var i = 0; i < forecastData.length; i += 8) {
                var forecastDateTime = new Date(forecastData[i]['dt'] * 1000);
                var forecastDate = forecastDateTime.toLocaleDateString('en-US');
                var forecastDesc = forecastData[i]['weather'][0]['description'];
                forecastHTML += "<ul>" + forecastDate + ": " + forecastDesc + "</ul>";
            }
            // Aggiorna il contenuto HTML del div del forecast e mostra il div
            forecastDiv.innerHTML = forecastHTML;
            forecastDiv.style.display = 'block';
        })
        .catch(err => {
            // Se si verifica un errore, mostra un avviso nel div del forecast
            forecastDiv.innerHTML = "<p>No forecast available for this city</p>";
            forecastDiv.style.display = 'block';
        });
});