import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import LobbyScene from './components/LobbyScene'
import ChemistryLab from './components/SimpleChemLab'
import Settings from './components/Settings'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('lobby')
  const [showSettings, setShowSettings] = useState(false)

  const handleLabSelect = (labType) => {
    // Add transition delay for smooth animation
    setTimeout(() => setCurrentView(labType), 800)
  }

  return (
    <div className="app" role="main">
      <AnimatePresence mode="wait">
        {currentView === 'lobby' && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: -45 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="scene-container"
          >
            <Canvas 
              camera={{ position: [0, 1.6, 5], fov: 75 }}
              aria-label="Virtual Science Labs Lobby"
              role="img"
            >
              <LobbyScene onLabSelect={handleLabSelect} />
            </Canvas>
          </motion.div>
        )}
        
        {currentView === 'chemistry' && (
          <motion.div
            key="chemistry"
            initial={{ scale: 0, rotateY: 180, opacity: 0 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            exit={{ scale: 0.8, rotateY: -90, opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="scene-container"
          >
            <ChemistryLab onBack={() => setCurrentView('lobby')} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Settings Panel */}
      <Settings show={showSettings} onClose={() => setShowSettings(false)} />
      
      {/* Settings Icon */}
      <motion.button
        className="settings-btn"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowSettings(true)}
        aria-label="Open Settings"
        title="Settings"
      >
        ⚙️
      </motion.button>

      {/* Back Button (only show in lab views) */}
      {currentView !== 'lobby' && (
        <motion.button
          className="back-btn"
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentView('lobby')}
          aria-label="Back to Lobby"
          title="Back to Lobby"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          🏠 Back
        </motion.button>
      )}

      {/* Accessibility Announcement */}
      <div 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
        role="status"
      >
        {currentView === 'lobby' ? 'You are in the Virtual Science Labs lobby. Choose a laboratory to enter.' : 
         currentView === 'chemistry' ? 'You have entered the Chemistry Laboratory.' : ''}
      </div>
    </div>
  )
}

export default App
