import { InputHTMLAttributes } from "react";
import { tokens } from "../ui";

export default function Input({
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      css={{
        background: tokens.backgroundHigher,
        border: `1px solid ${tokens.backgroundHighest}`,
        borderRadius: 8,
        outline: "none",
        "&:focus": {
          border: `1px solid ${tokens.accentPrimaryDefault}`,
        },
        padding: "4px 8px",
        fontSize: 14,
      }}
    />
  );
}
