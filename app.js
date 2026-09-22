const ws = new WebSocket(
  "wss://api.derivws.com/trading/v1/options/ws/public"
);

const symbolSelector = document.getElementById("symbol");
const priceElement = document.getElementById("price");

const prices = [];
const times = [];
const maxPoints = 30;

const ctx = document.getElementById("priceChart").getContext("2d");

const priceChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: times,
    datasets: [{
      label: "Live Price",
      data: prices,
      borderWidth: 2,
      fill: false,
      tension: 0.2
    }]
  },
  options: {
    responsive: true,
    animation: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Time"
        }
      },
      y: {
        title: {
          display: true,
          text: "Price"
        }
      }
    }
  }
});

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

  if (data.tick) {
    const price = data.tick.quote;

    priceElement.textContent = price;

    prices.push(price);
    times.push(new Date().toLocaleTimeString());

    if (prices.length > maxPoints) {
      prices.shift();
      times.shift();
    }

    priceChart.update();
  }
};

symbolSelector.addEventListener("change", () => {
  prices.length = 0;
  times.length = 0;

  priceChart.update();

  priceElement.textContent = "Loading price...";

  subscribeToSymbol(symbolSelector.value);
});

ws.onerror = (error) => {
  console.error("Deriv connection error:", error);
};

ws.onclose = () => {
  console.log("Deriv connection closed");
};
