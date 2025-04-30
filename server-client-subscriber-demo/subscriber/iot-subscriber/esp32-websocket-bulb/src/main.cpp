#include <Adafruit_NeoPixel.h>
#include <Arduino.h>
#include <SocketIoClient.h>
#include <WiFi.h>

#include "secrets.h"

// 4 external RGB LEDs on pin 1
// 1 internal RGB LED on pin 8
#define LED_PIN 1
#define LED_COUNT 4
Adafruit_NeoPixel pixel(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

#define HOST "192.168.1.59:8080"

void event(const char *payload, size_t length) {
  Serial.printf("got message: %s\n", payload);
}

void setup() {
  Serial.begin(115200);
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
  Serial.println("WiFi Connected");

  pixel.setBrightness(50);
  pixel.clear();
  pixel.show();

  webSocket.on("event", event);

  webSocket.begin(HOST);
}

void loop() { webSocket.loop(); }
