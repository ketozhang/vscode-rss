import { OpmlFileDatabase } from "../../database";
import { LocalCollection } from "../../local_collection";
import { assert } from "console";

suite("LocalCollection", () => {
  test("Should create a LocalCollection with OpmlFileDatabase as its database", () => {
    const tempDir = "/home/keto/Projects/vscode-rss/temp";
    const opmlFileDatabase = new OpmlFileDatabase(
      "/home/keto/Projects/vscode-rss/subscriptions.opml"
    );
    const localCollection = new LocalCollection(
      tempDir,
      "accountFooBar",
      opmlFileDatabase
    );
    assert(localCollection.database instanceof OpmlFileDatabase);
  });
});
