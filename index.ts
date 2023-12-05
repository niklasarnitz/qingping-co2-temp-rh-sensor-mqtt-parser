import mqtt from "mqtt";
import { checkProtocolHeader } from "./src/utils/checkProtocolHeader";
import { parseData } from "./src/parser";

if (!Bun.env.MQTT_SERVER) {
  throw new Error("MQTT_SERVER env variable is not set");
}

if (!Bun.env.MQTT_PORT) {
  throw new Error("MQTT_PORT env variable is not set");
}

if (!Bun.env.SENSOR_TOPIC) {
  throw new Error("SENSOR_ID env variable is not set");
}

const mqttClient =
  Bun.env.MQTT_USER && Bun.env.MQTT_PASSWORD
    ? mqtt.connect(`mqtt://${Bun.env.MQTT_SERVER}:${Bun.env.MQTT_PORT}`, {
        username: Bun.env.MQTT_USER,
        password: Bun.env.MQTT_PASSWORD,
      })
    : mqtt.connect(`mqtt://${Bun.env.MQTT_SERVER}:${Bun.env.MQTT_PORT}`);

mqttClient.on("connect", () => {
  console.log("Successfully connected to MQTT");
});

mqttClient.subscribe(Bun.env.SENSOR_TOPIC);

mqttClient.on("message", (topic, message) => {
  if (topic === Bun.env.SENSOR_TOPIC) {
    const messageAsUint8Array = new Uint8Array(message);

    if (!checkProtocolHeader(messageAsUint8Array)) {
      throw new Error("Invalid protocol header");
    }

    const parsedMessageData = parseData(messageAsUint8Array);

    for (const key in parsedMessageData) {
      if (key === "timestamp") {
        console.log(
          `Received message with timestamp ${parsedMessageData[key]}`
        );
      }

      if (Bun.env.CUSTOM_PARSED_DATA_TOPIC) {
        mqttClient.publish(
          `${Bun.env.CUSTOM_PARSED_DATA_TOPIC}/${key}`,
          JSON.stringify(parsedMessageData[key])
        );
      } else {
        mqttClient.publish(
          `${Bun.env.SENSOR_TOPIC.replace("/up", "")}/parsed/${key}`,
          JSON.stringify(parsedMessageData[key])
        );
      }
    }
  }
});
