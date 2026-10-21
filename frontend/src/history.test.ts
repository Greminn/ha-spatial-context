import { describe, expect, it } from "vitest";
import { EditHistory } from "./history";

describe("EditHistory", () => {
  it("steps back and forward through states", () => {
    const history = new EditHistory<string>();
    history.record("a", 0);
    history.record("b", 1000);
    expect(history.undo("c")).toBe("b");
    expect(history.undo("b")).toBe("a");
    expect(history.undo("a")).toBeNull();
    expect(history.redo("a")).toBe("b");
    expect(history.canRedo).toBe(true);
  });

  it("folds a quick burst of edits into one undo step", () => {
    const history = new EditHistory<number>(100, 400);
    history.record(1, 0);
    history.record(2, 100);
    history.record(3, 200);
    expect(history.undo(4)).toBe(1);
    expect(history.canUndo).toBe(false);
  });

  it("drops the redo steps when a new edit is made", () => {
    const history = new EditHistory<string>();
    history.record("a", 0);
    history.undo("b");
    expect(history.canRedo).toBe(true);
    history.record("c", 5000);
    expect(history.canRedo).toBe(false);
  });

  it("keeps only the most recent steps", () => {
    const history = new EditHistory<number>(2, 0);
    for (let i = 0; i < 5; i += 1) history.record(i, i * 1000);
    expect(history.undo(9)).toBe(4);
    expect(history.undo(4)).toBe(3);
    expect(history.undo(3)).toBeNull();
  });

  it("forgets a cancelled edit's step, but only if it is the last one", () => {
    const history = new EditHistory<string>();
    history.record("a", 0);
    history.record("b", 5000);
    history.discardIfLast("a");
    expect(history.undo("c")).toBe("b");
    history.discardIfLast("b");
    expect(history.undo("b")).toBe("a");
  });
});
