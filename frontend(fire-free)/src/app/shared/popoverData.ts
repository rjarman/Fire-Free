export class PopoverData {
    event: any;
    id: string;
    popoverType: string;

    constructor(event: any, id: string, popoverType: string) {
        this.event = event;
        this.id = id;
        this.popoverType = popoverType;
    }
}

export class PopoverDatum {
    id: string;
    popoverType: string;

    constructor(id: string, popoverType: string) {
        this.id = id;
        this.popoverType = popoverType;
    }
}
