#include <Arduino.h>
#include <Adafruit_NeoPixel.h>
#define LED_PIN 8
#define LED_COUNT 1
Adafruit_NeoPixel pixel(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

void setup()
{
  // put your setup code here, to run once:
  pixel.begin();
  pixel.show();
  pixel.setBrightness(50);
}

void loop()
{
  pixel.setPixelColor(0, pixel.Color(100, 240, 100));
  pixel.show();
  sleep(1);
  pixel.setPixelColor(0, pixel.Color(240, 100, 100));
  pixel.show();
  sleep(1);
}
