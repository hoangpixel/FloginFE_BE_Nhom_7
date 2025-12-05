import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react(), tailwind()],
    base: '/', // Mặc định: Chạy ở root (cho Test chạy ngon)
  }

  // Chỉ khi chạy lệnh "build" thì mới đổi đường dẫn cho GitHub Pages
  if (command === 'build') {
    config.base = '/FloginFE_BE_Nhom_7/'
  }

  return config
})