import { NDKEvent } from "@nostr-dev-kit/ndk";
import axios from "axios";
import FormData from "form-data";
import { log } from "../main.js";
import { fetchFileFromInput } from "../utils/fetch-file-from-input.js";
import { ndk } from "../main.js";
// import { fileTypeFromFile, type FileTypeResult } from 'file-type';
import { exec } from "child_process";
import fs from "fs";
import { createInvoice } from "../utils/lnbits.js";
export async function speechToTextJob(event) {
    log("New speech-to-text job", event.rawEvent());
    // fetch the input file
    const file = await fetchFile(event);
    log(`file: ${file}`);
    if (!file) {
        return undefined;
    }
    // check if file exists
    // if (!fs.existsSync(file)) {
    //     log(`file does not exist: ${file}`);
    //     return undefined;
    // }
    // let fileType: FileTypeResult;
    // try {
    //     fileType = await fileTypeFromFile(file);
    //     log(`fileType: ${fileType}`);
    // } catch (error) {
    //     log(error);
    // }
    const whisperCommand = (resolve, file) => {
        setTimeout(() => {
            if (!fs.existsSync(file)) {
                log(`file does not exist: ${file}`);
                return undefined;
            }
            const formData = new FormData();
            const a = fs.createReadStream(file);
            console.log({ a });
            formData.append("file", a);
            formData.append("model", "whisper-1");
            axios
                .post("http://api.openai.com/v1/audio/transcriptions", formData, {
                headers: {
                    Authorization: process.env["OPENAI_API_KEY"],
                    ...formData.getHeaders(),
                },
            })
                .then((response) => {
                const { text } = response.data;
                console.log({ text });
                resolve(text);
                // Handle response
            })
                .catch((error) => {
                console.log({ error });
                // Handle error
            });
        }, 1000);
    };
    // const input = event.tagValue('i');
    const range = event
        .getMatchingTags("param")
        .find((tag) => tag[1] === "range");
    if (range) {
        return new Promise((resolve) => {
            const startTime = range[2];
            const endTime = range[3];
            const randomName = Math.random().toString(36).substring(7) + ".mp3";
            const command = `ffmpeg -ss ${startTime} -to ${endTime} -i ${file} -vn -acodec copy ${randomName}`;
            console.log({ startTime, endTime, randomName, command });
            exec(command, (error, stderr, stdout) => {
                console.log("ffmpeg", { error, stderr, stdout });
                whisperCommand(resolve, randomName);
            });
        });
    }
    else {
        return new Promise((resolve) => whisperCommand(resolve, file));
    }
}
export async function addAmount(event, amount, includeInvoice = true) {
    const tag = ["amount", amount.toString()];
    if (includeInvoice) {
        const invoice = await createInvoice(amount / 1000);
        tag.push(invoice.payment_request);
    }
    event.tags.push(tag);
}
export async function complete(jobRequest, amount, completeParams, includeInvoice) {
    const jobResult = new NDKEvent(ndk, {
        kind: 68001,
        content: completeParams.output,
        tags: [["status", "success"]],
    });
    if (amount > 0) {
        await addAmount(jobResult, amount, includeInvoice);
    }
    jobResult.tag(jobRequest);
    await jobResult.sign();
    log(jobResult.rawEvent());
    await jobResult.publish();
    return jobResult;
}
export async function fetchFile(event) {
    const inputTags = event.getMatchingTags("i");
    if (inputTags.length !== 1) {
        throw new Error(`Incorrect number of inputs: ${inputTags.length}`);
    }
    return fetchFileFromInput(inputTags[0]);
}
//# sourceMappingURL=speech-to-text.js.map