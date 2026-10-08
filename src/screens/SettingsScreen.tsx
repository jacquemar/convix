import React, { useState } from 'react';
import { Pressable, ScrollView, Switch, View } from 'react-native';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, Button, Divider, HeroCard, Icon, SectionTitle, Sheet } from '../components/ui';
import { FocusStatusBar } from '../components/FocusStatusBar';
import { currencyService } from '../services/currency.service';
import { pair } from '../services/my-currencies';
import type { ThemePreference } from '../storage/preferences';
import { space, Text, useTheme } from '../theme';
import { formatTime } from '../utils/amount';
import { fr } from '../i18n/fr';

const THEMES: { value: ThemePreference; label: string; hint?: string }[] = [
  { value: 'system', label: fr.settings.themeSystem, hint: fr.settings.themeSystemHint },
  { value: 'night', label: fr.settings.themeNight },
  { value: 'day', label: fr.settings.themeDay },
];

export function SettingsScreen() {
  const { colors, preference, setPreference, hapticsEnabled, setHapticsEnabled } = useTheme();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = async () => {
    setRefreshing(true);
    setMessage(null);
    try {
      await Promise.all(pair.get().map((code) => currencyService.refresh(code)));
      setMessage(fr.settings.refreshDone(formatTime(new Date().toISOString())));
    } catch (error) {
      console.error(error);
      setMessage(fr.settings.refreshFailed);
    } finally {
      setRefreshing(false);
    }
  };

  const clearCache = () => {
    currencyService.clearCache();
    setMessage(fr.settings.cacheCleared);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.heroBase }}>
      <FocusStatusBar style="light" />
      <HeroCard flat style={{ paddingTop: insets.top + space[4], paddingBottom: space[4] }}>
        <AppHeader subtitle={fr.settings.subtitle} />
      </HeroCard>
      <Sheet>
        <ScrollView contentContainerStyle={{ paddingHorizontal: space[6], paddingBottom: space[12] }}>
          <SectionTitle first>{fr.settings.appearance}</SectionTitle>
          <View accessibilityRole="radiogroup">
            {THEMES.map((option) => (
              <Choice
                key={option.value}
                label={option.label}
                hint={option.hint}
                selected={preference === option.value}
                onPress={() => setPreference(option.value)}
              />
            ))}
          </View>

          <Divider />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[4], minHeight: 60 }}>
            <View style={{ flex: 1 }}>
              <Text>{fr.settings.feedback}</Text>
              <Text variant="text-caption" color="inkMuted">
                {fr.settings.feedbackHint}
              </Text>
            </View>
            <Switch
              accessibilityLabel={fr.settings.feedback}
              value={hapticsEnabled}
              onValueChange={setHapticsEnabled}
              trackColor={{ true: colors.violet, false: colors.lineStrong }}
              thumbColor={colors.panel}
              ios_backgroundColor={colors.lineStrong}
            />
          </View>

          <Divider />
          <SectionTitle first>{fr.settings.data}</SectionTitle>
          <View style={{ gap: space[3] }}>
            <Button label={fr.settings.refresh} variant="secondary" icon="refresh" block loading={refreshing} onPress={refresh} />
            <Button label={fr.settings.clearCache} variant="ghost" block onPress={clearCache} />
            {message ? (
              <Text variant="text-caption" color="inkMuted" accessibilityLiveRegion="polite" style={{ textAlign: 'center' }}>
                {message}
              </Text>
            ) : null}
          </View>

          <Divider />
          <SectionTitle first>{fr.settings.about}</SectionTitle>
          <Info label={fr.settings.version} value={Constants.expoConfig?.version ?? '—'} />
          <Info label={fr.settings.source} value={fr.settings.sourceValue} />
          <Info label={fr.settings.altSource} value={fr.settings.altSourceValue} />
          <Info label={fr.settings.cfa} value={fr.settings.cfaValue} />
          <Info label={fr.settings.privacy} value={fr.settings.privacyValue} />
        </ScrollView>
      </Sheet>
    </View>
  );
}

function Choice({ label, hint, selected, onPress }: { label: string; hint?: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={hint ? `${label}, ${hint}` : label}
      onPress={onPress}
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: space[3], minHeight: 52, opacity: pressed ? 0.7 : 1 })}
    >
      <View style={{ flex: 1 }}>
        <Text variant={selected ? 'text-strong' : 'text-body'} color={selected ? 'accent' : 'ink'}>
          {label}
        </Text>
        {hint ? (
          <Text variant="text-caption" color="inkMuted">
            {hint}
          </Text>
        ) : null}
      </View>
      {selected && <Icon name="check" size={20} color="accent" />}
    </Pressable>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View accessible style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space[4], paddingVertical: space[3] }}>
      <Text>{label}</Text>
      <Text color="inkMuted" style={{ flexShrink: 1, textAlign: 'right' }}>
        {value}
      </Text>
    </View>
  );
}
