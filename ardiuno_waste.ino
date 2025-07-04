#include <Arduino.h>
#include <ArduinoJson.h>

// === Ultrasonic Sensor ===
#define TRIG_PIN 5
#define ECHO_PIN 4
const float TANK_HEIGHT_CM = 30.0;

// === Color Sensor ===
#define S0 6
#define S1 7
#define S2 8
#define S3 9
#define colorOut 10

float getSmoothedDistance(int samples = 5) {
  float total = 0;
  for (int i = 0; i < samples; i++) {
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    long duration = pulseIn(ECHO_PIN, HIGH, 30000);
    float dist = (duration == 0) ? TANK_HEIGHT_CM : duration * 0.0343 / 2.0;
    total += dist;
    delay(20);
  }
  return total / samples;
}

int readColorPulse(bool s2, bool s3) {
  digitalWrite(S2, s2);
  digitalWrite(S3, s3);
  delay(50);
  long pulse = pulseIn(colorOut, LOW, 50000);
  return (pulse == 0) ? 99999 : pulse;
}

int pulseToIntensity(long pulse) {
  if (pulse <= 1 || pulse == 99999) return 0;
  int intensity = 25500 / pulse;
  return constrain(intensity, 0, 255);
}

void setup() {
  Serial.begin(9600);
  pinMode(A2, INPUT); // pH
  pinMode(A1, INPUT); // Turbidity
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(S0, OUTPUT); pinMode(S1, OUTPUT);
  pinMode(S2, OUTPUT); pinMode(S3, OUTPUT);
  pinMode(colorOut, INPUT);
  digitalWrite(S0, HIGH);
  digitalWrite(S1, LOW);
  Serial.println("Arduino ready.");
}

void loop() {
  if (Serial.available()) {
    String request = Serial.readStringUntil('\n');
    request.trim();

    StaticJsonDocument<128> doc;
    DeserializationError error = deserializeJson(doc, request);

    if (error || doc["type"] != "request") {
      Serial.print("Invalid or no request: ");
      Serial.println(error.c_str());
      return;
    }

    // === pH Sensor ===
    int rawPh = analogRead(A2);
    float phVoltage = rawPh * (5.0 / 1023.0);
    float pH = -1;

    // Calibration: pH 4.00 @ 2.50V, pH 6.86 @ 1.80V
    float slope = (4.00 - 6.86) / (3.72 - 2.70);
    float intercept = 4.00 - (slope * 3.72);

    // If voltage is very low (sensor dry), treat as "no reading"
    if (phVoltage > 0.1) {
      pH = slope * phVoltage + intercept;
    }

    // === Turbidity Sensor ===
    int turbRaw = analogRead(A1);
    float turbidityNTU = map(turbRaw, 0, 1023, 0, 1000);

    // === Water Level ===
    float distance = getSmoothedDistance();
    if (distance >= TANK_HEIGHT_CM) distance = TANK_HEIGHT_CM;
    float waterLevel = TANK_HEIGHT_CM - distance;
    if (waterLevel < 0) waterLevel = 0;

    // === Color Sensor ===
    int red = pulseToIntensity(readColorPulse(LOW, LOW));
    int green = pulseToIntensity(readColorPulse(HIGH, HIGH));
    int blue = pulseToIntensity(readColorPulse(LOW, HIGH));

    // === JSON Response ===
    StaticJsonDocument<512> response;
    response["ph_voltage"] = phVoltage;  // Add this line!

    response["type"] = "response";
    if (pH >= 0) response["ph"] = pH;
    else response["ph"] = nullptr;

    response["turbidity"] = turbidityNTU;
    response["water_level"] = waterLevel;
    JsonArray color = response.createNestedArray("color");
    color.add(red); color.add(green); color.add(blue);

    serializeJson(response, Serial);
    Serial.println();
  }
}
