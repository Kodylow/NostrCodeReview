import { NDKEvent } from "@nostr-dev-kit/ndk";
import { validateJobRequest } from "../validations/index.js";
import { inProgress } from "../jobs/reactions/in-progress.js";
import axios from "axios";
import { getConfig } from "../config/index.js";

export async function codeReviewJob(event: NDKEvent): Promise<string> {
  console.log("New codeReview job");

  await validateJobRequest(event);

  inProgress(event);

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("calling openai");
      axios
        .post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: getConfig().prompt,
              },
              {
                role: "user",
                content: event.content,
              },
            ],
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ` + process.env["OPENAI_API_KEY"],
            },
          },
        )
        .then((response) => {
          console.log(
            "response from openai: ",
            response.data.choices[0].message.content,
          );
          const content = response.data.choices[0].message.content;
          console.log("content", content);
          resolve(content);
        });
    }, 10000);
  });
}
