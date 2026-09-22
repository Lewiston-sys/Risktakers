const ws = new WebSocket(
  "wss://api.derivws.com/trading/v1/options/ws/public"
);

const symbolSelector = document.getElementById("symbol");
const priceElement = document.getElementById("price");

ws.onopen = () => {
  console.log("Connected to Deriv API");

  subscribeToSymbol(symbolSelector.value);
};

function subscribeToSymbol(symbol) {
  ws.send(JSON.stringify({
    ticks: symbol,
    subscribe: 1
  }));

  console.log("Subscribed to:", symbol);
}

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  console.log("Deriv:", data);

  if (data.tick) {
    priceElement.textContent = data.tick.quote;
  }
};

symbolSelector.addEventListener("change", () => {
  const selectedSymbol = symbolSelector.value;

  priceElement.textContent = "Loading price...";

  subscribeToSymbol(selectedSymbol);
});

ws.onerror = (error) => {
  console.error("Deriv connection error:", error);
};

ws.onclose = () => {
  console.log("Deriv connection closed");
};
