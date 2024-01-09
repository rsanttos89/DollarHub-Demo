import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
            >
              <View style={{ alignItems: 'center', paddingHorizontal: 4, paddingVertical: 4 }}>
                <View style={[styles.innerButton, {backgroundColor: isFocused ? '#312F3A' : 'transparent'}]}>
                  <FontAwesome 
                    color={isFocused ? '#C17C0D' : '#fff'}
                    name={options.tabBarIcon}
                    size={24}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    borderRadius: 40,
    flexDirection: 'row',
    backgroundColor: '#191a18f6',
    marginBottom: Platform.OS === 'ios' ? 38 : 24,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
    bottom: 0,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: 'transparent',
  },
  innerButton: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4, 
    borderRadius: 99,
  }
});
