function connect() {
  const searchTerm = document.getElementById("searchBox").value.trim();
  document.getElementById("searchBox").value = "";
  lastSearchedCountry = searchTerm;
  document.getElementById("displayArea").innerHTML = ""; // Clear previous content
  fetch(`https://restcountries.com/v3.1/name/${searchTerm}?fullText=true`)
    .then((res) => res.json())
    .then(showInBrowser);
}

function showInBrowser(data) {
  const displayArea = document.getElementById("displayArea");

  data.forEach((country) => {
    const {
      name: { common, official },
      capital,
      region,
      area,
      population,
      languages,
      currencies,
      timezones,
      flags,
    } = country;

    // Create a new div for each country (Left Column)
    let countryDiv = document.createElement("div");
    countryDiv.classList.add("innerDivStyle");

    countryDiv.innerHTML = `
      <h3>COUNTRY: ${common}</h3><br>
      Official Name: ${official}<br>
      Region: ${region}<br>
      Capital: ${capital?.[0] || "No capital available"}<br>
      Area: ${area.toLocaleString()} km²<br>
      Population: ${population.toLocaleString()}<br>
      Languages: ${Object.values(languages).join(", ")}<br>
      Currency: ${Object.values(currencies)[0].name} (${Object.values(currencies)[0].symbol})<br>
      Timezones: ${timezones.join(", ")}<br>
      <img src="${flags.png}" alt="Flag of ${common}" style="width:100%; max-width:300px; margin-top:10px;">
      <div class="moreButton">
        <button onclick="moreDetails()">More Details</button>
      </div>
    `;

    // Create a new div for weather details (Right Column)
    let weatherDiv = document.createElement("div");
    weatherDiv.id = "weatherInfo";
    weatherDiv.style.display = "none"; // Hide by default

    // Append both country div and weather div to displayArea
    displayArea.appendChild(countryDiv);
    displayArea.appendChild(weatherDiv);
  });
}

function moreDetails() {
  if (!lastSearchedCountry) {
    return alert("Please search for a country first!");
  }

  const key = "0710a29726464b9f86a35405240312";
  const city = lastSearchedCountry;
  const url = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${city}&aqi=no`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const location = data.location.name;
      const country = data.location.country;
      const localtime = data.location.localtime;
      const currentTemp = data.current.temp_c;
      const feelsLike = data.current.feelslike_c;
      const weatherCondition = data.current.condition.text;
      const weatherIcon = `https:${data.current.condition.icon}`;
      const humidity = data.current.humidity;
      const windSpeed = data.current.wind_kph;
      const windDirection = data.current.wind_dir;
      const precipitation = data.current.precip_mm;
      const uvIndex = data.current.uv;
      const visibility = data.current.vis_km;

      const displayArea = document.getElementById("displayArea");

      // Select the weather info div (the second div appended for each country)
      const weatherDiv = displayArea.querySelector("#weatherInfo");

      // Fill the weather information
      weatherDiv.innerHTML = `
        <strong>Weather Information</strong>
        <img src="${weatherIcon}" alt="Weather Icon" style="vertical-align: middle;"> <br>
        City Name: ${location} <br>
        Country: ${country} <br>
        Local Time: ${localtime} <br>
        Current Temperature: ${currentTemp}°C <br>
        Feels Like: ${feelsLike}°C <br>
        Weather Condition: ${weatherCondition} <br>
        Humidity: ${humidity}% <br>
        Wind Speed: ${windSpeed} kph <br>
        Wind Direction: ${windDirection} <br>
        Precipitation: ${precipitation} mm <br>
        Visibility: ${visibility} km <br>
        UV Index: ${uvIndex} <br>
      `;

      // Show the weather details div
      weatherDiv.style.display = "block";
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert("Failed to fetch weather data.");
    });
}
