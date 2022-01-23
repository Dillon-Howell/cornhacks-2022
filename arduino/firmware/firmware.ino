#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#include <vector>

const char* apSsid     = "DN";
const char* apPassword = "billrocks123";
const char* clientSsid     = "DNFirstPlaceCornhacks2022";
const char* clientPassword = "billrocks123";
const char* serverURL = "http://192.168.1.6:8080/";
const int espID = 1;

WiFiEventHandler probeRequestPrintHandler;

String macToString(const unsigned char* mac) {
  char buf[20];
  snprintf(buf, sizeof(buf), "%02x:%02x:%02x:%02x:%02x:%02x",
           mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
  return String(buf);
}

std::vector<WiFiEventSoftAPModeProbeRequestReceived> myList;

void onProbeRequestPrint(const WiFiEventSoftAPModeProbeRequestReceived& evt) {
  myList.push_back(evt);
}

void setup() {
  Serial.begin(115200);
  Serial.println("Up and running!");

  // Don't save WiFi configuration in flash - optional
  WiFi.persistent(false);

  WiFi.mode(WIFI_AP_STA);
  // softAP is used to help pickup more addresses
  WiFi.softAP(apSsid, apPassword);
  WiFi.begin(clientSsid, clientPassword);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(100);
  }
  Serial.println("");
  probeRequestPrintHandler = WiFi.onSoftAPModeProbeRequestReceived(&onProbeRequestPrint);
}

void loop() {
  delay(3000);

  String json = "";
  StaticJsonDocument<1024> jsonBuffer;
  jsonBuffer["espID"] = espID;
  JsonArray probes = jsonBuffer.createNestedArray("probes");

  for(WiFiEventSoftAPModeProbeRequestReceived w : myList) {
    StaticJsonDocument<1024> probe;
    String macAddress = macToString(w.mac);

    if (!macAddress.isEmpty() && macAddress != NULL && w.rssi != NULL) {
      probe["address"] = macAddress;
      probe["rssi"] = w.rssi;
      probes.add(probe);
    }
  }
  myList.clear();
  serializeJsonPretty(jsonBuffer, json);
  Serial.println("json:" + json);

  WiFiClient client;
  HTTPClient http;
  http.begin(client, serverURL);
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.POST(json);

  // httpCode will be negative on error
  if (httpCode < 0) {
    Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
  }
  http.end();
}
