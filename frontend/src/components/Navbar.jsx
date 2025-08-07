import React from 'react'
import {motion} from 'framer-motion'

const Navbar = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'resume', label: 'Experience' },
    { id: 'contact', label: 'Contact' }
  ]

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-lg border-b border-slate-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="text-2xl font-bold text-green-400 cursor-pointer"
            whileHover={{ scale: 1.1, rotate: 5 }}
            onClick={() => setCurrentPage('home')}
          >
            SM
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  currentPage === item.id 
                    ? 'text-white' 
                    : 'text-gray-300 hover:text-green-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentPage === item.id && (
                  <motion.div
                    className="absolute inset-0 bg-green-500 rounded-lg shadow-lg shadow-green-500/25"
                    layoutId="activeTab"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              className="text-gray-300 hover:text-green-400 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>

          {/* Hire Me Button */}
          <motion.button
            onClick={() => setCurrentPage('contact')}
            className="hidden sm:block bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 10px 30px rgba(34, 197, 94, 0.3)" 
            }}
            whileTap={{ scale: 0.95 }}
          >
            Hire Me
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
