import { NDKEvent } from "@nostr-dev-kit/ndk";
import { log, ndk } from "../../main.js";
export async function publishStatus(event, status, extraTags = []) {
    log("marking job as finished");
    const reactEvent = new NDKEvent(ndk, {
        kind: 68000,
        content: "👍",
        tags: [["status", status], ...extraTags],
    });
    console.log({ extraTags });
    reactEvent.tag(event, "job");
    console.log("reactEvent.tag(event, 'job')");
    await reactEvent.sign();
    console.log("await reactEvent.sign()");
    await reactEvent.publish();
    console.log("await reactEvent.publish()");
    return reactEvent;
}
//# sourceMappingURL=status.js.map