import { useThemePreference } from "../../layout/hooks/useThemePreference";
import { useTransparencyPreference } from "../../layout/hooks/useTransparencyPreference";
import { useUiScaleShortcuts } from "../../layout/hooks/useUiScaleShortcuts";
import { useAppSettings } from "../../settings/hooks/useAppSettings";

export function useAppSettingsController() {
  const {
    settings: appSettings,
    setSettings: setAppSettings,
    saveSettings,
    doctor,
    isLoading: appSettingsLoading,
  } = useAppSettings();

  useThemePreference(appSettings.theme);
  const {
    transparencyMode,
    setTransparencyMode,
    availableModes: transparencyModes,
  } = useTransparencyPreference();

  const {
    uiScale,
    scaleShortcutTitle,
    scaleShortcutText,
    queueSaveSettings,
  } = useUiScaleShortcuts({
    settings: appSettings,
    setSettings: setAppSettings,
    saveSettings,
  });

  return {
    appSettings,
    setAppSettings,
    saveSettings,
    queueSaveSettings,
    doctor,
    appSettingsLoading,
    transparencyMode,
    setTransparencyMode,
    transparencyModes,
    uiScale,
    scaleShortcutTitle,
    scaleShortcutText,
  };
}
