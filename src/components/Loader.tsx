import { tokens } from "../ui";

export default function Loader({ size = 16 }: { size?: number }) {
  return (
    <div
      css={{
        padding: 4,
        borderRadius: 24,
        border: `3px solid ${tokens.foregroundDimmer}`,
        borderLeft: "3px solid transparent",
        width: size,
        height: size,
        animation: `spin 1s infinite linear`,
      }}
    />
  );
}
