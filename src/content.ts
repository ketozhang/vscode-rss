import { Abstract, Summary } from "./content";

export class Entry {
    constructor(
        public id: string,
        public title: string,
        public content: string,
        public date: number,
        public link: string | undefined,
        public read: boolean,
    ) {}
}

export class Abstract {
    constructor(
        public readonly id: string,
        public title: string,
        public date: number,
        public link: string | undefined,
        public read: boolean,
        public feed: string,
        public starred: boolean = false,
        public custom_data?: any,
    ) {}

    static fromEntry(entry: Entry, feed: string) {
        return new Abstract(entry.id, entry.title, entry.date, entry.link, entry.read, feed);
    }
}

export class Summary {
    constructor(
        public link: string,
        public title: string,
        public catelog: string[] = [],
        public ok: boolean = true,
        public custom_data?: any,
    ) {}
}

export class Storage {
    private constructor(
        private feed: string,
        private link: string,
        private title: string,
        private abstracts: Abstract[],
        private ok: boolean = true,
        private custom_data?: any
    ) { }

    static fromSummary(feed: string, summary: Summary, get: (link: string) => Abstract) {
        return new Storage(feed, summary.link, summary.title,
            summary.catelog.map(get),
            summary.ok, summary.custom_data);
    }

    static fromJSON(json: string) {
        const obj = JSON.parse(json);
        return new Storage(obj.feed, obj.link, obj.title, obj.abstracts, obj.ok, obj.custom_data);
    }

    toSummary(set: (id: string, abstract: Abstract) => void): [string, Summary] {
        const summary = new Summary(this.link, this.title, this.abstracts.map(abs => abs.id),
            this.ok, this.custom_data);
        for (const abstract of this.abstracts) {
            set(abstract.id, abstract);
        }
        return [this.feed, summary];
    }

    toJSON() {
        return JSON.stringify({
            feed: this.feed,
            link: this.link,
            title: this.title,
            abstracts: this.abstracts,
            ok: this.ok,
            custom_data: this.custom_data,
        });
    }
}
