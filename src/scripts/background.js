import ext from "./utils/ext";
import storage from "./utils/storage";

ext.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.action === "perform-save") {
      console.log("Extension Type: ", "/* @echo extension */");
      console.log("PERFORM AJAX", request.data);

      sendResponse({ action: "saved" });
    }
  }
);


setInterval(function() {
	console.log("running cycle");
 	refreshData();
}, 5000);

var price,
	soundThreshold,
	result;
var refreshData = () => {
	
	storage.get('price', function(resp) {
		if (resp.price) {
			price = resp.price;	
		}
		else {
			price = {
				bitfinex: 0,
				binance: 0
			}
		}
	});

	storage.get('percentage', function(resp) {
		if (resp.percentage) {
			soundThreshold = resp.percentage;
		}
	});

	fetch("https://api.binance.com/api/v3/ticker/price?symbol=IOTABTC").then(function(response) {
		response.json().then(function(data) {
		  if (price.binance !== parseFloat(data.price)) {
		      price.binance = parseFloat(data.price);
		      saveResult();
		  }
		});
	});

	fetch("https://api.bitfinex.com/v2/ticker/tIOTBTC").then(function(response) {
		response.json().then(function(data) {
		  if (price.bitfinex !== data[2]) {
		      price.bitfinex = data[2];
		      saveResult();
		  }
		});
	});
}

var saveResult = () => {
	if (result !== (price.bitfinex - price.binance) / price.bitfinex * 100);
	storage.set({ price: price }, function() {
      console.log("prices updated");
    });
	var arbitrage = (price.bitfinex - price.binance) / price.bitfinex * 100;
	storage.set({ arbitrage: arbitrage }, function() {
      console.log("arbitrage updated");
    });
    arbitrage = (Math.round(Math.abs(arbitrage.toFixed(5))*10))/10;
    chrome.browserAction.setBadgeText({text: arbitrage+"%"});


    storage.get('audio', function(resp) {
    	console.log("theshold is " + soundThreshold);
    	if (resp.audio && soundThreshold <= arbitrage) {
			var audio = new Audio(resp.audio.source);
			audio.play();	
    	}
	});
}