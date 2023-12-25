import { useMemo } from "react";

export default function Test({ s, d }: { s: number; d: number }) {
  const ss = useMemo(() => {
    console.warn("1")
    return s + 2;
  }, [s]);
  const dd = useMemo(() => {
    console.warn("2")
    return d + 2;
  }, [d]);
  return (
    <div>
      <span>{ss}</span>
      <span>{dd}</span>
    </div>
  );
}
