import { View, Text } from 'react-native';

const InfoBox = ({ title, subtitle, containerStyles, titleStyles }) => {
  return (
    <View className={containerStyles}>
      {title ? <Text className={`text-white text-center font-psemibold ${titleStyles}`}>{title}</Text> : null}
      {subtitle ? <Text className="text-sm text-gray-100 text-center font-pregular">{subtitle}</Text> : null}
    </View>
  );
};

export default InfoBox;