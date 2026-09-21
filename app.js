const ws = new WebSocket(
  "wss://api.derivws.com/trading/v1/options/ws/public"
);

ws.onopen = () => {
  console.log("Connected to Deriv API");

  ws.send(JSON.stringify({
    ticks: "R_100",
    subscribe: 1
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  console.log("Deriv:", data);

  if (data.tick) {
    const price = document.getElementById("price");

    if (price) {
      price.textContent = data.tick.quote;
    }
  }
};

ws.onerror = (error) => {
  console.error("Deriv connection error:", error);
};

ws.onclose = () => {
  console.log("Deriv connection closed");
};

ws.onerror = () => {
  console.log("Deriv connection error");
};
