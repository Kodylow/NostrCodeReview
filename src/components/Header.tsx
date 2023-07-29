import { tokens } from "../ui";
import RelayConnection from "./RelayConnection";

const styles = {
  container: {
    padding: 8,
    borderBottom: `solid 1px ${tokens.backgroundHigher}`,
  },
  spacer: { flexGrow: 1 },
  name: {
    fontWeight: 600,
  },
};

export default function Header() {
  return (
    <div className="flex-row m8" css={styles.container}>
      <span css={styles.name}>Nostr.it</span>

      <div css={styles.spacer} />

      <RelayConnection />
    </div>
  );
}
