import { useRelay } from "../hooks/state";
import { tokens } from "../ui";
import Loader from "./Loader";

export type RelayStatus = "Disconnected" | "Pending" | "Connected";

const styles = {
  container: {
    borderRadius: 64,
    background: tokens.backgroundHigher,
    padding: "4px 8px",
    alignItems: "center",
  },
  text: {
    fontSize: 13,
  },
  dotOuter: (status: RelayStatus) => ({
    padding: 4,
    borderRadius: 24,
    background:
      status === "Connected"
        ? tokens.accentPositiveDimmer
        : tokens.backgroundHighest,
    width: 16,
    height: 16,
  }),
  dotInner: (status: RelayStatus) => ({
    padding: 4,
    borderRadius: 8,
    background:
      status === "Connected"
        ? tokens.accentPositiveDefault
        : tokens.backgroundHigher,
    width: 8,
    height: 8,
  }),
};

export default function RelayConnection() {
  const { status } = useRelay();

  return (
    <div className="flex-row m8" css={styles.container}>
      {status !== "Connected" ? (
        <span css={styles.text}>Relay Status:</span>
      ) : null}
      <span css={styles.text}>{status}</span>
      {status === "Pending" ? (
        <Loader />
      ) : (
        <div css={styles.dotOuter(status)}>
          <div css={styles.dotInner(status)} />
        </div>
      )}
    </div>
  );
}
