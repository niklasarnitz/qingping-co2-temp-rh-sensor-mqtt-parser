import { parseKeys } from "./utils/parseKeys";

export type DataKey =
	| "historicalData"
	| "uploadDataInterval"
	| "recordDataInterval"
	| "undocumentedValue"
	| "temperatureUnit"
	| "firmware_version"
	| "timestamp"
	| "temperature"
	| "humidity"
	| "co2_ppm"
	| "battery"
	| "isGoingIntoLowPowerMode"
	| "hardwareVersion"
	| "isPluggedInToPower"
	| "wirelessModuleFirmwareVersion"
	| "mcuFirmwareVersion"
	| "productId"
	| "co2MeasurementInterval"
	| "autoOffTime"
	| "timeMode"
	| "co2ASC"
	| "co2OffsetPercentage"
	| "co2IsBeingCalibrated"
	| "co2Offset"
	| "temperatureOffset"
	| "temperatureOffsetPercentage"
	| "humidityOffset"
	| "humidityOffsetPercentage";

export const parseData = (inputBytes: Uint8Array) => {
	const data = parseKeys(inputBytes);

	const exportableData: Record<DataKey, string | boolean | number> =
		{} as Record<DataKey, string | boolean | number>;

	for (const key in data) {
		switch (key) {
			// Historical Data
			case "0x3": {
				const hexString = Array.from(data[key])
					.map((byte) => Number(byte).toString(16))
					.join(" ");

				exportableData.historicalData = hexString;
				break;
			}

			// Interval of Data Upload
			case "0x4": {
				exportableData.uploadDataInterval = data[key][0] * 60;
				break;
			}

			// Interval of Data Recording
			case "0x5": {
				exportableData.recordDataInterval = data[key][0];
				break;
			}

			// Undocumented Value
			case "0x6": {
				exportableData.undocumentedValue = data[key].toString();
				break;
			}

			// Unit of Temperature
			case "0x19": {
				exportableData.temperatureUnit =
					data[key][0] === 0 ? "celsius" : "fahrenheit";
				break;
			}

			// Firmware Version
			case "0x11": {
				exportableData.firmware_version = String.fromCharCode(...data[key]);
				break;
			}

			// Real-time networking event -> Contains Sensor Data
			case "0x14": {
				const sensorData = data[key];

				const timestamp =
					sensorData[0] |
					(sensorData[1] << 8) |
					(sensorData[2] << 16) |
					(sensorData[3] << 24);
				exportableData.timestamp = timestamp;

				const realSensorData = sensorData.slice(4);

				const combinedData =
					realSensorData[0] |
					(realSensorData[1] << 8) |
					(realSensorData[2] << 16);

				const temperature = ((combinedData >> 12) - 500.0) / 10.0;
				exportableData.temperature = temperature;

				const humidity = (combinedData & 0x000fff) / 10;
				exportableData.humidity = humidity;

				const co2PPM = realSensorData[3] | (realSensorData[4] << 8);
				exportableData.co2_ppm = co2PPM;

				const battery = realSensorData[5];
				exportableData.battery = battery;
				break;
			}

			// Disconnect the Device -> When this is true the device will enter into low-power mode
			case "0x1d": {
				exportableData.isGoingIntoLowPowerMode = !!data[key][0];
				break;
			}

			// Hardware Version
			case "0x22": {
				exportableData.hardwareVersion = String.fromCharCode(...data[key]);
				break;
			}

			// USB Plugin Status
			case "0x2c": {
				exportableData.isPluggedInToPower = !!data[key][0];
				break;
			}

			// Wireless Module Firmware Version
			case "0x34": {
				exportableData.wirelessModuleFirmwareVersion = String.fromCharCode(
					...data[key],
				);
				break;
			}

			// MCU Firmware Version
			case "0x35": {
				exportableData.mcuFirmwareVersion = String.fromCharCode(...data[key]);
				break;
			}

			// ProductID
			case "0x38": {
				if (data[key]) {
					exportableData.productId = String.fromCharCode(...data[key]);
				}

				break;
			}

			// Interval of CO2 Measurement
			case "0x3b": {
				exportableData.co2MeasurementInterval = data[key][0] * 60;
				break;
			}

			// Not Needed value
			case "0x3c": {
				break;
			}

			// Auto Off Time
			case "0x3d": {
				exportableData.autoOffTime = data[key][0] * 60;
				break;
			}

			// Time setting
			case "0x3e": {
				exportableData.timeMode = data[key][0] === 0 ? "24h" : "12h";
				break;
			}

			// CO2 ASC Switch
			case "0x40": {
				exportableData.co2ASC = !!data[key][0];
				break;
			}

			// Offset CO2 by percentage
			case "0x3f": {
				const co2OffsetPercentage = data[key][0] | (data[key][1] << 8);
				exportableData.co2OffsetPercentage = co2OffsetPercentage / 10;
				break;
			}

			// CO2 Calibration Status
			case "0x4a": {
				exportableData.co2IsBeingCalibrated = !!data[key][0];
				break;
			}

			// Offset CO2 by value
			case "0x45": {
				const co2Offset = data[key][0] | (data[key][1] << 8);
				exportableData.co2Offset = co2Offset;
				break;
			}

			// Offset Temperature by Value
			case "0x46": {
				const temperatureOffset = data[key][0] | (data[key][1] << 8);
				exportableData.temperatureOffset = temperatureOffset / 10;
				break;
			}

			// Offset Temperature by Percentage
			case "0x47": {
				const temperatureOffsetPercentage = data[key][0] | (data[key][1] << 8);
				exportableData.temperatureOffsetPercentage =
					temperatureOffsetPercentage / 10;
				break;
			}

			// Offset Humidity by value
			case "0x48": {
				const humidityOffset = data[key][0] | (data[key][1] << 8);
				exportableData.humidityOffset = humidityOffset / 10;
				break;
			}

			// Offset Humidity by percent
			case "0x49": {
				const humidityOffsetPercentage = data[key][0] | (data[key][1] << 8);
				exportableData.humidityOffsetPercentage = humidityOffsetPercentage / 10;
				break;
			}

			default:
				console.log("Unknown data key: ", Number(key).toString(16));
		}
	}

	return exportableData;
};
