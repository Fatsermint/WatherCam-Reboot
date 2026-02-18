var map = L.map('map').setView([65, 25], 5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let number = 0
const dataP = document.querySelector("#dataP")
const next = document.querySelector("#Next")
fetchJson(`https://tie.digitraffic.fi/api/weathercam/v1/stations`)
    .then(data => {
        console.log(data)
        var markers = L.markerClusterGroup();
        markers.addLayers(L.geoJSON(data));
        map.addLayer(markers);
        markers.on('click', function (a) {

            console.log(a.layer.feature.id)

            fetchJson(`https://tie.digitraffic.fi/api/weathercam/v1/stations/${a.layer.feature.id}`)
                .then(data => {
                    console.log(data, a.layer.feature)
                    LoadData(data, a.layer.feature.id, a.layer)
                })
        })
    })

async function fetchJson(url) {
    const response = await fetch(url)
    return await response.json()
}

const leftNext = document.querySelector("#leftNext")
const RightNext = document.querySelector("#RightNext")

function LoadData(data, stationId, marker) {
    if (!data) return
    fetchJson("https://tie.digitraffic.fi/api/weathercam/v1/stations/" + stationId).then(stationData => {
        let currentPresetNumber = 0
        
        const presets = stationData.properties.presets
        let currentPreset = stationData.properties.presets[0]
        const stationPresetsLenght = stationData.properties.presets.length
        document.querySelector("#weathercamimage").src = `https://weathercam.digitraffic.fi/${currentPreset.id}.jpg`
        leftNext.style.display = "block"
        leftNext.addEventListener("click", function () {
            currentPresetNumber--
            if (currentPresetNumber < 0) {currentPresetNumber = stationPresetsLenght - 1}
            currentPreset = stationData.properties.presets[currentPresetNumber]
            document.querySelector("#weathercamimage").src = `https://weathercam.digitraffic.fi/${currentPreset.id}.jpg`
        })

        RightNext.style.display = "block"
        RightNext.addEventListener("click", function () {
            currentPresetNumber++
            if (currentPresetNumber === stationPresetsLenght) {currentPresetNumber = 0}
            currentPreset = stationData.properties.presets[currentPresetNumber]
            document.querySelector("#weathercamimage").src = `https://weathercam.digitraffic.fi/${currentPreset.id}.jpg`
        })

        dataP.innerHTML = `<strong>Location:</strong> ${stationData.properties.names.fi}, ${stationData.properties.province} <br> 
        <strong>Image taken: </strong> ${stationData.properties.dataUpdatedTime.substring(11, 19)}
        
        `
        const latlng = [stationData.geometry.coordinates[1], stationData.geometry.coordinates[0]]
        marker.bindPopup(`Coordinates: ${stationData.geometry.coordinates[0]}, ${stationData.geometry.coordinates[1]}`)
        marker.setLatLng(latlng)
        map.panTo(latlng)

    })
}

