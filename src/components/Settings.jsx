import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Settings({ show, onClose }) {
  const [settings, setSettings] = useState({
    voiceCommands: true,
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium',
    audioFeedback: true,
    keyboardNavigation: true
  })

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }))
    
    // Apply settings immediately
    applySettings({ ...settings, [setting]: value })
  }

  const applySettings = (newSettings) => {
    const root = document.documentElement
    
    // High contrast mode
    if (newSettings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
    
    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }
    
    // Font size
    root.setAttribute('data-font-size', newSettings.fontSize)
    
    console.log('Settings applied:', newSettings)
  }

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            className="settings-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Settings Panel */}
          <motion.div
            className="settings-panel"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            role="dialog"
            aria-labelledby="settings-title"
            aria-modal="true"
          >
            <div className="settings-header">
              <h2 id="settings-title">Accessibility Settings</h2>
              <button 
                className="close-btn"
                onClick={onClose}
                aria-label="Close settings"
                title="Close Settings"
              >
                ✕
              </button>
            </div>
            
            <div className="settings-content">
              {/* Voice Commands */}
              <div className="setting-group">
                <label htmlFor="voice-commands">
                  <span className="setting-icon">🎤</span>
                  <span className="setting-label">Voice Commands</span>
                </label>
                <input
                  id="voice-commands"
                  type="checkbox"
                  checked={settings.voiceCommands}
                  onChange={(e) => handleSettingChange('voiceCommands', e.target.checked)}
                  className="setting-toggle"
                />
              </div>

              {/* High Contrast */}
              <div className="setting-group">
                <label htmlFor="high-contrast">
                  <span className="setting-icon">🔲</span>
                  <span className="setting-label">High Contrast Mode</span>
                </label>
                <input
                  id="high-contrast"
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                  className="setting-toggle"
                />
              </div>

              {/* Reduced Motion */}
              <div className="setting-group">
                <label htmlFor="reduced-motion">
                  <span className="setting-icon">🔄</span>
                  <span className="setting-label">Reduce Motion</span>
                </label>
                <input
                  id="reduced-motion"
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                  className="setting-toggle"
                />
              </div>

              {/* Font Size */}
              <div className="setting-group">
                <label htmlFor="font-size">
                  <span className="setting-icon">📝</span>
                  <span className="setting-label">Font Size</span>
                </label>
                <select
                  id="font-size"
                  value={settings.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                  className="setting-select"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="extra-large">Extra Large</option>
                </select>
              </div>

              {/* Audio Feedback */}
              <div className="setting-group">
                <label htmlFor="audio-feedback">
                  <span className="setting-icon">🔊</span>
                  <span className="setting-label">Audio Feedback</span>
                </label>
                <input
                  id="audio-feedback"
                  type="checkbox"
                  checked={settings.audioFeedback}
                  onChange={(e) => handleSettingChange('audioFeedback', e.target.checked)}
                  className="setting-toggle"
                />
              </div>

              {/* Keyboard Navigation */}
              <div className="setting-group">
                <label htmlFor="keyboard-nav">
                  <span className="setting-icon">⌨️</span>
                  <span className="setting-label">Keyboard Navigation</span>
                </label>
                <input
                  id="keyboard-nav"
                  type="checkbox"
                  checked={settings.keyboardNavigation}
                  onChange={(e) => handleSettingChange('keyboardNavigation', e.target.checked)}
                  className="setting-toggle"
                />
              </div>
            </div>

            {/* Keyboard Shortcuts Info */}
            <div className="shortcuts-section">
              <h3>Keyboard Shortcuts</h3>
              <div className="shortcuts-list">
                <div className="shortcut-item">
                  <kbd>Space</kbd> <span>Select/Interact</span>
                </div>
                <div className="shortcut-item">
                  <kbd>Tab</kbd> <span>Navigate</span>
                </div>
                <div className="shortcut-item">
                  <kbd>Esc</kbd> <span>Back/Cancel</span>
                </div>
                <div className="shortcut-item">
                  <kbd>H</kbd> <span>Help</span>
                </div>
                <div className="shortcut-item">
                  <kbd>V</kbd> <span>Voice Commands</span>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <button 
              className="reset-btn"
              onClick={() => {
                const defaultSettings = {
                  voiceCommands: true,
                  highContrast: false,
                  reducedMotion: false,
                  fontSize: 'medium',
                  audioFeedback: true,
                  keyboardNavigation: true
                }
                setSettings(defaultSettings)
                applySettings(defaultSettings)
              }}
            >
              Reset to Defaults
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Settings
