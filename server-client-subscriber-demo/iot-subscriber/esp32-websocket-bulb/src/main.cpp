#include <Arduino.h>
#include <Adafruit_NeoPixel.h>
// 4 external RGB LEDs on pin 1
// 1 internal RGB LED on pin 8
#define LED_PIN 1
#define LED_COUNT 4
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
  pixel.setPixelColor(3, pixel.Color(250, 0, 0));
  pixel.show();
  sleep(1);
  pixel.setPixelColor(3, pixel.Color(0, 250, 0));
  pixel.show();
  sleep(1);
  pixel.setPixelColor(3, pixel.Color(250, 250, 0));
  pixel.show();
  sleep(1);
}
