const cryptoList = document.getElementById("crypto-list");
const totalValue = document.getElementById("total-value");
const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");

async function updatePortfolio() {
    try {
        const response = await fetch("http://127.0.0.1:5000/get_prices");
        const prices = await response.json();
        
        const portfolio = [
            { name: "Bitcoin", symbol: "BTC", amount: 0.5, price: prices.bitcoin },
            { name: "Ethereum", symbol: "ETH", amount: 2, price: prices.ethereum }
        ];

        cryptoList.innerHTML = "";
        let total = 0;
        portfolio.forEach(crypto => {
            const value = crypto.amount * crypto.price;
            total += value;
            cryptoList.innerHTML += `<li>${crypto.name} (${crypto.symbol}): ${crypto.amount} @ $${crypto.price} = $${value.toFixed(2)}</li>`;
        });
        totalValue.textContent = `Total Value: $${total.toFixed(2)}`;
    } catch (error) {
        console.error("Error fetching crypto prices:", error);
    }
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    chatLog.innerHTML += `<li><strong>You:</strong> ${message}</li>`;
    userInput.value = "";

    const response = await fetch("http://127.0.0.1:5000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });
    const data = await response.json();
    chatLog.innerHTML += `<li><strong>Bot:</strong> ${data.response}</li>`;
}

updatePortfolio();
