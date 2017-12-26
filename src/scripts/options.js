import ext from "./utils/ext";
import storage from "./utils/storage";

var colorSelectors = document.querySelectorAll(".js-radio");

var audioSelectors = document.querySelectorAll(".audio-radio");

var percentageSelector = document.querySelector(".percentage")

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