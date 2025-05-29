function initTimeApp() {
  createClockMarkers();
  updateTime();
  setInterval(updateTime, 1000);
}

function createClockMarkers() {
  const hourMarkers = document.getElementById("hour-markers");
  const minuteMarkers = document.getElementById("minute-markers");

  // Create hour markers
  for (let i = 0; i < 12; i++) {
    const angle = i * 30 - 90;
    const x1 = 150 + 120 * Math.cos((angle * Math.PI) / 180);
    const y1 = 150 + 120 * Math.sin((angle * Math.PI) / 180);
    const x2 = 150 + 100 * Math.cos((angle * Math.PI) / 180);
    const y2 = 150 + 100 * Math.sin((angle * Math.PI) / 180);

    const marker = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    marker.setAttribute("x1", x1);
    marker.setAttribute("y1", y1);
    marker.setAttribute("x2", x2);
    marker.setAttribute("y2", y2);
    marker.setAttribute("stroke", "#374151");
    marker.setAttribute("stroke-width", "3");
    marker.setAttribute("stroke-linecap", "round");

    hourMarkers.appendChild(marker);
  }

  // Create minute markers
  for (let i = 0; i < 60; i++) {
    if (i % 5 !== 0) {
      const angle = i * 6 - 90;
      const x1 = 150 + 130 * Math.cos((angle * Math.PI) / 180);
      const y1 = 150 + 130 * Math.sin((angle * Math.PI) / 180);
      const x2 = 150 + 120 * Math.cos((angle * Math.PI) / 180);
      const y2 = 150 + 120 * Math.sin((angle * Math.PI) / 180);

      const marker = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      marker.setAttribute("x1", x1);
      marker.setAttribute("y1", y1);
      marker.setAttribute("x2", x2);
      marker.setAttribute("y2", y2);
      marker.setAttribute("stroke", "#9ca3af");
      marker.setAttribute("stroke-width", "1");
      marker.setAttribute("stroke-linecap", "round");

      minuteMarkers.appendChild(marker);
    }
  }
}

function updateTime() {
  const now = new Date();

  updateDigitalClock(now);

  updateAnalogClock(now);
}

function updateDigitalClock(date) {
  const timeString = date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const dateString = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  document.getElementById("digital-time").textContent = timeString;
  document.getElementById("digital-date").textContent = dateString;
}

function updateAnalogClock(date) {
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours() % 12;

  // Calculate angles
  const secondAngle = seconds * 6 - 90;
  const minuteAngle = minutes * 6 + seconds * 0.1 - 90;
  const hourAngle = hours * 30 + minutes * 0.5 - 90;

  // Update hands
  updateHand("second-hand", secondAngle, 90);
  updateHand("minute-hand", minuteAngle, 80);
  updateHand("hour-hand", hourAngle, 60);
}

function updateHand(handId, angle, length) {
  const hand = document.getElementById(handId);
  const x2 = 150 + length * Math.cos((angle * Math.PI) / 180);
  const y2 = 150 + length * Math.sin((angle * Math.PI) / 180);

  hand.setAttribute("x2", x2);
  hand.setAttribute("y2", y2);
}
