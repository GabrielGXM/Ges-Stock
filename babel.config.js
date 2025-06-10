
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Este plugin é essencial para a câmera funcionar corretamente
      'react-native-reanimated/plugin',
    ],
  };
};