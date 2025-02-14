import '@/styles/global.scss'
import { AuthProvider } from "../context/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="pt-br">
        <body>
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
