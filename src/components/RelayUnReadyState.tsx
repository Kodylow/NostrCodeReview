import { useState } from "react";
import { useRelay } from "../hooks/state";
import { tokens } from "../ui";
import Button from "./Button";
import Input from "./Input";

export default function RelayUnReadyState() {
  const { setUrl, url } = useRelay();
  const [value, setValue] = useState(url || "");

  return (
    <div
      className="flex-col m8"
      css={{
        padding: 8,
        background: tokens.backgroundHigher,
        borderRadius: 8,
      }}
    >
      <p>
        Could not locate and connect to a Nostr Websocket URL. Try manually or{" "}
        <a href="https://getalby.com" target="_blank">
          Set up Alby
        </a>
      </p>

      <div className="flex-row m8">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="wss://..."
          css={{ flexGrow: 1 }}
        />
        <Button
          text="Connect"
          onClick={() => setUrl(value)}
          disabled={value.length === 0 || value === url}
        />
      </div>
    </div>
  );
}
