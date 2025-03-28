from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Replace with your actual API key if required (e.g., CoinMarketCap)
API_URL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"

def fetch_crypto_prices():
    try:
        response = requests.get(API_URL)
        data = response.json()
        return {
            "bitcoin": data.get("bitcoin", {}).get("usd", 0),
            "ethereum": data.get("ethereum", {}).get("usd", 0)
        }
    except Exception as e:
        return {"error": str(e)}

@app.route("/get_prices", methods=["GET"])
def get_prices():
    prices = fetch_crypto_prices()
    return jsonify(prices)

@app.route("/chatbot", methods=["POST"])
def chatbot():
    user_message = request.json.get("message", "").lower()
    prices = fetch_crypto_prices()
    response = "I didn't understand that."
    
    if "total" in user_message:
        total_value = (0.5 * prices["bitcoin"]) + (2 * prices["ethereum"])
        response = f"Your total portfolio value is ${total_value:.2f}."
    elif "bitcoin" in user_message:
        response = f"Bitcoin's current price is ${prices['bitcoin']}."
    elif "ethereum" in user_message:
        response = f"Ethereum's current price is ${prices['ethereum']}."
    
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
