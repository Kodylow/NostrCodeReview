export default async function validateExpiration(event) {
    const expTag = event.tagValue("exp");
    const timeNow = Math.floor(Date.now() / 1000);
    if (expTag && parseInt(expTag) < timeNow - 10) {
        throw new Error("Job expired");
    }
}
//# sourceMappingURL=expiration.js.map