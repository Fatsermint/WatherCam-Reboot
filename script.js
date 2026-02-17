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



function LoadData(data, stationId, marker) {
    if (!data) return
    fetchJson("https://tie.digitraffic.fi/api/weathercam/v1/stations/" + stationId).then(stationData => {
        const presetData = stationData.properties.presets[0]
        console.log(presetData)
        document.querySelector("#weathercamimage").src = `https://weathercam.digitraffic.fi/${presetData.id}.jpg`
        document.querySelector("#leftNext").style.display = "block"
        document.querySelector("#RightNext").style.display = "block"

        dataP.innerHTML = `<strong>Location:</strong> ${stationData.properties.names.fi}, ${stationData.properties.province} <br> 
        <strong>Image taken: </strong> ${stationData.properties.dataUpdatedTime.substring(11, 19)}
        
        `
        const latlng = [stationData.geometry.coordinates[1], stationData.geometry.coordinates[0]]
        marker.bindPopup(`Coordinates: ${stationData.geometry.coordinates[0]}, ${stationData.geometry.coordinates[1]}`)
        marker.setLatLng(latlng)
        map.panTo(latlng)

    })
}

