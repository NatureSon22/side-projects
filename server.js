const placeInput = document.querySelector('[data-input-place]');
const searchBtn = document.querySelector('[data-search-btn]');
const temperature = document.querySelector('[data-degrees]');
const tempDescription = document.querySelector('[data-description]');
const weatherImage = document.querySelector('[data-image-weather]');
const humid = document.querySelector('[data-humidity]');
const windSpeed = document.querySelector('[data-wind-speed]');
const apiKey = '576acdf89f2bf0d641a8a6c54222f06c'; // Don't use this or else i will k_m_s
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const weather = {
	clear : ['clear sky'],
	cloudy : ['few clouds', 'scattered clouds', 'broken clouds', 'overcast clouds'],
	reduced : ['mist', 'fog'],
	rainy: ['light rain', 'moderate rain', 'heavy rain', 'showers'],
	stormy: ['thunderstorm'],
	snowy: ['snow'],
	wintry: ['sleet', 'hail']
}


const getWeather = (description) => { 
  for(const category in weather) {
    if(weather[category].includes(description)) {
      return category;
    }
  }
}

const getImage = (func, description) => {
  const weather = func(description)
  let imgSource;
  switch(weather) {
    case 'clear':
      imgSource = 'image-weather/sunny-removebg-preview.png';
      break;
    case 'cloudy':
      imgSource = 'image-weather/cloudy-removebg-preview.png';
      break;
    case 'reduced':
      imgSource = 'image-weather/mist-removebg-preview.png';
      break;
    case 'snowy':
      imgSource = 'image-weather/snowy-removebg-preview.png';
      break;
    case 'stormy':
      imgSource = 'image-weather/stormy-removebg-preview.png';
      break;
    case 'rainy':
      imgSource = 'image-weather/rainy-removebg-preview.png';
      break;
    case 'wintry':
      imgSource = 'image-weather/wintry-removebg-preview.png';
      break;
  }
  return imgSource;
}

const showData = (data) => {
  const { temp, description, humidity, windspeed } = data;
  temperature.innerText = `${temp}°C`;
  tempDescription.innerText = description;
  humid.innerText = `${humidity}%`;
  windSpeed.innerText = `${windspeed} m/s`;
  weatherImage.src = getImage(getWeather, description)
};

const getForecast = (city) => {
  const apiUrlWithParams = `${apiUrl}?q=${city}&appid=${apiKey}`;
  fetch(apiUrlWithParams)
    .then((response) => {
      if (!response.ok) {
        throw new Error('No forecast available for the searched location');
      }
      return response.json();
    })
    .then((data) => {
      const weatherData = {
        temp: (data.main.temp - 273.15).toFixed(2),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windspeed: data.wind.speed,
      };
      showData(weatherData);
    })
    .catch((err) => {
      placeInput.setCustomValidity(err.message);
      placeInput.reportValidity();

      setTimeout(() => {
        placeInput.setCustomValidity('');
        placeInput.reportValidity();
      }, 2000);
    });
};

placeInput.addEventListener('keydown', (event) => {
    if(event.key === 'Enter') {
        getForecast(placeInput.value)
    }
})

searchBtn.addEventListener('click', () => {
  const city = placeInput.value;
  getForecast(city);
});

// Trie Node
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isWord = false;
  }
}

// Trie
class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  // Insert a word into the trie
  insert(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
    }
    node.isWord = true;
  }

  // Get all words with a given prefix
  getWordsWithPrefix(prefix) {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children.has(char)) {
        return []; // Prefix not found
      }
      node = node.children.get(char);
    }
    return this._findAllWords(node, prefix);
  }

  // Find all words under a node
  _findAllWords(node, prefix) {
    let words = [];
    if (node.isWord) {
      words.push(prefix);
    }
    for (const [char, child] of node.children) {
      const childWords = this._findAllWords(child, prefix + char);
      words.push(...childWords);
    }
    return words;
  }
}

// Nominatim search request
async function searchNominatim(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.map(place => place.display_name);
}

// Example usage
const trie = new Trie();
const predictionsContainer = document.querySelector('[data-predict-place]');

placeInput.addEventListener("input", async () => {
  if(placeInput.value !== '' && predictionsContainer.querySelectorAll('p').length !== 0) {
    predictionsContainer.style.display = 'block'
  } else {
    predictionsContainer.style.display = 'none'
    temperature.innerText = "0°C";
    tempDescription.innerText = "TBD";
    windSpeed.innerText = "TBD";
    humid.innerText = "TBD";
    weatherImage.src = "image-removebg-preview (21).png";
  }


  const prefix = placeInput.value.trim().toLowerCase();
  const predictions = trie.getWordsWithPrefix(prefix);

  // If no predictions in trie, perform Nominatim search
  if (predictions.length === 0) {
    const nominatimResults = await searchNominatim(prefix);
    predictions.push(...nominatimResults);
  }

  // Update the predictions container
  predictionsContainer.innerHTML = "";
  predictions.forEach(prediction => {
    const predictionItem = document.createElement("p");
    predictionItem.textContent = prediction;
    predictionItem.style.cursor = 'pointer'
    predictionItem.addEventListener('click', () => {
        placeInput.value = prediction;
        predictionsContainer.style.display = 'none'
    })
    predictionItem.addEventListener('mouseover', () => {
      predictionItem.style.fontWeight = 'bold';
    });
  
    predictionItem.addEventListener('mouseout', () => {
      predictionItem.style.fontWeight = 'normal';
    });
    predictionsContainer.appendChild(predictionItem);
  });
});
