import { useAtom } from "jotai";
import { modalAtoms, ndkAtom, pubKeyAtom, relayAtoms } from "../state";

export function useModal() {
  const [isOpen, setIsOpen] = useAtom(modalAtoms.open);
  const [markdown, setMarkdown] = useAtom(modalAtoms.markdown);

  return {
    isOpen,
    setMarkdown,
    setIsOpen,
    markdown,
  };
}

export function useRelay() {
  const [url, setUrl] = useAtom(relayAtoms.url);
  const [status, setStatus] = useAtom(relayAtoms.status);

  return {
    url,
    setUrl,
    status,
    setStatus,
  };
}

export function useNDK() {
  const [ndk, setNDK] = useAtom(ndkAtom);

  return {
    ndk,
    setNDK,
  };
}

export function usePubKey() {
  const [pubKey, setPubKey] = useAtom(pubKeyAtom);

  return {
    pubKey,
    setPubKey,
  };
}
