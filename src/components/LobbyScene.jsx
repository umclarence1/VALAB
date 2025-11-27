import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Box, Cylinder, Sphere, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function LobbyScene({ onLabSelect }) {
  const [hoveredDoor, setHoveredDoor] = useState(null)
  const [selectedDoor, setSelectedDoor] = useState(null)
  const [doorAnimation, setDoorAnimation] = useState({})
  const [soundEnabled, setSoundEnabled] = useState(true)
  
  const chemDoorRef = useRef()
  const physicsDoorRef = useRef()
  const biologyDoorRef = useRef()
  const logoRef = useRef()
  const particlesRef = useRef([])
  const ambientParticlesRef = useRef([])
  const glowParticlesRef = useRef([])
  
  // Sound effects using Web Audio API
  const playSound = (type) => {
    if (!soundEnabled) return
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      const createTone = (frequency, duration, volume = 0.1) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + duration)
      }
      
      switch (type) {
        case 'hover':
          createTone(800, 0.1, 0.05)
          break
        case 'click':
          createTone(1200, 0.2, 0.08)
          setTimeout(() => createTone(1600, 0.15, 0.06), 100)
          break
        case 'locked':
          createTone(300, 0.3, 0.04)
          setTimeout(() => createTone(250, 0.2, 0.03), 150)
          break
        case 'ambient':
          createTone(200 + Math.random() * 100, 0.5, 0.02)
          break
      }
    } catch (error) {
      console.log('Sound not available:', error)
    }
  }

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Enhanced floating animation for doors
    if (chemDoorRef.current) {
      const baseY = Math.sin(time * 0.5) * 0.1
      const hoverBoost = hoveredDoor === 'chemistry' ? Math.sin(time * 3) * 0.05 : 0
      chemDoorRef.current.position.y = baseY + hoverBoost
      
      // Subtle rotation when hovered
      if (hoveredDoor === 'chemistry') {
        chemDoorRef.current.rotation.y = Math.sin(time * 2) * 0.02
      }
    }
    
    if (physicsDoorRef.current) {
      const baseY = Math.sin(time * 0.5 + 1) * 0.1
      physicsDoorRef.current.position.y = baseY
    }
    
    if (biologyDoorRef.current) {
      const baseY = Math.sin(time * 0.5 + 2) * 0.1
      biologyDoorRef.current.position.y = baseY
    }
    
    // Rotating logo with interactive speed
    if (logoRef.current) {
      const baseSpeed = 0.2
      const interactiveSpeed = hoveredDoor ? 0.8 : baseSpeed
      logoRef.current.rotation.y = time * interactiveSpeed
    }

    // Animate ambient particles
    ambientParticlesRef.current.forEach((particle, i) => {
      if (particle.current) {
        const speed = 0.5 + i * 0.1
        particle.current.position.y += Math.sin(time * speed + i) * 0.002
        particle.current.position.x += Math.cos(time * speed * 0.7 + i) * 0.001
        particle.current.rotation.x = time * (0.3 + i * 0.05)
        particle.current.rotation.z = time * (0.2 + i * 0.03)
        
        // Fade in/out effect
        const opacity = 0.3 + Math.sin(time * 2 + i) * 0.2
        if (particle.current.material) {
          particle.current.material.opacity = Math.max(0.1, opacity)
        }
      }
    })

    // Animate glow particles around active door
    glowParticlesRef.current.forEach((particle, i) => {
      if (particle.current && hoveredDoor === 'chemistry') {
        const radius = 3 + Math.sin(time * 2 + i) * 0.5
        const angle = time * 2 + i * (Math.PI * 2 / 8)
        particle.current.position.x = -6 + Math.cos(angle) * radius
        particle.current.position.z = -14 + Math.sin(angle) * radius
        particle.current.position.y = Math.sin(time * 3 + i) * 2
        
        // Pulsing effect
        const scale = 0.5 + Math.sin(time * 4 + i) * 0.3
        particle.current.scale.setScalar(scale)
      } else if (particle.current) {
        // Hide particles when not hovering
        particle.current.scale.setScalar(0)
      }
    })

    // Play ambient sounds occasionally
    if (Math.random() < 0.001) {
      playSound('ambient')
    }
  })

  const handleDoorClick = (labType) => {
    if (labType === 'chemistry') {
      setSelectedDoor(labType)
      setDoorAnimation({ [labType]: 'opening' })
      
      // Play opening sound effect
      playSound('click')
      
      // Enhanced visual feedback
      console.log(`🚪 Opening ${labType} lab with dramatic animation...`)
      
      // Add opening animation delay
      setTimeout(() => {
        onLabSelect(labType)
      }, 1200)
    } else {
      // Play locked sound for unavailable labs
      playSound('locked')
      
      // Show "coming soon" feedback for other labs
      console.log(`🔒 ${labType} lab coming soon!`)
    }
  }

  const handleDoorHover = (labType) => {
    if (hoveredDoor !== labType) {
      setHoveredDoor(labType)
      
      // Play hover sound effect
      if (labType === 'chemistry') {
        playSound('hover')
      }
      
      document.body.style.cursor = labType === 'chemistry' ? 'pointer' : 'not-allowed'
    }
  }

  const handleDoorLeave = () => {
    setHoveredDoor(null)
    document.body.style.cursor = 'auto'
  }

  return (
    <>
      {/* Enhanced Lighting Setup */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-10, 5, 5]} intensity={0.8} color="#00ff88" />
      <spotLight 
        position={[0, 15, 0]} 
        angle={0.4} 
        penumbra={1} 
        intensity={1.5}
        color="#ffffff"
        castShadow
      />
      <pointLight position={[0, 8, -12]} intensity={0.6} color="#3498db" />
      
      {/* Camera Controls */}
      <OrbitControls 
        enablePan={false} 
        enableZoom={false}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 4}
        autoRotate={false}
        enableDamping={true}
        dampingFactor={0.05}
      />
      
      {/* Enhanced Lab Floor */}
      <Box args={[35, 0.3, 35]} position={[0, -1.15, 0]} receiveShadow>
        <meshPhysicalMaterial 
          color="#34495e" 
          metalness={0.1}
          roughness={0.8}
        />
      </Box>
      
      {/* Floor Grid Pattern */}
      {[...Array(7)].map((_, i) => (
        <Box key={`grid-x-${i}`} args={[35, 0.01, 0.05]} position={[0, -0.9, -15 + i * 5]}>
          <meshBasicMaterial color="#00ff88" opacity={0.2} transparent />
        </Box>
      ))}
      {[...Array(7)].map((_, i) => (
        <Box key={`grid-z-${i}`} args={[0.05, 0.01, 35]} position={[-15 + i * 5, -0.9, 0]}>
          <meshBasicMaterial color="#00ff88" opacity={0.2} transparent />
        </Box>
      ))}
      
      {/* Enhanced Walls */}
      <Box args={[0.3, 8, 35]} position={[-17.5, 3, 0]}>
        <meshPhysicalMaterial 
          color="#2c3e50" 
          metalness={0.2}
          roughness={0.7}
        />
      </Box>
      <Box args={[0.3, 8, 35]} position={[17.5, 3, 0]}>
        <meshPhysicalMaterial 
          color="#2c3e50" 
          metalness={0.2}
          roughness={0.7}
        />
      </Box>
      <Box args={[35, 8, 0.3]} position={[0, 3, -17.5]}>
        <meshPhysicalMaterial 
          color="#2c3e50" 
          metalness={0.2}
          roughness={0.7}
        />
      </Box>
      
      {/* Chemistry Lab Door - Interactive and Available */}
      <group
        ref={chemDoorRef}
        position={[-6, 0, -14]}
        onClick={() => handleDoorClick('chemistry')}
        onPointerOver={() => handleDoorHover('chemistry')}
        onPointerOut={handleDoorLeave}
      >
        {/* Main Door */}
        <Box args={[3.2, 6.4, 0.4]} castShadow receiveShadow>
          <meshPhysicalMaterial 
            color={hoveredDoor === 'chemistry' ? '#00ff88' : '#2980b9'} 
            emissive={hoveredDoor === 'chemistry' ? '#003d1a' : '#001122'}
            metalness={0.3}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </Box>
        
        {/* Door Frame */}
        <Box args={[3.6, 6.8, 0.3]} position={[0, 0, -0.15]}>
          <meshPhysicalMaterial 
            color="#34495e" 
            metalness={0.8}
            roughness={0.2}
          />
        </Box>
        
        {/* Glowing Border when hovered */}
        {hoveredDoor === 'chemistry' && (
          <>
            <Box args={[3.8, 0.1, 0.1]} position={[0, 3.3, 0.2]}>
              <meshBasicMaterial color="#00ff88" />
            </Box>
            <Box args={[3.8, 0.1, 0.1]} position={[0, -3.3, 0.2]}>
              <meshBasicMaterial color="#00ff88" />
            </Box>
            <Box args={[0.1, 6.6, 0.1]} position={[-1.8, 0, 0.2]}>
              <meshBasicMaterial color="#00ff88" />
            </Box>
            <Box args={[0.1, 6.6, 0.1]} position={[1.8, 0, 0.2]}>
              <meshBasicMaterial color="#00ff88" />
            </Box>
          </>
        )}
        
        {/* Door Handle */}
        <Sphere args={[0.15]} position={[1.3, 0, 0.25]}>
          <meshPhysicalMaterial 
            color="#ffd700" 
            metalness={1} 
            roughness={0.05}
            emissive={hoveredDoor === 'chemistry' ? '#332200' : '#000000'}
          />
        </Sphere>
        
        {/* Door Window */}
        <Box args={[1, 1.5, 0.1]} position={[0, 1, 0.25]}>
          <meshPhysicalMaterial 
            color="#87ceeb" 
            transparent 
            opacity={0.3}
            metalness={0}
            roughness={0}
            transmission={0.9}
          />
        </Box>
        
        {/* Lab Icon and Text */}
        <Text
          position={[0, 0.5, 0.3]}
          fontSize={0.6}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          🧪
        </Text>
        
        <Text
          position={[0, -0.3, 0.3]}
          fontSize={0.35}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          CHEMISTRY LAB
        </Text>
        
        {/* Status Indicator */}
        <Text
          position={[0, -1, 0.3]}
          fontSize={0.2}
          color="#00ff88"
          anchorX="center"
          anchorY="middle"
        >
          ● AVAILABLE
        </Text>
        
        {/* Interactive Prompt */}
        {hoveredDoor === 'chemistry' && (
          <Text
            position={[0, -2.2, 0.4]}
            fontSize={0.25}
            color="#00ff88"
            anchorX="center"
            anchorY="middle"
          >
            ▶ CLICK TO ENTER
          </Text>
        )}
      </group>
      
      {/* Physics Lab Door (Coming Soon) */}
      <group 
        ref={physicsDoorRef}
        position={[0, 0, -14]}
        onClick={() => handleDoorClick('physics')}
        onPointerOver={() => handleDoorHover('physics')}
        onPointerOut={handleDoorLeave}
      >
        <Box args={[3.2, 6.4, 0.4]} castShadow>
          <meshPhysicalMaterial 
            color={hoveredDoor === 'physics' ? '#444455' : '#7f8c8d'} 
            opacity={0.7}
            transparent
            metalness={0.2}
            roughness={0.8}
          />
        </Box>
        
        {/* Locked Frame */}
        <Box args={[3.6, 6.8, 0.3]} position={[0, 0, -0.15]}>
          <meshPhysicalMaterial 
            color="#2c2c2c" 
            metalness={0.5}
            roughness={0.5}
          />
        </Box>
        
        <Text
          position={[0, 0.8, 0.3]}
          fontSize={0.6}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
        >
          ⚡
        </Text>
        
        <Text
          position={[0, 0, 0.3]}
          fontSize={0.35}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
        >
          PHYSICS LAB
        </Text>
        
        <Text
          position={[0, -0.8, 0.3]}
          fontSize={0.4}
          color="#e74c3c"
          anchorX="center"
          anchorY="middle"
        >
          🔒
        </Text>
        
        <Text
          position={[0, -1.4, 0.3]}
          fontSize={0.25}
          color="#e74c3c"
          anchorX="center"
          anchorY="middle"
        >
          COMING SOON
        </Text>
        
        {hoveredDoor === 'physics' && (
          <Text
            position={[0, -2.2, 0.4]}
            fontSize={0.2}
            color="#e74c3c"
            anchorX="center"
            anchorY="middle"
          >
            Under Development
          </Text>
        )}
      </group>
      
      {/* Biology Lab Door (Coming Soon) */}
      <group 
        ref={biologyDoorRef}
        position={[6, 0, -14]}
        onClick={() => handleDoorClick('biology')}
        onPointerOver={() => handleDoorHover('biology')}
        onPointerOut={handleDoorLeave}
      >
        <Box args={[3.2, 6.4, 0.4]} castShadow>
          <meshPhysicalMaterial 
            color={hoveredDoor === 'biology' ? '#445544' : '#7f8c8d'} 
            opacity={0.7}
            transparent
            metalness={0.2}
            roughness={0.8}
          />
        </Box>
        
        {/* Locked Frame */}
        <Box args={[3.6, 6.8, 0.3]} position={[0, 0, -0.15]}>
          <meshPhysicalMaterial 
            color="#2c2c2c" 
            metalness={0.5}
            roughness={0.5}
          />
        </Box>
        
        <Text
          position={[0, 0.8, 0.3]}
          fontSize={0.6}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
        >
          🔬
        </Text>
        
        <Text
          position={[0, 0, 0.3]}
          fontSize={0.35}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
        >
          BIOLOGY LAB
        </Text>
        
        <Text
          position={[0, -0.8, 0.3]}
          fontSize={0.4}
          color="#e74c3c"
          anchorX="center"
          anchorY="middle"
        >
          🔒
        </Text>
        
        <Text
          position={[0, -1.4, 0.3]}
          fontSize={0.25}
          color="#e74c3c"
          anchorX="center"
          anchorY="middle"
        >
          COMING SOON
        </Text>
        
        {hoveredDoor === 'biology' && (
          <Text
            position={[0, -2.2, 0.4]}
            fontSize={0.2}
            color="#e74c3c"
            anchorX="center"
            anchorY="middle"
          >
            Under Development
          </Text>
        )}
      </group>

      {/* Enhanced Welcome Text and Logo */}
      <group ref={logoRef} position={[0, 5, -8]}>
        {/* Main Title */}
        <Text
          position={[0, 1.5, 0]}
          fontSize={1.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          VIRTUAL SCIENCE LABS
        </Text>
        
        {/* Subtitle */}
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.4}
          color="#bdc3c7"
          anchorX="center"
          anchorY="middle"
        >
          Empowering Accessible Education
        </Text>
        
        {/* DI-Hack Badge */}
        <Box args={[3, 0.6, 0.1]} position={[0, 0, 0]}>
          <meshPhysicalMaterial 
            color="#00ff88" 
            emissive="#003d1a"
            metalness={0.3}
            roughness={0.2}
          />
        </Box>
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.5}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          DI-HACK 2025
        </Text>
        
        {/* Instruction Text */}
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.35}
          color="#ecf0f1"
          anchorX="center"
          anchorY="middle"
        >
          Select a Laboratory to Begin
        </Text>
        
        {/* Interactive Status */}
        <Text
          position={[0, -1.3, 0]}
          fontSize={0.25}
          color={hoveredDoor ? "#00ff88" : "#7f8c8d"}
          anchorX="center"
          anchorY="middle"
        >
          {hoveredDoor ? `Hovering: ${hoveredDoor.toUpperCase()} LAB` : "Move cursor over doors"}
        </Text>
        
        {/* Enhanced Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <Sphere 
            key={`logo-particle-${i}`}
            args={[0.02 + Math.random() * 0.03]} 
            position={[
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 3,
              Math.random() * 3
            ]}
            ref={(el) => {
              if (!ambientParticlesRef.current[i]) ambientParticlesRef.current[i] = { current: null }
              ambientParticlesRef.current[i].current = el
            }}
          >
            <meshBasicMaterial 
              color={['#00ff88', '#3498db', '#e74c3c', '#f39c12', '#9b59b6', '#e67e22'][i % 6]}
              opacity={0.6}
              transparent
            />
          </Sphere>
        ))}
        
        {/* Rotating Ring */}
        <mesh position={[0, 0, -1]} rotation={[0, 0, 0]}>
          <torusGeometry args={[2.5, 0.05, 8, 100]} />
          <meshBasicMaterial color="#00ff88" opacity={0.3} transparent />
        </mesh>
      </group>
      
      {/* Information Panel */}
      <Box args={[10, 2.5, 0.2]} position={[0, -0.5, -5]}>
        <meshPhysicalMaterial 
          color="#2c3e50" 
          opacity={0.9} 
          transparent 
          metalness={0.1}
          roughness={0.8}
        />
      </Box>
      
      <Text
        position={[0, -0.1, -4.8]}
        fontSize={0.3}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
        maxWidth={9}
      >
        EMPOWERING STUDENTS WITH DISABILITIES
      </Text>
      <Text
        position={[0, -0.5, -4.8]}
        fontSize={0.25}
        color="#ecf0f1"
        anchorX="center"
        anchorY="middle"
        maxWidth={9}
      >
        Through Virtual Learning Technology
      </Text>
      <Text
        position={[0, -0.9, -4.8]}
        fontSize={0.2}
        color="#bdc3c7"
        anchorX="center"
        anchorY="middle"
        maxWidth={9}
      >
        ♿ Accessible • 🎮 Interactive • 🤝 Inclusive • 🔊 Voice Enabled
      </Text>
      
      {/* Usage Statistics */}
      <Text
        position={[-3, -1.3, -4.8]}
        fontSize={0.15}
        color="#95a5a6"
        anchorX="center"
        anchorY="middle"
      >
        🧪 1 Lab Available
      </Text>
      <Text
        position={[0, -1.3, -4.8]}
        fontSize={0.15}
        color="#95a5a6"
        anchorX="center"
        anchorY="middle"
      >
        ⚡ Real-time 3D
      </Text>
      <Text
        position={[3, -1.3, -4.8]}
        fontSize={0.15}
        color="#95a5a6"
        anchorX="center"
        anchorY="middle"
      >
        🛡️ Safety First
      </Text>
      
      {/* Ambient Environment Particles */}
      {[...Array(20)].map((_, i) => (
        <Sphere 
          key={`ambient-${i}`}
          args={[0.01 + Math.random() * 0.02]} 
          position={[
            (Math.random() - 0.5) * 30,
            Math.random() * 6,
            (Math.random() - 0.5) * 25
          ]}
          ref={(el) => {
            if (!ambientParticlesRef.current[i + 12]) ambientParticlesRef.current[i + 12] = { current: null }
            ambientParticlesRef.current[i + 12].current = el
          }}
        >
          <meshBasicMaterial 
            color={['#00ff88', '#3498db', '#ffffff', '#f39c12'][i % 4]}
            opacity={0.3}
            transparent
          />
        </Sphere>
      ))}
      
      {/* Glow Particles for Chemistry Door */}
      {[...Array(8)].map((_, i) => (
        <Sphere 
          key={`glow-${i}`}
          args={[0.05]} 
          position={[-6, 0, -14]}
          ref={(el) => {
            if (!glowParticlesRef.current[i]) glowParticlesRef.current[i] = { current: null }
            glowParticlesRef.current[i].current = el
          }}
        >
          <meshBasicMaterial 
            color="#00ff88"
            opacity={0.8}
            transparent
          />
        </Sphere>
      ))}
      
      {/* Energy Streams */}
      {[...Array(6)].map((_, i) => (
        <group key={`stream-${i}`}>
          <Cylinder 
            args={[0.005, 0.005, 15]} 
            position={[
              -12 + i * 4,
              3,
              -10
            ]}
            rotation={[0, 0, Math.PI / 6]}
          >
            <meshBasicMaterial 
              color="#00ff88"
              opacity={0.2}
              transparent
            />
          </Cylinder>
        </group>
      ))}
      
      {/* Floor Light Rings */}
      {[-6, 0, 6].map((x, i) => (
        <mesh 
          key={`ring-${i}`} 
          position={[x, -0.85, -14]} 
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[2, 0.02, 8, 64]} />
          <meshBasicMaterial 
            color={i === 0 ? "#00ff88" : "#7f8c8d"}
            opacity={i === 0 && hoveredDoor === 'chemistry' ? 0.8 : 0.3}
            transparent
          />
        </mesh>
      ))}
      
      {/* Holographic Data Streams */}
      {hoveredDoor === 'chemistry' && [...Array(5)].map((_, i) => (
        <Box 
          key={`data-${i}`}
          args={[0.02, 0.02, 2]} 
          position={[
            -6 + (Math.random() - 0.5) * 4,
            Math.random() * 4,
            -12 + Math.random() * 2
          ]}
        >
          <meshBasicMaterial 
            color="#00ff88"
            opacity={0.6}
            transparent
          />
        </Box>
      ))}
      
      {/* Sound Control Button */}
      <group position={[12, 4, 0]}>
        <Box 
          args={[1, 0.5, 0.1]}
          onClick={() => setSoundEnabled(!soundEnabled)}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
        >
          <meshPhysicalMaterial 
            color={soundEnabled ? "#00ff88" : "#e74c3c"}
            opacity={0.8}
            transparent
          />
        </Box>
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {soundEnabled ? "🔊 ON" : "🔇 OFF"}
        </Text>
        <Text
          position={[0, -0.4, 0]}
          fontSize={0.1}
          color="#bdc3c7"
          anchorX="center"
          anchorY="middle"
        >
          Sound Effects
        </Text>
      </group>
    </>
  )
}

export default LobbyScene
