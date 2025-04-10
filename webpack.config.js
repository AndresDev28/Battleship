import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
//const { sourceType } = require('./babel.config');

export default {
  mode: 'development', // Cambia a 'production' para el build final
  entry: './index.js', // Tu punto de entrada principal
  output: {
    filename: 'main.[contenthash].js', // Añade hash para evitar caché
    path: path.resolve(process.cwd(), 'dist'), // Carpeta de salida
    clean: true, // Limpia la carpeta dist antes de cada build
  },
  devtool: 'inline-source-map', // Para facilitar la depuración en desarrollo
  devServer: {
    static: './dist', // Servir archivos desde la carpeta dist
    open: true, // Abrir navegador automáticamente
    hot: true, // Recarga en caliente (Hot Module Replacement)
  },
  module: {
    rules: [
      {
        test: /\.css$/i, // Para archivos .css
        use: ['style-loader', 'css-loader'], // Carga CSS en el DOM
      },
      {
        test: /\.m?js$/, // Para archivos .js o .mjs
        exclude: /node_modules/, // No transpilar dependencias
        use: {
          loader: 'babel-loader', // Usar Babel
          options: {
            presets: ['@babel/preset-env'], // Asegúrate que esto coincide con tu babel.config.js si es necesario
            sourceType: 'module'
          }
        }
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i, // Si tuvieras imágenes
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // Usa tu index.html como plantilla
      title: 'Battleship', // Puedes establecer el título aquí o dejar el de la plantilla
    }),
  ],
  // Añadir optimización para producción (opcional pero recomendado)
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //   },
  // },
};