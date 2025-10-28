export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased" style={{maxWidth:800,margin:"40px auto",padding:"0 16px"}}>
        {children}
      </body>
    </html>
  )
}
