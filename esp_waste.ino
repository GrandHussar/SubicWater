#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>

SoftwareSerial arduinoSerial(D7, D6); // RX, TX

const char* ssid = "Akolangto";
const char* password = "berja123";
const char* serverURL = "http://172.20.10.2:5000/api/data";

void setup() {
  Serial.begin(115200);
  arduinoSerial.begin(9600);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected to Wi-Fi");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    // Send request to Arduino
    StaticJsonDocument<128> request;
    request["type"] = "request";
    serializeJson(request, arduinoSerial);
    arduinoSerial.println();  // Ensure newline to end message

    Serial.println("Request sent to Arduino.");

    // Wait for response
    String response = "";
    unsigned long start = millis();
    while (arduinoSerial.available() == 0 && millis() - start < 2000) {
      delay(10);  // wait up to 2 seconds
    }

    if (arduinoSerial.available()) {
      response = arduinoSerial.readStringUntil('\n');
      Serial.print("Received from Arduino: ");
      Serial.println(response);
    } else {
      Serial.println("No response from Arduino.");
      return;
    }

    // Try to parse and forward
    StaticJsonDocument<512> doc;
    DeserializationError error = deserializeJson(doc, response);
    if (error) {
      Serial.print("JSON Parse Error: ");
      Serial.println(error.c_str());
      return;
    }

    WiFiClient client;
    HTTPClient http;
    http.begin(client, serverURL);
    http.addHeader("Content-Type", "application/json");

    String jsonOut;
    serializeJson(doc, jsonOut);
    int code = http.POST(jsonOut);
    http.end();

    Serial.print("Sent to server: "); Serial.println(jsonOut);
    Serial.print("HTTP Code: "); Serial.println(code);
  }

  delay(5000);
}