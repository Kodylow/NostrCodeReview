import { NDKEvent } from "@nostr-dev-kit/ndk";
import validateExpiration from "./expiration.js";
import validateRequester from "./requester.js";
// import validateNoRecentResults from './no-recent-results.js';
import { ndk } from "../main.js";
import { addAmount } from "../job-types/speech-to-text.js";
import { getConfig } from "../config/index.js";
export async function validateJobRequest(event) {
    console.log("Validating job request");
    await validateExpiration(event);
    console.log("Validated expiration");
    await validateRequester(event);
    console.log("Validated requester");
    // await validateNoRecentResults(event);
    console.log("Validated no-recent-results");
}
export async function requirePayment(event, amount, publish) {
    if (!amount) {
        const bidTag = event.tagValue("bid");
        amount = bidTag ? parseInt(bidTag) : undefined;
    }
    if (!amount) {
        throw new Error("No amount specified");
    }
    const payReq = new NDKEvent(ndk, {
        kind: 68001,
        content: getConfig().jobReqMessage,
        tags: [["status", "payment-required"]],
    });
    await addAmount(payReq, amount);
    payReq.tag(event, "job");
    await payReq.sign();
    console.log(" here: ", payReq.rawEvent());
    if (publish !== false)
        await payReq.publish();
    console.log("published...");
    return payReq;
}
//# sourceMappingURL=index.js.map