
const API_BASE = "https://vakverse-backend.onrender.com";

async function fetchData() {
  try {
    const res = await fetch(`${API_BASE}/data`);
    const data = await res.json();

    document.getElementById("temp").innerText = data.temp + " °C";
    document.getElementById("hum").innerText = data.hum + " %";
    document.getElementById("mq2").innerText = data.mq2;
    document.getElementById("mq6").innerText = data.mq6;
    document.getElementById("flame").innerText =
      data.flame == 0 ? "🔥 Detected ⚠️" : "✅ Safe";

    const flameCard = document.getElementById("flameCard");
    if (data.flame == 0) {
      flameCard.style.boxShadow = "0 0 25px rgba(255, 77, 77, 0.8)";
      document.getElementById("flame").classList.add("alert");
    } else {
      flameCard.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)";
      document.getElementById("flame").classList.remove("alert");
    }
  } catch (err) {
    console.error("Failed to fetch data:", err);
  }
}

async function openDoor() {
  try {
    const res = await fetch(`${API_BASE}/open-door`);
    const msg = await res.json();
    alert(msg.status || "Door command sent!");
  } catch (err) {
    alert("Failed to send door command.");
  }
}

setInterval(fetchData, 1000); // auto-refresh every second
window.onload = fetchData;