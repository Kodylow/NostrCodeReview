import { ButtonHTMLAttributes } from "react";
import { tokens } from "../ui";

export default function Button({
  text,
  ...props
}: {
  text: string;
  children?: never;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      css={{
        background: tokens.accentPrimaryDimmer,
        color: tokens.foregroundDefault,
        padding: "4px 8px",
        borderRadius: 8,
        fontSize: 14,
        border: `solid 1px ${tokens.accentPrimaryDimmer}`,
        transition: "0.25s",
        "&:hover::not(:disabled)": {
          background: tokens.accentPrimaryDefault,
        },
        "&:active": {
          borderColor: tokens.accentPrimaryStrongest,
        },
        "&:disabled": {
          opacity: 0.5,
          cursor: "not-allowed",
        },
      }}
    >
      {text}
    </button>
  );
}
