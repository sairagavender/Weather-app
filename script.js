// --- Cursor Logic ---
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// --- Weather Logic ---
let button = document.querySelector(".btn-search");
let input = document.querySelector(".ipt-box");
let tempBox = document.querySelector(".big-temp");
let locationBox = document.querySelector(".location-display");
let conditionBox = document.querySelector(".condition-text");
let iconBox = document.querySelector(".weather-icon");
let dateBox = document.querySelector(".date");
let timeBox = document.querySelector(".time");
let marqueeText = document.querySelector(".marquee-content");

// Initialize Default
const updateTime = () => {
    const now = new Date();
    dateBox.innerText = now.toLocaleDateString();
    timeBox.innerText = now.toLocaleTimeString();
}
setInterval(updateTime, 1000);
updateTime();

button.addEventListener("click", () => {
    const city = input.value.trim();
    if (city === "") {
        // Shake animation for error
        input.style.transform = "translateX(10px)";
        setTimeout(() => input.style.transform = "translateX(0)", 100);
    } else {
        getWeather(city).then(data => {
            if(data) updateDOM(data);
        });
    }
});

// Allow Enter key
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        button.click();
    }
});

async function getWeather(city){
    const apiKey="34716fcc62e24682b4463203260302";
    const url=`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            conditionBox.innerHTML = "ERR: 404 // CITY NOT FOUND";
            return null;
        }
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error(error);
        conditionBox.innerHTML = "ERR: NETWORK FAILURE";
        return null;
    }
}

function updateDOM(data){
    // Add fade animation class
    const elements = [tempBox, locationBox, conditionBox];
    

    // Update Text
    tempBox.innerHTML = (data.current.temp_c) + "°";
    conditionBox.innerHTML = data.current.condition.text;
    
    // Image Logic
    iconBox.src = "https:" + data.current.condition.icon;
    iconBox.style.display = "block";
    document.querySelector('.weather-icon-wrapper div').style.display = 'none';

    // Location Logic
    locationBox.innerHTML = data.location.name;

    // Update Marquee with live data
    const scrollText = `CURRENT CONDITION: ${data.current.condition.text.toUpperCase()} // HUMIDITY: ${data.current.humidity}% // WIND: ${data.current.wind_kph} KPH // LOCAL TIME: ${data.location.localtime} // `;
    marqueeText.innerHTML = scrollText + scrollText + scrollText;
}