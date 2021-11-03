const APIKey = 'YOURAPIKEY'
const wheaterURL = `http://api.weatherapi.com/v1/current.json?key=${APIKey}&lang=pt`


async function getWheater(latitude, longitude) {
  const response = await fetch(wheaterURL.concat(`&q=${latitude},${longitude}`))
  const data = await response.json()
  console.log(data)
  return data
}

function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
  
}

async function getLatitudeAndLongitude() {
  const position = await getPosition()
  const { latitude, longitude } = position.coords
  return { latitude, longitude }
}

function championDecider(temperature) {
  if (temperature < 20) {
    return 'Lissandra'
  } else if (temperature >= 20 && temperature < 30) {
    return 'Irelia'
  } else {
    return 'Brand'
  }
}

async function createChampionSplashArtImg(champion) {
  const img = document.createElement('img');
  img.src = await `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion}_0.jpg`
  document.body.appendChild(img)
  img.style.width = '100%';
  img.style.maxHeight = '100vh';
  img.style.opacity = '80%';
  img.style.position = 'absolute';
  img.style.zIndex = '-1';
}

function createDiv(temperature, champion, condition, iconUrl) {
  const div = document.getElementsByClassName('container')[0];
  div.innerHTML = `<div><img src="https://${iconUrl}"><h1>${temperature}°C</h1></div><h3>${condition}</h3>
  <h2>Champion que representa a temperatura: <strong>${champion}</strong></h2>`

  document.body.appendChild(div)
}

async function initialize() {
  const { latitude, longitude } = await getLatitudeAndLongitude()
  const data = await getWheater(latitude, longitude)
  const condition = data.current.condition.text
  const currentTemperature = data.current.temp_c
  const iconUrl = data.current.condition.icon.substr(2)
  const champion = championDecider(currentTemperature)

  createChampionSplashArtImg(champion)
  createDiv(currentTemperature, champion, condition, iconUrl)
}

initialize()

