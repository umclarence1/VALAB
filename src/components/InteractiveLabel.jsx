import React, { useState, useRef } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

function InteractiveLabel({ 
  position, 
  text, 
  fontSize = 0.04, 
  color = "#2c3e50",
  backgroundColor = "#ffffff",
  itemName = "",
  description = "",
  billboardToCamera = false
}) {
  const [isHovered, setIsHovered] = useState(false)
  const textRef = useRef()
  
  // TTS functionality
  const speakText = (textToSpeak) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel() // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 0.8
      window.speechSynthesis.speak(utterance)
    }
  }

  // Billboard effect - always face camera
  useFrame(({ camera }) => {
    if (textRef.current && billboardToCamera) {
      textRef.current.lookAt(camera.position)
    }
  })

  const handlePointerEnter = (e) => {
    e.stopPropagation()
    setIsHovered(true)
    document.body.style.cursor = 'pointer'
    
    // Speak the item name and description
    const fullDescription = description 
      ? `${itemName}. ${description}` 
      : itemName || text
    speakText(fullDescription)
  }

  const handlePointerLeave = (e) => {
    e.stopPropagation()
    setIsHovered(false)
    document.body.style.cursor = 'auto'
  }

  return (
    <group
      position={position}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {/* Label Background */}
      <mesh position={[0, 0, -0.001]}>
        <planeGeometry args={[text.length * fontSize * 0.8, fontSize * 1.5]} />
        <meshBasicMaterial 
          color={isHovered ? "#e8f4f8" : backgroundColor} 
          transparent 
          opacity={isHovered ? 0.95 : 0.85}
        />
      </mesh>
      
      {/* Text Label */}
      <Text
        ref={textRef}
        fontSize={isHovered ? fontSize * 1.1 : fontSize}
        color={isHovered ? "#2980b9" : color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/roboto-regular.woff"
        maxWidth={2}
      >
        {text}
      </Text>
      
      {/* Hover indicator */}
      {isHovered && (
        <mesh position={[0, 0, -0.002]}>
          <planeGeometry args={[text.length * fontSize * 0.9, fontSize * 1.7]} />
          <meshBasicMaterial 
            color="#3498db" 
            transparent 
            opacity={0.2}
          />
        </mesh>
      )}
    </group>
  )
}

export default InteractiveLabel
