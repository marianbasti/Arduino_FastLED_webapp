#include <FastLED.h>

// How many leds in your strip?
#define NUM_LEDS 112
#define STRIPS 4
#define BRIGHTNESS  255
#define FRAMES_PER_SECOND 60

bool gReverseDirection = false;
bool isOn = false;
String data;
int secuencia = 0;
int bpm = 100;
double brillo;
double h;
double s;
double l;

// For led chips like Neopixels, which have a data line, ground, and power, you just
// need to define DATA_PIN.  For led chipsets that are SPI based (four wires - data, clock,
// ground, and power), like the LPD8806 define both DATA_PIN and CLOCK_PIN
// #define DATA_PIN 3
// #define CLOCK_PIN 13

// Define the array of leds
CRGB leds[STRIPS][NUM_LEDS];

CRGBPalette16 gPal;

void setup() {
  delay(1500); // sanity delay
  Serial.begin(9600);
  Serial.setTimeout(50);
  FastLED.setBrightness( BRIGHTNESS );
  gPal = CRGBPalette16( CRGB::Black, CRGB::DarkGreen, CRGB::YellowGreen,  CRGB::LightGreen);
  // FastLED.addLeds<WS2811, DATA_PIN, RGB>(leds, NUM_LEDS);
  FastLED.addLeds<WS2812B, 6, GRB>(leds[3], NUM_LEDS);
  FastLED.addLeds<WS2812B, 5, GRB>(leds[2], NUM_LEDS);
  FastLED.addLeds<WS2812B, 4, GRB>(leds[1], NUM_LEDS);
  FastLED.addLeds<WS2812B, 3, GRB>(leds[0], NUM_LEDS);
  while (!Serial.available()) {
  }
  Serial.print("OK");
  Serial.flush();
  secuenciaEncendido();
}

void loop() {

  if (Serial.available()) {
    secuencia = Serial.readStringUntil(',').toInt();
    brillo = Serial.readStringUntil(',').toInt();
    bpm = Serial.readStringUntil(',').toInt();
    h = map(Serial.readStringUntil(',').toDouble(), 0, 1, 0, 255);
    s = map(Serial.readStringUntil(',').toDouble(), 0, 1, 0, 255);
    l = map(Serial.readStringUntil(',').toDouble(), 0, 1, 0, 255);
  }


  FastLED.setBrightness( brillo );

  switch (secuencia) {
    case 0:
      fadeToBlackBy( leds[0], NUM_LEDS, 70);
      fadeToBlackBy( leds[1], NUM_LEDS, 70);
      break;
    case 1:
      solid(h, s);
      break;
    case 2:
      strobe(bpm);
      break;
    case 3:
      confetti(h, s);
      break;
    case 4:
      Fire2012WithPalette(h, s);
      break;
    case 5:
      sinelon(bpm);
      break;
    case 6:
      rainbow();
      break;
  }

  random16_add_entropy( random());

  FastLED.show(); // display this frame
  FastLED.delay(1000 / FRAMES_PER_SECOND);

}

#define COOLING  55

// SPARKING: What chance (out of 255) is there that a new spark will be lit?
// Higher chance = more roaring fire.  Lower chance = more flickery fire.
// Default 120, suggested range 50-200.
#define SPARKING 80


void Fire2012WithPalette(int h, int s)
{
  // Array of temperature readings at each simulation cell
  static byte heat[NUM_LEDS];

  // Step 1.  Cool down every cell a little
  for ( int i = 0; i < NUM_LEDS; i++) {
    heat[i] = qsub8( heat[i],  random8(0, ((COOLING * 10) / NUM_LEDS) + 2));
  }

  // Step 2.  Heat from each cell drifts 'up' and diffuses a little
  for ( int k = NUM_LEDS - 1; k >= 2; k--) {
    heat[k] = (heat[k - 1] + heat[k - 2] + heat[k - 2] ) / 3;
  }

  // Step 3.  Randomly ignite new 'sparks' of heat near the bottom
  if ( random8() < SPARKING ) {
    int y = random8(7);
    heat[y] = qadd8( heat[y], random8(160, 255) );
  }

  // Step 4.  Map from heat cells to LED colors
  for ( int j = 0; j < NUM_LEDS; j++) {
    // Scale the heat value from 0-255 down to 0-240
    // for best results with color palettes.
    byte colorindex = scale8( heat[j], 240);
    CRGB color = CHSV(h, colorindex, colorindex);
    int pixelnumber;
    if ( gReverseDirection ) {
      pixelnumber = (NUM_LEDS - 1) - j;
    } else {
      pixelnumber = j;
    }
    leds[0][pixelnumber] = color;
    leds[1][pixelnumber] = color;
  }
}


void confetti(int h, int s)
{
  // random colored speckles that blink in and fade smoothly
  fadeToBlackBy( leds[0], NUM_LEDS, 70);
  fadeToBlackBy( leds[1], NUM_LEDS, 70);
  int pos = random16(NUM_LEDS);
  int hue = beatsin16( h, 0, 100 );
  int sat = beatsin16( h, 0, 255 - 80 );
  leds[0][pos] += CHSV(hue, 80 + sat, 255);
  leds[1][pos] += CHSV(hue, 80 + sat, 255);
}

void strobe(int bpm) {
  if (isOn == false ) {
    for (int i = 0; i < NUM_LEDS; i++) {
      leds[0][i] = CRGB::White;
      leds[1][i] = CRGB::White;
    }
    isOn = true;
    delay(50);
  } else {
    for (int i = 0; i < NUM_LEDS; i++) {
      leds[0][i] = CRGB::Black;
      leds[1][i] = CRGB::Black;
    }
    isOn = false;
    delay((60000 / bpm) - 50);
  }
}

void sinelon(int bpm)
{
  // a colored dot sweeping back and forth, with fading trails
  fadeToBlackBy( leds[0], NUM_LEDS, 50);
  fadeToBlackBy( leds[1], NUM_LEDS, 50);
  fadeToBlackBy( leds[2], NUM_LEDS, 50);
  fadeToBlackBy( leds[3], NUM_LEDS, 50);
  int pos0 = beatsin16( bpm / 5, 0, NUM_LEDS - 1 );
  int pos1 = beatsin16( bpm / 5, 0, NUM_LEDS - 1 );
  int pos2 = beatsin16( bpm / 5, 0, NUM_LEDS - 1 );
  int pos3 = beatsin16( bpm / 5, 0, NUM_LEDS - 1 );
  leds[0][pos0] += CHSV( pos0 * 10, 255, 192);
  leds[1][pos1] += CHSV( pos0 * 10, 255, 192);
  leds[2][pos2] += CHSV( pos0 * 10, 255, 192);
  leds[3][pos3] += CHSV( pos0 * 10, 255, 192);
}

void rainbow()
{
  // FastLED's built-in rainbow generator
  fill_rainbow( leds[0], NUM_LEDS, 0, 7);
  fill_rainbow( leds[1], NUM_LEDS, 10, 7);
  fill_rainbow( leds[2], NUM_LEDS, 20, 7);
  fill_rainbow( leds[3], NUM_LEDS, 30, 7);
}

void solid(int h, int s) {
  for (int i = 0; i < NUM_LEDS; i++) {
    leds[0][i] = CRGB(h, s, 255);
    leds[1][i] = CRGB(h, s, 255);
    leds[2][i] = CRGB(h, s, 255);
    leds[3][i] = CRGB(h, s, 255);
  }
}

void secuenciaEncendido() {
  for (int i = 0; i < NUM_LEDS; i++) {
    leds[0][i] = CRGB::White;
    leds[1][i] = CRGB::White;
    leds[2][i] = CRGB::White;
    leds[3][i] = CRGB::White;
    delay(10);
  }
}

