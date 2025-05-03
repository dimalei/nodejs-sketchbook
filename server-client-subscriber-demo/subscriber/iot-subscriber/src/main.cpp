#include <Adafruit_NeoPixel.h>
#include <Arduino.h>
#include <ArduinoJson.h>
#include <SocketIOclient.h>
#include <WiFi.h>

#include "secrets.h"

// 4 external RGB LEDs on pin 1
// 1 internal RGB LED on pin 8
#define USE_SERIAL Serial
#define LED_PIN 1
#define LED_COUNT 4
Adafruit_NeoPixel pixel(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

char bulbID[20] = "ESP32_";
uint8_t macAddress[6];

#define HOST "192.168.1.59"
const uint16_t PORT = 8080;
SocketIOclient socketIO;
unsigned long lastReconnectAttempt = 0;
const unsigned long reconnectInterval = 5000;

void socketIOEvent(socketIOmessageType_t type, uint8_t *payload,
                   size_t length) {
  USE_SERIAL.println("event");
  switch (type) {
    case sIOtype_DISCONNECT:
      USE_SERIAL.printf("[IOc] Disconnected!\n");
      break;
    case sIOtype_CONNECT:
      USE_SERIAL.printf("[IOc] Connected to url: %s\n", payload);

      // join default namespace (no auto join in Socket.IO V3)
      socketIO.send(sIOtype_CONNECT, "/");
      break;
    case sIOtype_EVENT: {
      char *sptr = NULL;
      int id = strtol((char *)payload, &sptr, 10);
      USE_SERIAL.printf("[IOc] get event: %s id: %d\n", payload, id);
      if (id) {
        payload = (uint8_t *)sptr;
      }
      JsonDocument doc;
      DeserializationError error = deserializeJson(doc, payload, length);
      if (error) {
        USE_SERIAL.print(F("deserializeJson() failed: "));
        USE_SERIAL.println(error.c_str());
        return;
      }

      String eventName = doc[0];
      USE_SERIAL.printf("[IOc] event name: %s\n", eventName.c_str());

      // Message Includes a ID for a ACK (callback)
      if (id) {
        // create JSON message for Socket.IO (ack)
        JsonDocument docOut;
        JsonArray array = docOut.to<JsonArray>();

        // add payload (parameters) for the ack (callback function)
        array.add<JsonObject>();
        JsonObject param1;
        param1["now"] = millis();

        // JSON to String (serializion)
        String output;
        output += id;
        serializeJson(docOut, output);

        // Send event
        socketIO.send(sIOtype_ACK, output);
      }
    } break;
    case sIOtype_ACK:
      USE_SERIAL.printf("[IOc] get ack: %u\n", length);
      break;
    case sIOtype_ERROR:
      USE_SERIAL.printf("[IOc] get error: %u\n", length);
      break;
    case sIOtype_BINARY_EVENT:
      USE_SERIAL.printf("[IOc] get binary: %u\n", length);
      break;
    case sIOtype_BINARY_ACK:
      USE_SERIAL.printf("[IOc] get binary ack: %u\n", length);
      break;
  }
}

void setup() {
  USE_SERIAL.begin(115200);
  pixel.begin();
  pixel.setBrightness(50);
  pixel.setPixelColor(1, pixel.Color(0, 0, 100));
  pixel.show();

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    if (pixel.getBrightness() == 0) {
      pixel.setBrightness(50);
    } else {
      pixel.setBrightness(0);
    }
    pixel.show();
  }
  USE_SERIAL.println("WiFi Connected");
  USE_SERIAL.println(WiFi.localIP().toString());

  pixel.setBrightness(50);
  pixel.clear();
  pixel.show();

  esp_read_mac(macAddress, ESP_MAC_WIFI_STA);
  for (int i = 2; i < 6; i++) {  // Last 4 bytes
    char hexByte[3];             // 2 hex digits + null terminator
    sprintf(hexByte, "%02X", macAddress[i]);
    strncat(bulbID, hexByte, sizeof(bulbID) - strlen(bulbID) - 1);
  }

  USE_SERIAL.println(bulbID);

  String url = "/socket.io/?EIO=4&type=bulb&bulbID=";
  url += bulbID;
  url += "&isOn=false";

  socketIO.begin(HOST, PORT, url);
  socketIO.onEvent(socketIOEvent);
}

void loop() {
  socketIO.loop();

  if (!socketIO.isConnected()) {
    unsigned long now = millis();
    if (now - lastReconnectAttempt > reconnectInterval) {
      USE_SERIAL.println("Trying to reconnect to Socket.IO server...");
      String url = "/socket.io/?EIO=4&type=bulb&bulbID=";
      url += bulbID;
      url += "&isOn=false";
      socketIO.begin(HOST, PORT, url);
      lastReconnectAttempt = now;
    }
  }
}