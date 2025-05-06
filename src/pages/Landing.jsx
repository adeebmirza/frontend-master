import { useState, useEffect } from 'react'
import './App.css'
import NewsPage from './NewsPage.jsx'
import SearchPage from '../Routes/SearchPage'
import Header from '../components/Header'

function Landing() {
  const [scrolled, setScrolled] = useState(false)
  const [showNews, setShowNews] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const hour = now.getHours()

      // Greeting logic
      if (hour < 12) {
        setGreeting('Good Morning')
      } else if (hour < 18) {
        setGreeting('Good Afternoon')
      } else {
        setGreeting('Good Evening')
      }

      const timeOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }
      const dateOptions = {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }

      const time = now.toLocaleTimeString('en-IN', timeOptions)
      const date = now.toLocaleDateString('en-IN', dateOptions)
      setCurrentTime(`${time} | ${date}`)
    }, 1000)

    const handleScroll = () => {
      if (window.scrollY > 100 && !scrolled) {
        setScrolled(true)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      clearInterval(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [scrolled])

  useEffect(() => {
    if (scrolled) {
      const delay = setTimeout(() => {
        setShowNews(true)
      }, 500)
      return () => clearTimeout(delay)
    }
  }, [scrolled])

  return (
    <>
      {/* Background */}
      <div
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501854140801-50d01698950b')"
        }}
      />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen text-white pt-16">
        <div className="flex flex-col items-center justify-center h-screen relative">

          {/* Time + Date + Greeting */}
          <div className="absolute top-8 right-8 bg-black/60 px-6 py-4 rounded-lg shadow-xl backdrop-blur-md text-right">
            <div className="text-sm sm:text-base text-gray-200 font-light">{greeting}</div>
            <div className="text-lg sm:text-2xl font-bold text-white tracking-wide">{currentTime}</div>
          </div>

          {/* Search Input */}
          <div className="absolute bottom-36 w-full max-w-md px-4">
            <input
              type="text"
              onFocus={() => setShowSearch(true)}
              className="w-full p-4 rounded-xl bg-white/80 backdrop-blur-md text-gray-900 placeholder-gray-600 shadow-2xl border-none focus:ring-4 focus:ring-blue-400 focus:outline-none transition-all duration-200"
              placeholder="🔍 Search the web privately..."
            />
          </div>
        </div>

        {/* Spacer for scroll trigger */}
        <div style={{ height: '150vh' }} />

        {/* News Page */}
        {showNews && (
          <div className="fade-in-up">
            <NewsPage />
          </div>
        )}

        {/* SearchPage Overlay */}
        {showSearch && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-start pt-20">
            <div className="bg-white w-full max-w-3xl rounded-lg shadow-2xl p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl font-bold"
                onClick={() => setShowSearch(false)}
              >
                &times;
              </button>
              <SearchPage />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Landing
