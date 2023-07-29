import { ndk } from "../main.js";
export default async function validateNoRecentResults(event) {
    const results = ndk.fetchEvents({
        kinds: [68002],
        "#e": [event.id],
    }, { groupable: false });
    if (results.length > 0) {
        throw new Error(`This job already has ${results.length} results`);
    }
}
//# sourceMappingURL=no-recent-results.js.map