import { useState, useEffect, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { authService } from '../services/authService'
import { authUtils } from '@/utils/auth'
import { APP_CONFIG } from '@/config/constants'
import { useTheme } from '@/hooks/useTheme'
import { getErrorMessage } from '@/types/error'

export default function LoginPage(): JSX.Element {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Debug: Log API base URL
  useEffect(() => {
    console.log('🔍 API Base URL:', import.meta.env.VITE_API_BASE_URL)
  }, [])
  const [showPassword, setShowPassword] = useState(false)
  const [formVisible, setFormVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setFormVisible(true), 300)
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error('Email harus diisi')
      return
    }

    if (!password.trim()) {
      toast.error('Kata sandi harus diisi')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Format email tidak valid')
      return
    }

    setIsLoading(true)

    try {
      const response = await authService.login({ email, password })
      
      authUtils.setToken(response.data.token)
      authUtils.setUser(response.data.user)
      
      toast.success('Login berhasil!', {
        description: `Selamat datang, ${response.data.user.name}`
      })
      
      navigate('/dashboard')
    } catch (err) {
      toast.error('Login gagal', {
        description: getErrorMessage(err)
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 relative overflow-hidden ${
      theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient blobs - Larger and more visible */}
        <div
          className={`absolute -top-40 -left-40 w-150 h-150 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-purple-600/50' : 'bg-purple-400/60'
          }`}
          style={{ animation: 'blob 8s ease-in-out infinite' }}
        />
        <div
          className={`absolute top-1/4 -right-32 w-125 h-125 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-fuchsia-600/45' : 'bg-fuchsia-400/55'
          }`}
          style={{ animation: 'blob 8s ease-in-out infinite 2s' }}
        />
        <div
          className={`absolute -bottom-32 left-1/4 w-112.5 h-112.5 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-violet-600/40' : 'bg-violet-400/50'
          }`}
          style={{ animation: 'blob 8s ease-in-out infinite 4s' }}
        />
        <div
          className={`absolute bottom-1/3 -left-24 w-100 h-100 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-indigo-600/40' : 'bg-indigo-400/50'
          }`}
          style={{ animation: 'blob 10s ease-in-out infinite 1s' }}
        />
        <div
          className={`absolute top-[45%] right-[30%] w-87.5 h-87.5 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-pink-600/35' : 'bg-pink-400/45'
          }`}
          style={{ animation: 'blob 9s ease-in-out infinite 3s' }}
        />

        {/* Floating geometric shapes - More visible */}
        <div
          className={`absolute top-[15%] left-[10%] w-24 h-24 border-[3px] rounded-lg ${
            theme === 'dark' ? 'border-purple-400/40 shadow-lg shadow-purple-500/20' : 'border-purple-500/50 shadow-lg shadow-purple-400/30'
          }`}
          style={{ animation: 'float 6s ease-in-out infinite', transform: 'rotate(45deg)' }}
        />
        <div
          className={`absolute top-[20%] right-[15%] w-20 h-20 border-[3px] rounded-full ${
            theme === 'dark' ? 'border-fuchsia-400/40 shadow-lg shadow-fuchsia-500/20' : 'border-fuchsia-500/50 shadow-lg shadow-fuchsia-400/30'
          }`}
          style={{ animation: 'float 7s ease-in-out infinite 1s' }}
        />
        <div
          className={`absolute bottom-[20%] right-[10%] w-28 h-28 border-[3px] rounded-lg ${
            theme === 'dark' ? 'border-violet-400/35 shadow-lg shadow-violet-500/20' : 'border-violet-500/45 shadow-lg shadow-violet-400/30'
          }`}
          style={{ animation: 'float 8s ease-in-out infinite 2s', transform: 'rotate(12deg)' }}
        />
        <div
          className={`absolute bottom-[15%] left-[20%] w-16 h-16 border-[3px] rounded-full ${
            theme === 'dark' ? 'border-indigo-400/40 shadow-lg shadow-indigo-500/20' : 'border-indigo-500/50 shadow-lg shadow-indigo-400/30'
          }`}
          style={{ animation: 'float 5s ease-in-out infinite 3s' }}
        />
        <div
          className={`absolute top-[60%] left-[5%] w-12 h-12 rounded-sm ${
            theme === 'dark' ? 'bg-purple-500/25 shadow-lg shadow-purple-500/30' : 'bg-purple-400/35 shadow-lg shadow-purple-400/40'
          }`}
          style={{ animation: 'float 9s ease-in-out infinite 0.5s', transform: 'rotate(30deg)' }}
        />
        <div
          className={`absolute top-[10%] left-[50%] w-14 h-14 rounded-sm ${
            theme === 'dark' ? 'bg-fuchsia-500/20 shadow-lg shadow-fuchsia-500/30' : 'bg-fuchsia-400/30 shadow-lg shadow-fuchsia-400/40'
          }`}
          style={{ animation: 'float 7s ease-in-out infinite 2.5s', transform: 'rotate(-20deg)' }}
        />
        <div
          className={`absolute bottom-[35%] right-[25%] w-10 h-10 rounded-full ${
            theme === 'dark' ? 'bg-violet-400/25 shadow-lg shadow-violet-500/30' : 'bg-violet-400/35 shadow-lg shadow-violet-400/40'
          }`}
          style={{ animation: 'float 6s ease-in-out infinite 4s' }}
        />
        <div
          className={`absolute top-[40%] left-[15%] w-8 h-8 rounded-full ${
            theme === 'dark' ? 'bg-pink-400/20 shadow-md shadow-pink-500/25' : 'bg-pink-400/30 shadow-md shadow-pink-400/35'
          }`}
          style={{ animation: 'float 6.5s ease-in-out infinite 1.5s' }}
        />
        <div
          className={`absolute bottom-[45%] right-[8%] w-10 h-10 border-2 rounded-lg ${
            theme === 'dark' ? 'border-purple-400/30' : 'border-purple-500/40'
          }`}
          style={{ animation: 'float 7.5s ease-in-out infinite 2.8s', transform: 'rotate(-15deg)' }}
        />

        {/* Dot grid pattern - More visible */}
        <div
          className={`absolute inset-0 ${theme === 'dark' ? 'opacity-[0.08]' : 'opacity-[0.1]'}`}
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Radial gradient overlay for depth */}
        <div
          className={`absolute inset-0 ${
            theme === 'dark'
              ? 'bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(15,23,42,0.6)_70%)]'
              : 'bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(249,250,251,0.5)_70%)]'
          }`}
        />
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(var(--tw-rotate, 0deg)); }
          50% { transform: translateY(-20px) rotate(var(--tw-rotate, 0deg)); }
        }
      `}</style>

      <div className="flex min-h-screen items-center justify-center p-4 relative z-10">
        <div className={`w-full max-w-6xl overflow-hidden rounded-2xl transition-all duration-500 ${
          theme === 'dark' ? 'bg-slate-800 shadow-xl shadow-slate-700/20' : 'bg-white shadow-xl'
        } ${formVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          
          {/* Theme toggle */}
          <button 
            onClick={toggleTheme}
            className={`absolute right-4 top-4 rounded-full p-2 transition-colors z-10 ${
              theme === 'dark' 
                ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Left side - Images Collage */}
            <div className="hidden md:block w-full md:w-3/5 bg-linear-to-br from-purple-600 via-violet-600 to-fuchsia-600 p-6">
              <div className="grid grid-cols-2 grid-rows-3 gap-4 h-full">
                {/* Top left - Image */}
                <div className="overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400" 
                    alt="Cafe" 
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
                
                {/* Top right - Stat */}
                <div 
                  className="rounded-xl flex flex-col justify-center items-center p-6 text-white bg-white/20 backdrop-blur-sm"
                  style={{
                    transform: formVisible ? 'translateY(0)' : 'translateY(20px)',
                    opacity: formVisible ? 1 : 0,
                    transition: 'transform 0.6s ease-out, opacity 0.6s ease-out',
                    transitionDelay: '0.2s',
                  }}
                >
                  <h2 className="text-5xl font-bold mb-2">500+</h2>
                  <p className="text-center text-sm">Pesanan berhasil diproses setiap bulan</p>
                </div>
                
                {/* Middle left - Image */}
                <div className="overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400" 
                    alt="Coffee" 
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
                
                {/* Middle right - Image */}
                <div className="overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400" 
                    alt="Cafe interior" 
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
                
                {/* Bottom left - Stat */}
                <div 
                  className="rounded-xl flex flex-col justify-center items-center p-6 text-white bg-white/20 backdrop-blur-sm"
                  style={{
                    transform: formVisible ? 'translateY(0)' : 'translateY(20px)',
                    opacity: formVisible ? 1 : 0,
                    transition: 'transform 0.6s ease-out, opacity 0.6s ease-out',
                    transitionDelay: '0.4s',
                  }}
                >
                  <h2 className="text-5xl font-bold mb-2">50+</h2>
                  <p className="text-center text-sm">Menu tersedia untuk pelanggan setia kami</p>
                </div>
                
                {/* Bottom right - Image */}
                <div className="overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400" 
                    alt="Food" 
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              </div>
            </div>
            
            {/* Right side - Sign in form */}
            <div 
              className={`w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center relative ${
                theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'
              }`}
              style={{
                transform: formVisible ? 'translateX(0)' : 'translateX(20px)',
                opacity: formVisible ? 1 : 0,
                transition: 'transform 0.6s ease-out, opacity 0.6s ease-out'
              }}
            >
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 right-10 w-32 h-32 border-2 border-purple-600 rounded-full"></div>
                <div className="absolute bottom-20 left-10 w-24 h-24 border-2 border-fuchsia-600 rotate-45"></div>
                <div className="absolute top-1/2 right-20 w-16 h-16 border-2 border-violet-600 rounded-lg rotate-12"></div>
              </div>

              <div className="mb-8 relative z-10">
                <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Masuk ke<br />
                  <span className="text-purple-600">{APP_CONFIG.name}</span>
                </h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {APP_CONFIG.description}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10" noValidate>
                <div className="space-y-2">
                  <label 
                    htmlFor="email" 
                    className={`block text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full rounded-lg border py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                      theme === 'dark' 
                        ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                    }`}
                    placeholder="Masukkan email"
                  />
                </div>
                
                <div className="space-y-2">
                  <label 
                    htmlFor="password" 
                    className={`block text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}
                  >
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`block w-full rounded-lg border py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                        theme === 'dark' 
                          ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                      }`}
                      placeholder="Masukkan kata sandi"
                    />
                    <button
                      type="button"
                      className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      }`}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex w-full justify-center rounded-lg py-3 px-4 text-sm font-semibold text-white shadow-sm transition-all duration-300 bg-linear-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    isLoading ? 'cursor-not-allowed opacity-70' : ''
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sedang masuk...
                    </span>
                  ) : (
                    'Masuk Sekarang'
                  )}
                </button>
              </form>

              <p className={`text-center text-xs mt-8 relative z-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {APP_CONFIG.copyright}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
