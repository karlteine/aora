module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel', 
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'], // Set the root path to the project root
          alias: {
            '@components': './components', // Adjust this to your actual folder structure
            '@constants': './constants',
            '@screens': './screens',
            '@lib': './lib',
            '@context': './context',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
};
