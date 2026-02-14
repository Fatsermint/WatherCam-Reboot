var map = L.map('map').setView([65, 25], 5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let number = 0
const dataP = document.querySelector("#dataP")
const next = document.querySelector("#Next")
const marker = L.marker([0,0]).addTo(map)
fetchJson(`https://tie.digitraffic.fi/api/weathercam/v1/stations`)
    .then(data => {

        next.addEventListener("click", () => LoadData(data))

    })

async function fetchJson(url) {
    const response = await fetch(url)
    return await response.json()
}


function LoadData(data) {
    if (!data) return
    const presets = data.features.map(station => station.properties.presets.map(p => ({ ...p, stationId: station.properties.id }))).flat()
    const random = presets[Math.floor(Math.random() * presets.length)]
    console.log(random)
    document.querySelector("#weathercamimage").src = `https://weathercam.digitraffic.fi/${random.id}.jpg`
    fetchJson("https://tie.digitraffic.fi/api/weathercam/v1/stations/" + random.stationId).then(stationData => {
        console.log(stationData)
        const presetData = stationData.properties.presets.find(p => p.id == random.id)
        console.log(presetData)
        dataP.innerHTML = `Location: ${stationData.properties.names.fi}, ${stationData.properties.province}`
        const latlng = [stationData.geometry.coordinates[1], stationData.geometry.coordinates[0]]
        marker.setLatLng(latlng)
        map.panTo(latlng)

    })
}

