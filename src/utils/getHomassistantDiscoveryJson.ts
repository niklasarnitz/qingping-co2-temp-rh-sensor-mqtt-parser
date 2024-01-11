import { DataKey } from "../parser";
import { Env } from "./Env";
import { getMQTTTopic } from "./getMQTTTopic";

const getJsonObject = (
  key: DataKey,
  device_class: "temperature" | "humidity" | "carbon_dioxide" | "battery",
  unit_of_measurement?: "°C" | "%" | "ppm"
) => {
  return {
    device: {
      identifiers: [Env.SENSOR_MAC ?? ""],
      name: Env.HOME_ASSISTANT_DEVICE_NAME ?? Env.SENSOR_MAC ?? "",
      manufacturer: "QingPing",
      model: "CO2 & Temp & RH Monitor",
    },
    device_class,
    state_topic: getMQTTTopic(key),
    unique_id: `${Env.SENSOR_MAC}_${key}`,
    name: `${Env.HOME_ASSISTANT_DEVICE_NAME ?? Env.SENSOR_MAC ?? ""} ${key}`,
    ...(unit_of_measurement && { unit_of_measurement }), // Add unit_of_measurement conditionally
  };
};

export const getHomeassistantDiscoveryJson = (key: DataKey) => {
  switch (key) {
    case "temperature":
      return getJsonObject(key, "temperature", "°C");

    case "humidity":
      return getJsonObject(key, "humidity", "%");

    case "co2_ppm":
      return getJsonObject(key, "carbon_dioxide", "ppm");

    case "battery":
      return getJsonObject(key, "battery", "%");

    default:
      return undefined;
  }
};
