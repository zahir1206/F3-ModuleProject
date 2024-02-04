var getAllInfo=document.getElementById("getInfo");
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        getAllInfo.innerHTML="Geolocation is not supported"
    }
}
function showPosition(position){
    getAllInfo.innerHTML="Lat:"  + position.coords.latitude+
    "<br><br>Long:"+  position.coords.longitude;
}

`$(document).ready(()=>{
    $.getJSON("https://api.ipify.org?format=json",
    function (data) {
        $("#ip-address").html(data.ip);
    })
})`;



function aboutInfo() {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.getElementById('timezone').innerHTML+= timeZone;

    const dateTime = new Date();
    document.getElementById('date').innerHTML+= dateTime.toLocaleString();
    let pincodeInput="500032";
    fetch(`https://api.postalpincode.in/pincode/${pincodeInput}`)
    .then(pincodeResponse => pincodeResponse.json())
    .then(pincodeData => {
        const postOffices = pincodeData[0].PostOffice;
        const postOfficeList = postOffices.map(office => `${office.Name}, ${office.BranchType}`);
        document.getElementById('pincode').innerText += pincodeInput;
        document.getElementById('post-offices').innerText = postOfficeList.join('\n');
    })
    .catch(error => console.error('Error fetching pincode info:', error));
}


function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 15
    });

    const input = document.getElementById('pac-input');
    const autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.bindTo('bounds', map);

    const infowindow = new google.maps.InfoWindow();
    const marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function () {
        infowindow.close();
        marker.setVisible(false);

        const place = autocomplete.getPlace();

        if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        let address = '';

        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker);
    });
}
