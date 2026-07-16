export default function AmbientBlob() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none -z-10 select-none overflow-hidden" 
      style={{
        background: "radial-gradient(circle at 50% 25%, rgba(16, 185, 129, 0.05) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.02) 0%, transparent 50%)",
      }}
      aria-hidden="true"
    />
  )
}
