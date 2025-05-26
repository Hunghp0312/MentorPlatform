// src/utils/cn.ts or src/utils/classNames.ts

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
