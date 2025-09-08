const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative">
        {/* Outer pulsing ring */}
        <div className="w-20 h-20 rounded-full border-2 border-cyan-400 animate-pulse shadow-[0_0_20px_#22d3ee]" />
        
        {/* Inner rotating ring */}
        <div className="absolute inset-2 w-16 h-16 rounded-full border-t-2 border-cyan-300 animate-spin shadow-[0_0_15px_#67e8f9]" />
        
        {/* Center dot */}
        <div className="absolute inset-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-cyan-200 rounded-full animate-pulse shadow-[0_0_10px_#a5f3fc]" />
      </div>
      
      {/* Loading text */}
      <div className="absolute mt-32 text-cyan-300 font-mono text-sm animate-pulse tracking-widest">
        LOADING...
      </div>
    </div>
  )
}

export default LoadingScreen