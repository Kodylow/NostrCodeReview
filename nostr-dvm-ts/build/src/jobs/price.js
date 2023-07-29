import { log } from "../main.js";
import { getConfig } from "../config/index.js";
export async function priceJob(event) {
    const config = getConfig();
    const bidTag = event.tagValue("bid");
    let bidAmount = bidTag ? parseInt(bidTag) : 1 * 1000;
    if (config.discount) {
        bidAmount = bidAmount * config.discount;
    }
    log(`bid amount: ${bidAmount} (${config.discount ?? "no"} discount)`);
    return bidAmount;
}
//# sourceMappingURL=price.js.map