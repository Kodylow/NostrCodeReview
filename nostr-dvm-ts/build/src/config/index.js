import { NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import fs from "fs";
import { log, configFile } from "../main.js";
export function getConfig() {
    let config;
    if (fs.existsSync(configFile)) {
        config = JSON.parse(fs.readFileSync(configFile, "utf8"));
    }
    if (!config) {
        log("Generating new config");
        config = {
            key: NDKPrivateKeySigner.generate().privateKey,
        };
        const signer = NDKPrivateKeySigner.generate();
        config.key = signer.privateKey;
        saveConfig(config);
    }
    return config;
}
export function saveConfig(config) {
    fs.writeFileSync(configFile, JSON.stringify(config));
}
//# sourceMappingURL=index.js.map