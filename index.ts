import mqtt from "mqtt";
import { checkProtocolHeader } from "./src/utils/checkProtocolHeader";
import { parseData } from "./src/parser";

const mqttClient = mqtt.connect("mqtt://10.0.0.200:1883");

mqttClient.on("connect", () => {
  console.log("Successfully connected to MQTT");
});

mqttClient.subscribe("qingping/582D3481AC41/up");

mqttClient.on("message", (topic, message) => {
  if (topic === "qingping/582D3481AC41/up") {
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

      mqttClient.publish(
        `qingping/582D3481AC41/${key}`,
        JSON.stringify(parsedMessageData[key])
      );
    }
  }
});
