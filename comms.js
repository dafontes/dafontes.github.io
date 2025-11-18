// Configurations Sessions
const configs = {
  power: {
    localStorageKey: "power",
    querySelector: ".power",
    mapper: Number,
  },
  btt: {
    localStorageKey: "btt",
    querySelector: ".btt",
    mapper: Number,
  },
};
const dataKeys = ["power", "btt"];
const data = dataKeys.reduce((acc, key) => {
  acc[key] = loadFromLocalStorage(configs[key].localStorageKey);
  setUIData(acc[key], configs[key].querySelector);
  return acc;
}, {});

function loadFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

saveToLocalStorage("Labyel", "teste");

function getUIData(querySelector, mapper) {
  return Array.from(document.querySelectorAll(querySelector)).map((el) =>
    mapper(el.value)
  );
}

function setUIData(data, querySelector) {
  document
    .querySelectorAll(querySelector)
    .forEach((el, i) => (el.value = data[i] || ""));
}

//Clicks on the UI
document.getElementById("touch_lock").onclick = function () {
  if (this.status == "0") {
    this.src = "assets/unlock.png";
    this.status = "1";
  } else {
    this.src = "assets/lock.png";
    this.status = "0";
  }
};

document.getElementById("power_range").oninput = function () {
  document.getElementById("power_val").innerHTML = this.value;
  var out;
  switch (this.value) {
    case "0":
      out = "Turned Off [0 W]";
      break;
    case "100":
      out = "Full Brightness [3 W]";
      break;
    default:
      out = "Expected Power Draw " + (3 * this.value) / 100 + " W";
  }
  document.getElementById("power_des").innerHTML = out;
};
document.getElementById("power_range").onchange = function () {
  UpdateSlider(this.value);
};

document.getElementById("servo_range").oninput = function () {
  document.getElementById("servo_val").innerHTML = this.value;
  var out;
  switch (this.value) {
    case "0":
      out = "Full-Closed Lamp";
      break;
    case "180":
      out = "Fully Oppened Lamp";
      break;
    default:
      out = "Quarto Crescente, etc";
  }
  document.getElementById("servo_des").innerHTML = out;
};

/*document.getElementById("touch_btn").onclick = function () {
  document.getElementById("touch_val").innerHTML = "Click";
  setTimeout(() => {
    document.getElementById("touch_val").innerHTML = "";
  }, "500");
};*/

document.getElementById("led_select").onchange = function () {
  document.getElementById("led_val").innerHTML =
    this.options[this.selectedIndex].text;
};

document.getElementById("btt_val").innerHTML = "--";
document.getElementById("btt_des").innerHTML =
  "[5.00 V]<br />2 Hour remaning...";

document.getElementById("led_val").innerHTML = "OFF";
document.getElementById("led_des").innerHTML = "DEV MODE";

document.getElementById("power_val").innerHTML = "0";
document.getElementById("power_des").innerHTML = "Turned Off";

document.getElementById("servo_val").innerHTML = "0";
document.getElementById("servo_des").innerHTML = "NO DEV";

document.getElementById("touch_val").innerHTML = "-";
document.getElementById("touch_des").innerHTML = "NO DEV";

document.getElementById("powerDraw_val").innerHTML = "0";

document.getElementById("conn_status").innerHTML = "Disconnected";
document.getElementById("conn_status").style.color = "#bd0606ff"; //change color

document.getElementById("deviceId").innerHTML = "---";
document.getElementById("macAddr").innerHTML = "---";
document.getElementById("firmVersion").innerHTML = "---";
document.getElementById("ssid").innerHTML = "---";
document.getElementById("rssi").innerHTML = "---";
document.getElementById("ipAddr").innerHTML = "---";
document.getElementById("cpuLoad").innerHTML = "---";
document.getElementById("ram").innerHTML = "---";
document.getElementById("time").innerHTML =
  " " + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
document.getElementById("upTime").innerHTML = "---";
document.getElementById("lastSync").innerHTML = "---";
document.getElementById("sessionBrowser").innerHTML = " Active - X";
update();

function update() {
  document.getElementById("time").innerHTML =
    " " +
    new Date().toLocaleDateString() +
    " " +
    new Date().toLocaleTimeString();
  setTimeout("update()", 500); // 500 ms between updates
}
//
//
//
//
//
//
//
// global variable visible to all java functions
var xmlHttp = createXmlHttpObject();

// function to create XML object
function createXmlHttpObject() {
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
  } else {
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  return xmlHttp;
}

// function to handle button press from HTML code above
// and send a processing string back to server
// this processing string is use in the .on method
function ButtonPress0() {
  var xhttp = new XMLHttpRequest();
  var message;
  // if you want to handle an immediate reply (like status from the ESP
  // handling of the button press use this code
  // since this button status from the ESP is in the main XML code
  // we don't need this
  // remember that if you want immediate processing feedbac you must send it
  // in the ESP handling function and here
  /*
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          message = this.responseText;
          // update some HTML data
        }
      }
      */

  xhttp.open("PUT", "BUTTON_0", false);
  xhttp.send();
}

// function to handle button press from HTML code above
// and send a processing string back to server
// this processing string is use in the .on method
function ButtonPress1() {
  var xhttp = new XMLHttpRequest();
  /*
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          document.getElementById("button1").innerHTML = this.responseText;
        }
      }
      */
  xhttp.open("PUT", "BUTTON_1", false);
  xhttp.send();
}

function UpdateSlider(value) {
  var xhttp = new XMLHttpRequest();
  // this time i want immediate feedback to the fan speed
  // yea yea yea i realize i'm computing fan speed but the point
  // is how to give immediate feedback
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // update the web based on reply from  ESP
      document.getElementById("fanrpm").innerHTML = this.responseText;
    }
  };
  // this syntax is really weird the ? is a delimiter
  // first arg UPDATE_SLIDER is use in the .on method
  // server.on("/UPDATE_SLIDER", UpdateSlider);
  // then the second arg VALUE is use in the processing function
  // String t_state = server.arg("VALUE");
  // then + the controls value property
  console.log(value);
  xhttp.open("PUT", "http://" + ip + "/UPDATE_SLIDER?VALUE=" + value, true);
  xhttp.send(null);
}

// function to handle the response from the ESP
function update_ui() {
  var message;
  var barwidth;
  var currentsensor;
  var xmlResponse;
  var xmldoc;
  var dt = new Date();
  var color = "#e8e8e8";

  // get the xml stream
  if (data != null) {
    xmlResponse = xmlHttp.responseXML;

    // get host date and time
    //document.getElementById("time").innerHTML = dt.toLocaleTimeString();
    //document.getElementById("date").innerHTML = dt.toLocaleDateString();

    // A0
    xmldoc = xmlResponse.getElementsByTagName("B0"); //bits for A0
    message = xmldoc[0].firstChild.nodeValue;
    document.getElementById("btt_des").innerHTML =
      "[" + message + " V]<br />" + 2 + " Hour remaning...";
    //document.getElementById("b0").style.width = barwidth + "%";

    // if you want to use global color set above in <style> section
    // other wise uncomment and let the value dictate the color
    //document.getElementById("b0").style.backgroundColor=color;
    //document.getElementById("b0").style.borderRadius="5px";

    xmldoc = xmlResponse.getElementsByTagName("V0"); //volts for A0
    message = xmldoc[0].firstChild.nodeValue;
    //document.getElementById("v0").innerHTML = message;
    //document.getElementById("v0").style.width = barwidth + "%";
    // you can set color dynamically, maybe blue below a value, red above
    //document.getElementById("v0").style.backgroundColor = color;
    //document.getElementById("v0").style.borderRadius="5px";

    // A1
    xmldoc = xmlResponse.getElementsByTagName("B1");
    message = xmldoc[0].firstChild.nodeValue;
    if (message > 2048) {
      color = "#aa0000";
    } else {
      color = "#0000aa";
    }
    //document.getElementById("b1").innerHTML = message;
    width = message / 40.95;
    //document.getElementById("b1").style.width = width + "%";
    //document.getElementById("b1").style.backgroundColor = color;
    //document.getElementById("b1").style.borderRadius="5px";

    xmldoc = xmlResponse.getElementsByTagName("V1");
    message = xmldoc[0].firstChild.nodeValue;
    //document.getElementById("v1").innerHTML = message;
    //document.getElementById("v1").style.width = width + "%";
    //document.getElementById("v1").style.backgroundColor = color;
    //document.getElementById("v1").style.borderRadius="5px";

    xmldoc = xmlResponse.getElementsByTagName("LED");
    message = xmldoc[0].firstChild.nodeValue;

    xmldoc = xmlResponse.getElementsByTagName("SWITCH");
    message = xmldoc[0].firstChild.nodeValue;
    document.getElementById("switch").style.backgroundColor =
      "rgb(200,200,200)";
    // update the text in the table
    if (message == 0) {
      document.getElementById("switch").innerHTML = "Switch is OFF";
      document.getElementById("btn1").innerHTML = "Turn ON";
      document.getElementById("switch").style.color = "#0000AA";
    } else {
      document.getElementById("switch").innerHTML = "Switch is ON";
      document.getElementById("btn1").innerHTML = "Turn OFF";
      document.getElementById("switch").style.color = "#00AA00";
    }
  }
}

//Function to get data
function process() {
  xmlHttp.setTimeout = 5000; // 5 seconds timeout
  var ip = document.getElementById("ipAddr").value;
  xmlHttp.open("PUT", "http://" + ip + "/xml", true);
  console.log(xmlHttp.readyState);
  xmlHttp.send(null);
}

xmlHttp.onload = function () {
  console.log("load");
};
xmlHttp.onerror = function (e) {
  console.log("error: " + e);
};
xmlHttp.ontimeout = function () {
  console.log("timeout");
};

// general processing code for the web page to ask for an XML steam
// this is actually why you need to keep sending data to the page to
// force this call with stuff like this
// server.on("/xml", SendXML);
// otherwise the page will not request XML from the ESP, and updates will not happen
/*var statusUc = 0;
function process() {
  xmlHttp.timeout = 5000; // 10 seconds
  var ip = document.getElementById("ipAddr").value;
  console.log("http://" + ip + "/xml");
  xmlHttp.open("PUT", "http://" + ip + "/xml", true);
  fetch("http://" + ip + "/xml", {
    method: "PUT",
  })
    .then((res) => {
      console.log(res);
      if (res.ok) xmlHttp.send(null);
      else {
        console.log("error!");
        if (statusUc) {
          document.getElementById("lastSync").innerHTML =
            "Over 10 s (Disconnected)";
          console.log("Timeout: microcontroller is not responding.");
          document.getElementById("conn_status").innerHTML = "Disconnected";
          document.getElementById("conn_status").style.color = "#bd0606ff"; //change color
          statusUc = 0;
        }
        process();
      }
    })
    .catch((e) => {
      console.log(e);
      if (statusUc) {
        document.getElementById("lastSync").innerHTML =
          "Over 10 s (Disconnected)";
        console.log("Timeout: microcontroller is not responding.");
        document.getElementById("conn_status").innerHTML = "Disconnected";
        document.getElementById("conn_status").style.color = "#bd0606ff"; //change color
        statusUc = 0;
      }
      process();
    });
  //lastSync = 0;
  /*else {
    if (lastSync > 10000) {
    } else {
      lastSync += 100;
      document.getElementById("lastSync").innerHTML = lastSync + " ms";
    }
    document.getElementById("deviceId").innerHTML = " not received";
}
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      //console.log("Received XML:", xmlHttp.responseText);
      update_ui();

      if (!statusUc) {
        document.getElementById("conn_status").innerHTML = "Connected";
        document.getElementById("conn_status").style.color = "#c2ff58";
        statusUc = 1;
      }
      setTimeout("process()", 100);
    }
  };


}*/
