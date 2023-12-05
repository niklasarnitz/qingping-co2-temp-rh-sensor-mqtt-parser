# qingping-co2-temp-rh-sensor-parser

This is a small utility to parse the data from a Qingping CO2 Temp & RH Sensor via it's private cloud functionality.

If you want to learn how to enable the private cloud functionality, you can read more about it [here](https://github.com/GreyEarl/qingping-air-monitor-mqtt).

## Environment Variables

- `MQTT_SERVER`: MQTT Broker Hostname or IP Address (required)
- `MQTT_PORT`: MQTT Broker Port (required)
- `MQTT_USER`: MQTT User (optional)
- `MQTT_PASSWORD`: MQTT Password (optional)
- `SENSOR_TOPIC`: The MQTT Topic, where the Sensor publishes it's raw data (required)
- `CUSTOM_PARSED_DATA_TOPIC`: The MQTT Topic where the parsed data get's published (optional)

## Docker deployment

## Development

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```
