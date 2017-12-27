import ext from "./utils/ext";
import storage from "./utils/storage";

var colorSelectors = document.querySelectorAll(".js-radio");

var audioSelectors = document.querySelectorAll(".audio-radio");

var percentageSelector = document.querySelector(".percentage");

var coinSelector = document.querySelector(".coin-selector");

var setColor = (color) => {
  document.body.style.backgroundColor = color;
};

storage.get('color', function(resp) {
  var color = resp.color;
  var option;
  if(color) {
    option = document.querySelector(`.js-radio.${color}`);
    setColor(color);
  } else {
    option = colorSelectors[0];
  }

  option.setAttribute("checked", "checked");
});

storage.get('audio', function(resp) {
  var audio = resp.audio;
  console.log(audio);
  var option;
  if(audio) {
    option = document.querySelector(`.audio-radio.${audio.value}`);
  // } else {
  //   option = audioSelectors[0];
  }
  if (option) {
    option.setAttribute("checked", "checked");
  }
  
});

storage.get('percentage', function(resp) {
    if (resp.percentage) {
      percentageSelector.value = resp.percentage;
    }
});

storage.get('selectedCoin', function(resp) {
    if (resp.selectedCoin) {
      coinSelector.value = resp.selectedCoin.value;
    }
});

colorSelectors.forEach(function(el) {
  el.addEventListener("click", function(e) {
    var value = this.value;
    storage.set({ color: value }, function() {
      setColor(value);
    });
  })
});

audioSelectors.forEach(function(el) {
  el.addEventListener("click", function(e) {
    var source = this.source;
    var audio = {
      source: this.getAttribute("source"),
      value: this.value
    }
    storage.set({ audio: audio }, function() {
      console.log("audio data set");
    });
  })
})

percentageSelector.addEventListener("blur", function(e) {
  storage.set({ percentage: this.value }, function() {
    console.log("percentage updated");
  });
});

coinSelector.addEventListener("change", function(e) {
  var selectedCoin = {
    bitfinex: this.selectedOptions[0].getAttribute("bitfinex"),
    binance: this.selectedOptions[0].getAttribute("binance"),
    value: this.value
  }
  console.log(selectedCoin);
  storage.set({ selectedCoin: selectedCoin }, function() {
    console.log("selectedCoin updated");
  });
});