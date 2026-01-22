import { useCallback, useEffect, useMemo, useState } from "react";
import { isGlassSupported } from "tauri-plugin-liquid-glass-api";
import type { TransparencyMode } from "../../../types";

const STORAGE_KEY = "transparencyMode";
const LEGACY_STORAGE_KEY = "reduceTransparency";

const isTransparencyMode = (value: string | null): value is TransparencyMode =>
  value === "glass" || value === "blur" || value === "reduced";

const readStoredTransparency = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (isTransparencyMode(stored)) {
    return { mode: stored, hasStoredPreference: true };
  }
  const legacyStored = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (legacyStored === "true") {
    return { mode: "reduced" as TransparencyMode, hasStoredPreference: true };
  }
  return { mode: "blur" as TransparencyMode, hasStoredPreference: false };
};

export function useTransparencyPreference() {
  const [{ mode, hasStoredPreference }, setPreferenceState] = useState(() =>
    readStoredTransparency(),
  );
  const [glassSupported, setGlassSupported] = useState<boolean | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    let cancelled = false;

    const checkSupport = async () => {
      try {
        const supported = await isGlassSupported();
        if (cancelled) {
          return;
        }
        setGlassSupported(supported);
        if (!supported && mode === "glass") {
          setPreferenceState({ mode: "blur", hasStoredPreference });
        }
        if (!hasStoredPreference && supported && mode !== "glass") {
          setPreferenceState({ mode: "glass", hasStoredPreference: false });
        }
      } catch {
        if (!cancelled) {
          setGlassSupported(false);
        }
      }
    };

    void checkSupport();

    return () => {
      cancelled = true;
    };
  }, [hasStoredPreference, mode]);

  const setTransparencyMode = useCallback((next: TransparencyMode) => {
    setPreferenceState({ mode: next, hasStoredPreference: true });
  }, []);

  const availableModes = useMemo<TransparencyMode[]>(() => {
    if (glassSupported) {
      return ["glass", "blur", "reduced"];
    }
    return ["blur", "reduced"];
  }, [glassSupported]);

  return {
    transparencyMode: mode,
    setTransparencyMode,
    availableModes,
    glassSupported,
  };
}
