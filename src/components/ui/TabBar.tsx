import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { GradientLayer } from './GradientLayer';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PanelScope, radius, size, space, useTheme } from '../../theme';
import { Icon, type IconName } from './Icon';

export interface TabMeta {
  icon: IconName;
  /** Le FAB central lumineux, un seul par barre. */
  primary?: boolean;
}

/** Fabrique la tab bar du design system pour `Tab.Navigator tabBar={…}`. */
export function createTabBar(meta: Record<string, TabMeta>) {
  return function ConvixTabBar(props: BottomTabBarProps) {
    return (
      <PanelScope>
        <TabBar {...props} meta={meta} />
      </PanelScope>
    );
  };
}

function TabBar({ state, descriptors, navigation, meta }: BottomTabBarProps & { meta: Record<string, TabMeta> }) {
  const { colors, shadows } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      accessibilityRole="tablist"
      style={{
        height: size.tabbar + insets.bottom,
        paddingBottom: insets.bottom,
        paddingHorizontal: space[2],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: colors.panel,
      }}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];
        const label = typeof options.title === 'string' ? options.title : route.name;
        const { icon, primary } = meta[route.name] ?? { icon: 'home' };
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        };
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: focused }}
            onPress={onPress}
            style={({ pressed }) =>
              primary ? [styles.fab, { boxShadow: shadows.glowFab, transform: [{ scale: pressed ? 0.94 : 1 }] }] : styles.tab
            }
          >
            {primary ? <FabBackground /> : null}
            <Icon name={icon} size={26} color={primary ? 'onViolet' : focused ? 'ink' : 'inkMuted'} />
            {focused && !primary ? <View style={[styles.dot, { backgroundColor: colors.violet }]} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

/** Dégradé radial orchidée → violet du FAB (le liseré intérieur vient de `glow-fab`). */
function FabBackground() {
  const { colors } = useTheme();
  return (
    <GradientLayer>
      <>
        <Defs>
          <RadialGradient id="fabGlow" cx="0.18" cy="0" rx="1.3" ry="1.2" fx="0.18" fy="0">
            <Stop offset="0" stopColor={colors.orchid} />
            <Stop offset="0.62" stopColor={colors.violet} />
            <Stop offset="1" stopColor={colors.violet} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" rx={radius.md} fill="url(#fabGlow)" />
      </>
    </GradientLayer>
  );
}

const styles = StyleSheet.create({
  tab: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  fab: {
    width: size.fab,
    height: size.fab,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  dot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: radius.full,
  },
});
