import { Storage, Summary } from "./content";
import { readDir, readFile } from "./utils";
import { join as pathJoin } from "path";
import * as xml2js from "xml2js";
import * as opml from "opml";

/**
 * A repository of Storage objects.
 */
export abstract class Database {
  storages: Storage[] = [];

  abstract init(): void;
  // abstract addStorage(storage: Storage): void;
  // abstract delStorage(storage: Storage): void;
  // abstract commit(): void;
}

/**
 * A directory of JSON files as a databse.
 */
export class JsonDirDatabase extends Database {
  constructor(
    private dir: string // path to feeds directory
  ) {
    super();
  }

  async init() {
    const files = await readDir(this.dir);
    for (const file of files) {
      const path = pathJoin(this.dir, file);
      const json = await readFile(path);
      this.storages.push(Storage.fromJSON(json));
    }
  }
}

/**
 * A single OPML file as a database.
 */
export class OpmlFileDatabase extends Database {
  constructor(private path: string) {
    super();
  }

  async init() {
    const opmlString = await readFile(this.path);
    const opmlData: Object = opml.parse(opmlString);
    for (const outline of opmlData.outline) {
      this.storages.push(this.outlineToStorage(outline));
    }
  }

  private outlineToStorage(outline: string): Storage {
    xml2js.parseString(outline, (err: Error, result) => {
      if (err) {
        throw err;
      }

      return Storage.fromJSON(
        JSON.stringify({
          feed: result.outline["$"].xmlUrl,
          link: result.outline["$"]?.htmlUrl,
          title: result.outline["$"]?.title,
          ok: true,
        })
      );
    });
  }
}
