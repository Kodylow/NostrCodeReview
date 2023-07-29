import { NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { getConfig } from "./config/index.js";
export default function getSigner() {
    const config = getConfig();
    if (config.key == null) {
        throw new Error("Config key is not defined");
    }
    return new NDKPrivateKeySigner(config.key);
}
//# sourceMappingURL=local-signer.js.map