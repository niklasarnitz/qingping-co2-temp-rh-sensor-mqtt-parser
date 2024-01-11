import mqtt from "mqtt";
import { checkProtocolHeader } from "./src/utils/checkProtocolHeader";
import { parseData } from "./src/parser";
import { Env } from "./src/utils/Env";
import { ObjectHelper } from "@ainias42/js-helper";
import {
  getHomeassistantMQTTTopic as getHomeAssistantMQTTTopic,
  getMQTTTopic,
} from "./src/utils/getMQTTTopic";
import { getHomeassistantDiscoveryJson as getHomeAssistantDiscoveryJson } from "./src/utils/getHomassistantDiscoveryJson";

Env.init();

const mqttClient =
  Env.MQTT_USER && Env.MQTT_PASSWORD
    ? mqtt.connect(`mqtt://${Env.MQTT_SERVER}:${Env.MQTT_PORT}`, {
        username: Env.MQTT_USER,
        password: Env.MQTT_PASSWORD,
      })
    : mqtt.connect(`mqtt://${Env.MQTT_SERVER}:${Env.MQTT_PORT}`);

mqttClient.on("connect", () => {
  console.log("Successfully connected to MQTT");
});

mqttClient.subscribe(Env.SENSOR_TOPIC);
console.log(`Subscribed to topic ${Env.SENSOR_TOPIC}`);

mqttClient.on("message", (topic, message) => {
  if (topic === Env.SENSOR_TOPIC) {
    const messageAsUint8Array = new Uint8Array(message);

    if (!checkProtocolHeader(messageAsUint8Array)) {
      throw new Error("Invalid protocol header");
    }

    const parsedMessageData = parseData(messageAsUint8Array);

    ObjectHelper.keys(parsedMessageData).forEach((key) => {
      if (key === "timestamp") {
        console.log(
          `Received message with timestamp ${parsedMessageData[key]}`
        );
      }

      if (Env.ADVERTISE_HOME_ASSISTANT) {
        const discoveryData = getHomeAssistantDiscoveryJson(key);

        if (discoveryData) {
          const topic = getHomeAssistantMQTTTopic(key);
          const stringifiedDiscoveryData = JSON.stringify(discoveryData);
          mqttClient.publish(
            topic,
            stringifiedDiscoveryData
          );
          console.log(`Published discovery data to topic ${topic}: ${stringifiedDiscoveryData}`);
        }
      }

      const topic = getMQTTTopic(key);
      const stringifiedData = JSON.stringify(parsedMessageData[key]);
      console.log(`Publishing ${topic}: ${stringifiedData}`);
      mqttClient.publish(
        topic,
        stringifiedData
      );
    });
  }
});
