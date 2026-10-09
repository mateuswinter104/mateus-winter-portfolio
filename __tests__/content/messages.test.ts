import en from "../../messages/en.json";
import pt from "../../messages/pt.json";

type Tree = Record<string, unknown> | unknown[];

function shape(value: unknown, path = ""): string[] {
  if (Array.isArray(value)) {
    return [`${path}[${value.length}]`, ...value.flatMap((item, index) => shape(item, `${path}[${index}]`))];
  }
  if (value && typeof value === "object") {
    return Object.entries(value as Tree).flatMap(([key, child]) => shape(child, path ? `${path}.${key}` : key));
  }
  return [path];
}

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

describe("translations", () => {
  it("have exactly the same keys and list sizes in English and Portuguese", () => {
    expect(shape(pt).sort()).toEqual(shape(en).sort());
  });

  it("never leave a string empty", () => {
    expect(strings(en).filter((text) => !text.trim())).toEqual([]);
    expect(strings(pt).filter((text) => !text.trim())).toEqual([]);
  });

  it("keep placeholders aligned between languages", () => {
    const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort();
    const enStrings = shape(en);
    for (const path of enStrings) {
      const read = (tree: unknown) =>
        path
          .replace(/\[(\d+)\]/g, ".$1")
          .split(".")
          .filter(Boolean)
          .reduce<unknown>((node, key) => (node as Record<string, unknown>)?.[key], tree);
      const enValue = read(en);
      const ptValue = read(pt);
      if (typeof enValue === "string" && typeof ptValue === "string") {
        expect({ path, placeholders: placeholders(ptValue) }).toEqual({ path, placeholders: placeholders(enValue) });
      }
    }
  });
});
