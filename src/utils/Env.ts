export class Env {
  static MQTT_SERVER: string;
  static MQTT_PORT: string;
  static MQTT_USER: string | undefined;
  static MQTT_PASSWORD: string | undefined;
  static SENSOR_TOPIC: string;
  static SENSOR_MAC: string | undefined;
  static CUSTOM_PARSED_DATA_TOPIC: string | undefined;
  static ADVERTISE_HOME_ASSISTANT = true;
  static HOME_ASSISTANT_DEVICE_NAME: string | undefined;

  static init() {
    if (!Bun.env.MQTT_SERVER) {
      throw new Error("MQTT_SERVER env variable is not set");
    }

    if (!Bun.env.MQTT_PORT) {
      throw new Error("MQTT_PORT env variable is not set");
    }

    if (!Bun.env.SENSOR_TOPIC) {
      throw new Error("SENSOR_TOPIC env variable is not set");
    }

    if (!Bun.env.SENSOR_MAC) {
      throw new Error("SENSOR_MAC env variable is not set");
    }

    Env.MQTT_SERVER = Bun.env.MQTT_SERVER;
    Env.MQTT_PORT = Bun.env.MQTT_PORT;
    Env.MQTT_USER = Bun.env.MQTT_USER;
    Env.MQTT_PASSWORD = Bun.env.MQTT_PASSWORD;
    Env.SENSOR_TOPIC = Bun.env.SENSOR_TOPIC;
    Env.SENSOR_MAC = Bun.env.SENSOR_MAC;
    Env.CUSTOM_PARSED_DATA_TOPIC = Bun.env.CUSTOM_PARSED_DATA_TOPIC;

    if (Bun.env.ADVERTISE_HOME_ASSISTANT !== undefined) {
      Env.ADVERTISE_HOME_ASSISTANT = JSON.parse(
        Bun.env.ADVERTISE_HOME_ASSISTANT
      );
    }
  }
}
