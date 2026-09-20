const ws = new WebSocket(
  "wss://ws.derivws.com/websockets/v3?app_id=1089"
);

ws.onopen = () => {
  ws.send(JSON.stringify({
    ticks: "R_100",
    subscribe: 1
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.tick) {
    document.getElementById("price").textContent = data.tick.quote;
  }
};

ws.onerror = () => {
  console.log("Deriv connection error");
};
