import { atom } from 'jotai';
import { RelayStatus } from './components/RelayConnection';
import NDK from "@nostr-dev-kit/ndk";

export const RELAYS = [
  "wss://relay.damus.io",
  // "wss://nostr.drss.io",
  "wss://nostr.swiss-enigma.ch",
  "wss://relay.f7z.io",
];

export const relayAtoms = {
  url: atom<string | undefined>(RELAYS[3]),
  status: atom<RelayStatus>("Pending"),
}

export const ndkAtom = atom<NDK | null>(null);

export const modalAtoms = {
  open: atom(false),
  markdown: atom(""),
}

export const pubKeyAtom = atom<string | undefined>(undefined);