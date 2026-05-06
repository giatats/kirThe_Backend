export const metadata = {
  title: "ESP32 Temperature Monitor",
  description: "Real-time IoT dashboard"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}