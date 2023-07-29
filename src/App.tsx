import { useReplit, useThemeValues } from "@replit/extensions-react";
import { useState, useEffect } from "react";
import "./App.css";
import "websocket-polyfill";
import NDK, { NDKEvent, NDKNip07Signer, NDKSubscription } from "@nostr-dev-kit/ndk";
import type { NostrEvent } from "@nostr-dev-kit/ndk";
import Modal from "react-modal";
import { HandshakeStatus } from "@replit/extensions";
import { useModal, useNDK, usePubKey, useRelay } from "./hooks/state";
import Header from "./components/Header";
import { X } from 'react-feather';
import Loader from "./components/Loader";
import { RELAYS } from "./state";
import RelayUnReadyState from "./components/RelayUnReadyState";
import Select from "./components/Select";
import Button from "./components/Button";
import { checkDiffs } from "./lib/diff";
import { DiffFile } from "diff2html/lib/types";
import Diffs from "./components/Diffs";

function App() {
  const { status } = useReplit();

  // Synchronize replit's theme with the Extension
  const themeValues = useThemeValues();
  const mappedThemeValues = themeValues
    ? Object.entries(themeValues).map(
      ([key, val]) =>
        `--${key.replace(
          /[A-Z]/g,
          (c) => "-" + c.toLowerCase(),
        )}: ${val} !important;`,
    )
    : [];

  const { ndk, setNDK } = useNDK();
  const { status: relayStatus, setStatus, url } = useRelay();
  const { pubKey: pk, setPubKey } = usePubKey();
  const { isOpen, setIsOpen, markdown, setMarkdown } = useModal();

  const [userInput, setUserInput] = useState<string>("");
  const [eventFeed, setEventFeed] = useState<NDKEvent[]>([]);
  const [sub, setSub] = useState<NDKSubscription | null>(null);
  const [diffs, setDiffs] = useState<Array<DiffFile>>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!userInput || !ndk) return;

    e.preventDefault();

    const event = new NDKEvent(ndk, {
      kind: 68005,
      tags: [
        ["j", "code-review"],
        ["bid", "10000"],
      ],
      content: userInput,
    } as NostrEvent);

    await event.sign();

    // check if there is a subscription running here
    if (sub !== null) {
      console.log("already subscribed");
      sub.stop();
    }

    // create a subscription
    const newSub = ndk?.subscribe(
      {
        ...event.filter(),
      },
      { closeOnEose: false, groupable: false },
    );
    newSub!.on("event", (event: NDKEvent) => {
      // add event to event feed
      setEventFeed((prevEventFeed) => [event, ...prevEventFeed]);
    });
    setSub(newSub!);

    console.log("signed_event", event.rawEvent());
    await event.publish();
    setUserInput("");

    console.log("Set userInput to null");
  };
  const handleZap = async (e: NDKEvent) => {
    if (typeof window.webln === "undefined") {
      alert(
        "You need to use a webln enabled browser or extension to zap for these jobs! Download Alby at https://getalby.com !",
      );
      return;
    }

    await window.webln.enable();
    const invoice = e.tags.find((tag) => tag[0] === "amount")?.[2];
    if (invoice) {
      await window.webln.sendPayment(invoice);
    }
  };
  const showDiffs = async () => {
    const dffs = await checkDiffs();

    if (dffs.length) {
      setDiffs(dffs);
    }
  }

  useEffect(() => {
    async function init() {
      if (typeof window.nostr === "undefined") {
        return;
      }
      const pubkey = await window.nostr.getPublicKey();
      console.log("pubkey from Alby: ", pubkey);
      setPubKey(pubkey);

      // const _relay = relayInit(relayUrl);

      // _relay.on('connect', () => {
      //   console.log(`connected to ${_relay.url}`);
      //   setRelayStatus('Connected');
      // });

      // _relay.on('error', () => {
      //   console.log(`failed to connect to ${_relay.url}`);
      //   setRelayStatus('Disconnected');
      // });

      // _relay.connect().then(() => {
      //   let sub = _relay.sub(
      //     [
      //       {
      //         kinds: [68002],
      //         "#p": [pk]
      //       }
      //     ]
      //   )
      //   sub.on('event', event => {
      //     // Extract the customer's pubkey from the incoming event
      //     console.log("saw event", event)
      //     const eventExists = eventFeed.find(e => e.id === event.id);
      //     setEventFeed([event, ...eventFeed]);
      //   });
      // }).catch((error) => {
      //   console.log(`Failed to connect to ${_relay.url}: ${error}`);
      //   setRelayStatus('Failed to connect');
      // });

      // setRelay(_relay);
    }

    init();

    // return () => {
    //   if (relay) {
    //     relay.close();
    //   }
    // };
  }, [pk]);

  // Initialize Relay Connection
  useEffect(() => {
    try {
      const signer = new NDKNip07Signer();
      const ndk = new NDK({
        explicitRelayUrls: RELAYS,
        signer,
      });

      ndk.pool.on("relay:connect", async (r: any) => {
        setStatus("Connected");
        console.log(`Connected to a relay ${r.url}`);
      });

      ndk.pool.on("connect", async () => {
        console.log("connected to something", ndk.pool.stats());
      });

      ndk.connect(2500);

      setNDK(ndk);
    } catch (e) {
      console.log("error", e);
    }
  }, [url]);

  if (status === HandshakeStatus.Error) {
    return <div className="flex-row" css={{ alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
      <div className="flex-col m8" css={{ alignItems: 'center', maxWidth: 240 }}>
        <X size={48} />
        <h1 css={{ fontSize: 24, fontWeight: 600 }}>Failed to Connect</h1>
        <p css={{ textAlign: 'center' }}>This extension couldn't establish a connection with Replit.</p>
      </div>
    </div>;
  } else if (status === HandshakeStatus.Loading) {
    return <div className="flex-row" css={{ alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
      <Loader size={32} />
    </div>;
  }

  return (
    <>
      <style>{`:root, .replit-ui-theme-root {
${mappedThemeValues.join("\n")}
        }`}</style>
      <main className="flex-col">
        <Header />

        <div className="flex-col m8" css={{ padding: 8 }}>
          {relayStatus !== "Connected" ? <RelayUnReadyState /> : null}

          <div className="flex-col m8">
            <div className="flex-row m8">
              <Select options={["Code Review"]} css={{ flexGrow: 1 }} />
              <Button text="I'm Ready" onClick={showDiffs} />
            </div>
          </div>
        </div>

        {diffs.length > 0 ? <Diffs diffs={diffs} /> : null}

        <Modal
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          contentLabel="Content Modal"
        >
          <button onClick={() => setIsOpen(false)}>Close</button>
          <div dangerouslySetInnerHTML={{ __html: markdown }}></div>
        </Modal>

        {eventFeed.length > 0 && (
          <div className="w-full mx-2 p-4 bg-white rounded-lg text-gray-800 my-4 overflow-y-auto">
            {eventFeed.map((event, index) => {
              // Extract the necessary tag data
              const amountSats =
                Number(event.tags.find((tag) => tag[0] === "amount")?.[1]) / 1000;

              return (
                <div
                  key={index}
                  className="border-b border-gray-200 p-2 flex justify-between items-center"
                >
                  <div>
                    <div>
                      <strong>From:</strong> {event.author.npub}
                    </div>
                    <div>
                      <strong>Content:</strong>
                      {event.content.length > 150 ? (
                        <button
                          onClick={() => {
                            setIsOpen(true);
                            setMarkdown(event.content);
                          }}
                        >
                          Click for completed job output!
                        </button>
                      ) : (
                        event.content
                      )}
                    </div>
                  </div>
                  {amountSats && (
                    <button
                      className="px-2 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
                      onClick={() => handleZap(event)} // assuming you're passing the event id to handleZap
                    >
                      Zap ⚡ {amountSats}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

export default App;
