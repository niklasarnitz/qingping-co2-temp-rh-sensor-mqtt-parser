import { DataKey } from "../parser";
import { Env } from "./Env";

export const getMQTTTopic = (key: DataKey) => {
  return Env.CUSTOM_PARSED_DATA_TOPIC
    ? `${Env.CUSTOM_PARSED_DATA_TOPIC}/${key}`
    : `${Env.SENSOR_TOPIC.replace("/up", "")}/parsed/${key}`;
};

export const getHomeassistantMQTTTopic = (key: DataKey) => {
  return `homeassistant/sensor/${Env.SENSOR_MAC}_${key}/config`;
};
