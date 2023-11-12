import { Storage, Summary } from "./content";
import { readDir, readFile } from "./utils";
import { join as pathJoin } from "path";
import * as cheerio from "cheerio";

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
    const $dom = cheerio.load(opmlString, { xmlMode: true });
    $dom("outline").each((_, elem) => {
      Storage.fromJSON(
        JSON.stringify({
          feed: $dom(elem).attr("xmlUrl"),
          link: $dom(elem).attr("htmlUrl"),
          title: $dom(elem).attr("title"),
          ok: true,
        })
      );
    });
  }
}
