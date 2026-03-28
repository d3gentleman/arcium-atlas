export default function KeystaticNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-black text-white font-sans">
      <div className="max-w-md w-full border border-white/10 bg-white/5 backdrop-blur-md p-8 rounded-lg shadow-2xl">
        <h1 className="text-3xl font-bold mb-4 tracking-tight text-primary">ENTRY NOT FOUND</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          The item you were looking for no longer exists or has been deleted from the database.
        </p>
        <div className="flex flex-col gap-3">
          <a 
            href="/keystatic" 
            className="px-6 py-3 bg-white text-black font-bold rounded uppercase tracking-wider hover:bg-gray-200 transition-colors"
          >
            Back to Dashboard
          </a>
          <a 
            href="/keystatic/collection/ecosystemProjects" 
            className="text-sm text-gray-500 hover:text-white transition-colors underline underline-offset-4"
          >
            Return to Ecosystem Projects
          </a>
        </div>
      </div>
    </div>
  );
}
