# qingping-co2-temp-rh-sensor-parser

This is a small utility to parse the data from a Qingping CO2 Temp & RH Sensor via it's private cloud functionality.

If you want to learn how to enable the private cloud functionality, you can read more about it [here](https://github.com/GreyEarl/qingping-air-monitor-mqtt).

## Environment Variables

- `MQTT_SERVER`: MQTT Broker Hostname or IP Address (required)
- `MQTT_PORT`: MQTT Broker Port (required)
- `MQTT_USER`: MQTT User (optional)
- `MQTT_PASSWORD`: MQTT Password (optional)
- `SENSOR_TOPIC`: The MQTT Topic, where the Sensor publishes it's raw data (required)
- `SENSOR_MAC`: The mac address of the sensor shown in the qingping developer portal (required)
- `CUSTOM_PARSED_DATA_TOPIC`: The MQTT Topic where the parsed data get's published (true by default, optional)
- `ADVERTISE_HOME_ASSISTANT`: A Boolean which enables or disables publishing a Home Assistant Discovery Packet (optional)
- `HOME_ASSISTANT_DEVICE_NAME`: The Device Name which get's sent to Home Assistant (optional, the devices mac get's used by default)

## Home Assistant support

By default temperature, humidity, CO2 and the battery state of the sensor are being announced via the Home Assistant discovery protocol, so the sensor should be configured automatically.

If you need any other data which also gets parsed and published by this piece of software, you can use the MQTT Integration in Home Assistant for that.

## Docker deployment

Just run the provided docker compose file

## Development

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```
