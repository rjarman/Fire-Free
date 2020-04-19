export interface AdminDatum {
    imagePath: string;
    username: string;
    email: string;
    branch: string;
    contactNumber: string;
    designation: string;
    gender: string;
}

export interface ConsumerDatum {
    imagePath: string;
    consumerName: string;
    email: string;
    contactNumber: string;
    macAddress: string;
    servedBy: string;
}

interface GPSData {
    date: string;
    time: string;
    latitude: string;
    longitude: string;
    altitude: string;
}


interface MQ2Data {
    hydrogen: string;
    lpg: string;
    methane: string;
    carbonMonoxide: string;
    alcohol: string;
    smoke: string;
    propane: string;
    air: string;
}

export interface HardwareData {
    mq2: MQ2Data;
    gps: GPSData;
}

export interface NotificationDatum {
    hardwareState: string;
    solvedBy: string;
    consumerData: ConsumerDatum;
    hardwareData: HardwareData;
}

export class ViewerDataFormatter<Interface> {
    viewerData: Interface;
    constructor(viewerData: Interface) {
        this.viewerData = viewerData;
    }
}
