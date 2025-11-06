const API_BASE = "https://vakverse-backend.onrender.com";

// Basic XOR decoder (used to hide password)
function decodePassword(encoded, key) {
  const decoded = atob(encoded);
  return decoded
    .split("")
    .map((c, i) =>
      String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    )
    .join("");
}

// 🔐 Obfuscated password: "chilli11221" encoded & XOR’d with key "olp"
const ENCODED_PASS = "HwoTDwsVHRkLDgQfAhML"; // hidden (you can regenerate this)
const KEY = "k3y";
const CORRECT_PASSWORD = decodePassword(ENCODED_PASS, KEY);

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

function openPasswordPopup() {
  const popup = window.open(
    "",
    "PasswordWindow",
    "width=400,height=300,left=500,top=200"
  );

  popup.document.write(`
    <html>
    <head>
      <title>Door Authentication</title>
      <style>
        body {
          font-family: sans-serif;
          background: #f9f9f9;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .box {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 0 15px rgba(0,0,0,0.2);
          text-align: center;
        }
        input {
          padding: 10px;
          width: 80%;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 8px;
        }
        button {
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        button:hover {
          background: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="box">
        <h2>Enter Password to Open Door</h2>
        <input type="password" id="doorPass" placeholder="Enter password" /><br/>
        <button id="submitBtn">Submit</button>
      </div>
    </body>
    </html>
  `);

  popup.document.close();

  popup.onload = () => {
    const submitBtn = popup.document.getElementById("submitBtn");
    submitBtn.onclick = async () => {
      const password = popup.document.getElementById("doorPass").value.trim();

      if (!password) {
        alert("Please enter the password.");
        return;
      }

      if (password === CORRECT_PASSWORD) {
        alert("✅ Access granted! Opening door...");
        popup.close();
        await openDoor();
      } else {
        alert("❌ Incorrect password. Access denied!");
      }
    };
  };
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

setInterval(fetchData, 1000);
window.onload = fetchData;