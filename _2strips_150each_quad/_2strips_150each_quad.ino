#include <FastLED.h>

// How many leds in your strip?
#define NUM_LEDS 150
#define STRIPS 2
#define BRIGHTNESS  255
#define FRAMES_PER_SECOND 60

bool gReverseDirection = false;
bool isOn = false;
int alt = 0;
String data;
int secuencia = 0;
int bpm = 100;
int brillo, brillodiff, smoothbrillo;
int temp;
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
  FastLED.addLeds<WS2812B, 12, GRB>(leds[1], NUM_LEDS);
  FastLED.addLeds<WS2812B, 11, GRB>(leds[0], NUM_LEDS);
  while (!Serial.available()) {
  }
  Serial.print("OK");
  Serial.flush();
  secuenciaEncendido();
}

void loop() {

  if (Serial.available()) {
    secuencia = Serial.readStringUntil(',').toInt();
    temp = Serial.readStringUntil(',').toDouble();
    brillo = map(temp, 0, 100, 0, 255);
    bpm = Serial.readStringUntil(',').toInt();
    temp = Serial.readStringUntil(',').toDouble() * 100;
    h = map(temp, 0, 100, 0, 255);
    temp = Serial.readStringUntil(',').toDouble() * 100;
    s = map(temp, 0, 100, 0, 255);
    temp = Serial.readStringUntil(',').toDouble() * 100;
    l = map(temp, 0, 100, 0, 255);
  }

  if (brillo != smoothbrillo) {
    FastLED.setBrightness( smoothbrillo );
    brillodiff = brillo - smoothbrillo;
    smoothbrillo += brillodiff*0.1;
  }

  switch (secuencia) {
    case 0:
      fadeToBlackBy( leds[0], NUM_LEDS, 70);
      fadeToBlackBy( leds[1], NUM_LEDS, 70);
      break;
    case 1:
      solid();
      break;
    case 2:
      strobe();
      break;
    case 3:
      strobe_alternate();
      break;
    case 4:
      strobe_alternate2();
      break;
    case 5:
      confetti();
      break;
    case 6:
      Fire2012WithPalette();
      break;
    case 7:
      sinelon();
      break;
    case 8:
      sinelon2();
      break;
    case 9:
      rainbow();
      break;
    case 10:
      sweep();
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
#define SPARKING 40


void Fire2012WithPalette()
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
  for ( int j = 0; j < NUM_LEDS/2; j++) {
    // Scale the heat value from 0-255 down to 0-240
    // for best results with color palettes.
    byte colorindex = scale8( heat[j], 240);
    CRGB color = CHSV(h, colorindex, colorindex);
    int pixelnumber;
    if ( gReverseDirection ) {
      pixelnumber = (NUM_LEDS/2 - 1) - j;
    } else {
      pixelnumber = j;
    }
    leds[0][pixelnumber+NUM_LEDS/2] = color;
    leds[1][pixelnumber+NUM_LEDS/2] = color;
    leds[0][-pixelnumber+NUM_LEDS/2+1] = color;
    leds[1][-pixelnumber+NUM_LEDS/2+1] = color;
  }
}


void confetti()
{
  // random colored speckles that blink in and fade smoothly
  fadeToBlackBy( leds[0], NUM_LEDS, 70);
  fadeToBlackBy( leds[1], NUM_LEDS, 70);
  int pos = random16(NUM_LEDS);
  int hue = beatsin16( h, 0, 80 );
  int sat = beatsin16( h, 100, 20 );
  leds[0][pos] += CHSV(h + hue - 40, 80 + sat, 255);
  leds[1][pos] += CHSV(h + hue - 40, 80 + sat, 255);
}

void strobe() {
  if (isOn == false ) {
    for (int i = 0; i < NUM_LEDS; i++) {
      leds[0][i] = CHSV(h, s, l);
      leds[1][i] = CHSV(h, s, l);
    }
    isOn = true;
    delay((2000 / bpm) + 1);

  } else {
    for (int i = 0; i < NUM_LEDS; i++) {
      leds[0][i] = CRGB::Black;
      leds[1][i] = CRGB::Black;
    }
    isOn = false;
    fadeToBlackBy( leds[0], NUM_LEDS, 50);
    fadeToBlackBy( leds[1], NUM_LEDS, 50);
  }
}

void strobe_alternate() {
  if (isOn == false ) {
    if (alt == 0 || alt == 1) {
      for (int i = 0; i < NUM_LEDS/2; i++) {
        leds[0][i] = CHSV(h, s, l);
        leds[1][i] = CHSV(h, s, l);
      }
      alt++;
    } else if ( alt == 2) {
      for (int i = NUM_LEDS/2; i < NUM_LEDS; i++) {
        leds[0][i] = CHSV(h, s, l);
        leds[1][i] = CHSV(h, s, l);
      }
      alt++;
    } else {
      for (int i = NUM_LEDS/2; i < NUM_LEDS; i++) {
        leds[0][i] = CHSV(h, s, l);
        leds[1][i] = CHSV(h, s, l);
      }
      alt = 0;
    }
    isOn = true;
    delay((2000 / bpm) + 1);

  } else {
    for (int i = 0; i < NUM_LEDS; i++) {
      leds[0][i] = CRGB::Black;
      leds[1][i] = CRGB::Black;
    }
    isOn = false;
  }
}

void strobe_alternate2() {
  if (isOn == false ) {
    if (alt == 0) {
      for (int i = NUM_LEDS/3; i < (2*NUM_LEDS)/3; i++) {
        leds[0][i] = CHSV(h, s, l);
        leds[1][i] = CHSV(h, s, l);
      }
      alt++;
    } else if ( alt == 1) {
      for (int i = NUM_LEDS/6; i < (NUM_LEDS*2)/6; i++) {
        leds[0][i] = CHSV(h+20, s, l);
        leds[1][i] = CHSV(h+20, s, l);
      }
      for (int i = (NUM_LEDS*4)/6; i < (NUM_LEDS*5)/6; i++) {
        leds[0][i] = CHSV(h+20, s, l);
        leds[1][i] = CHSV(h+20, s, l);
      }
      alt++;
    } else if ( alt == 2) {
      for (int i =0; i < NUM_LEDS/6; i++) {
        leds[0][i] = CHSV(h+40, s, l);
        leds[1][i] = CHSV(h+40, s, l);
      }
      for (int i = (NUM_LEDS*5)/6; i < NUM_LEDS; i++) {
        leds[0][i] = CHSV(h+40, s, l);
        leds[1][i] = CHSV(h+40, s, l);
      }
      alt++;
    } else {
      alt = 0;
    }
    isOn = true;
    delay((2000 / bpm) + 1);

  } else {
    for (int i = 0; i < NUM_LEDS; i++) {
      leds[0][i] = CRGB::Black;
      leds[1][i] = CRGB::Black;
    }
    isOn = false;
  }
}


void sinelon()
{
  // a colored dot sweeping back and forth, with fading trails
  fadeToBlackBy( leds[0], NUM_LEDS, 50);
  fadeToBlackBy( leds[1], NUM_LEDS, 50);
  int pos0 = beatsin16( bpm / 2, 0, NUM_LEDS - 1 );
  leds[0][pos0] += CHSV( h + map(pos0, 0, NUM_LEDS, -50, 50), 255, 192);
  leds[0][-pos0+NUM_LEDS] += CHSV( h + map(pos0, 0, NUM_LEDS, -50, 50), 255, 192);
  leds[1][pos0] += CHSV( h + map(pos0, 0, NUM_LEDS, -50, 50), 255, 192);
  leds[1][-pos0+NUM_LEDS] += CHSV( h + map(pos0, 0, NUM_LEDS, -50, 50), 255, 192);
}

void sinelon2()
{
  // 2 colored dots sweeping back and forth, with fading trails
  fadeToBlackBy( leds[0], NUM_LEDS, 50);
  fadeToBlackBy( leds[1], NUM_LEDS, 50);
  int pos0 = beatsin16( bpm / 2, 0, NUM_LEDS - 1 );
  int pos1 = beatsin16( bpm / 2, 0, NUM_LEDS - 1 );
  int pos2 = beatsin16( bpm / 3, 0, NUM_LEDS - 1 );
  int pos3 = beatsin16( bpm / 3, 0, NUM_LEDS - 1 );
  leds[0][pos0] += CHSV( pos0 * 10, 255, 192);
  leds[1][pos1] += CHSV( pos0 * 10, 255, 192);
  leds[0][pos2] += CHSV( pos0 * 10, 255, 192);
  leds[1][pos3] += CHSV( pos0 * 10, 255, 192);
}

void rainbow() {
  for (int i = 0; i < NUM_LEDS; i++) {
    leds[0][i] = CHSV(h, s, l);
    leds[1][i] = CHSV(h, s, l);
    delay((2000 / bpm) + 1);
  }
  for (int i = NUM_LEDS-1; i > 0; i--) {
    leds[0][i] = CRGB::Black;
    leds[1][i] = CRGB::Black;
    delay((2000 / bpm) + 1);
  }
}

void solid() {
  for (int i = 0; i < NUM_LEDS; i++) {
    leds[0][i] = CHSV(h, s, l);
    leds[1][i] = CHSV(h, s, l);
  }
}

void secuenciaEncendido() {
  for (int i = 0; i < NUM_LEDS; i++) {
    leds[0][i] = CRGB::White;
    leds[1][i] = CRGB::White;
    delay(100);
  }
}

void sweep() {
  leds[0][millis()/53%NUM_LEDS] += CHSV(h, s, l);
  leds[1][(millis()/53+(NUM_LEDS/2))%NUM_LEDS] += CHSV(h, s, l);
  fadeToBlackBy(leds[0], NUM_LEDS, 50);
  fadeToBlackBy(leds[1], NUM_LEDS, 50);
  delay(30);
}
