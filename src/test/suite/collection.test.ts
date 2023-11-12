import { OpmlFileDatabase } from "../../database";


suite("LocalCollection", () => {
  test("sanity", () => {
    const tempDir = "/home/keto/Projects/vscode-rss/temp";
    const opmlFileDatabase = new OpmlFileDatabase(
      "/home/keto/Projects/vscode-rss/subscriptions.opml"
    );
    // const localCollection = new LocalCollection(
    //   tempDir,
    //   "accountFooBar",
    //   opmlFileDatabase
    // );
    // assert(localCollection.database instanceof OpmlFileDatabase);
  });
});
