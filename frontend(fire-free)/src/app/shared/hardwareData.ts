import { GPSData } from './hardwareData/gpsData';
import { MQ2Data } from './hardwareData/mq2Data';

export interface HardwareData {
    mq2: MQ2Data;
    gps: GPSData;
}
