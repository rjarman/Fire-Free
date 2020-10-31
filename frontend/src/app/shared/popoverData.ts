export interface CommonValues {
    event: any;
    popoverType: string;
}

export class Popover<PopoverType> {
    popoverData: PopoverType;

    constructor(popoverData: PopoverType) {
        this.popoverData = popoverData;
    }
}
