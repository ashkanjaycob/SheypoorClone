import { describe, it, expect } from "vitest";
import { MASCOT_OFFSETS } from "../Components/AI/SheypoorMascot";

describe("7. Mascot Calibration & Layer Offsets Validation", () => {
  it("matches user specified calibrated offsets", () => {
    // Hat
    expect(MASCOT_OFFSETS.hatY).toBe(-10);
    expect(MASCOT_OFFSETS.hatX).toBe(0);
    expect(MASCOT_OFFSETS.hatScale).toBe(0.7);

    // Body
    expect(MASCOT_OFFSETS.bodyY).toBe(16);
    expect(MASCOT_OFFSETS.bodyX).toBe(1);
    expect(MASCOT_OFFSETS.bodyScale).toBe(0.7);

    // Left Hand
    expect(MASCOT_OFFSETS.leftHandY).toBe(35);
    expect(MASCOT_OFFSETS.leftHandX).toBe(9);
    expect(MASCOT_OFFSETS.leftHandScale).toBe(0.7);

    // Right Hand
    expect(MASCOT_OFFSETS.rightHandY).toBe(30);
    expect(MASCOT_OFFSETS.rightHandX).toBe(-11);
    expect(MASCOT_OFFSETS.rightHandScale).toBe(0.7);

    // Head
    expect(MASCOT_OFFSETS.headScale).toBe(1);
    expect(MASCOT_OFFSETS.headY).toBe(0);
    expect(MASCOT_OFFSETS.headX).toBe(0);
  });

  it("ensures all coordinate values are valid numbers", () => {
    Object.entries(MASCOT_OFFSETS).forEach(([key, value]) => {
      expect(typeof value).toBe("number");
      expect(Number.isFinite(value)).toBe(true);
    });
  });
});
