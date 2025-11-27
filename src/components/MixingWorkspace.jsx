import React, { useState, useRef, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Text, Box, Cylinder, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import chemicalData from '../data/chemicalMixtures.json'

// Helper function to determine if chemical should use dropper
const useDropper = (chemicalId) => {
  const chemical = chemicalData.chemicals[chemicalId]
  if (!chemical) return false
  // Only liquid indicators use droppers (excluding litmus paper and test strips)
  return chemical.hazard === 'indicator' && 
         chemical.state === 'liquid' &&
         !['Litmus'].includes(chemicalId)
}

// Helper function to determine if chemical is litmus paper
const isLitmusPaper = (chemicalId) => {
  return chemicalId === 'Litmus'
}

// Static Camera Component
function StaticCamera() {
  const { camera } = useThree()
  
  useEffect(() => {
    camera.position.set(0, 2, 4)
    camera.lookAt(0, 1, 0)
    camera.updateProjectionMatrix()
  }, [camera])
  
  return null
}

// Flask Component with Liquid
function Flask({ chemicalId, position, isDraggable, onPointerDown, onPointerMove, onPointerUp, rotation, liquidScale }) {
  const [isHovered, setIsHovered] = useState(false)
  const groupRef = useRef()
  
  const chemical = chemicalData.chemicals[chemicalId]
  if (!chemical) return null

  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={rotation || [0, 0, 0]}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerOver={() => { 
        setIsHovered(true)
        if (isDraggable) document.body.style.cursor = 'grab'
      }}
      onPointerOut={() => { 
        setIsHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Flask Body */}
      <Cylinder args={[0.3, 0.2, 0.8, 32]} position={[0, 0.4, 0]}>
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1.0}
        />
      </Cylinder>

      {/* Flask Neck */}
      <Cylinder args={[0.12, 0.12, 0.3, 32]} position={[0, 0.95, 0]}>
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1.0}
        />
      </Cylinder>

      {/* Liquid inside flask */}
      <Cylinder 
        args={[0.28, 0.19, liquidScale * 0.5, 32]} 
        position={[0, 0.1 + (liquidScale * 0.25), 0]}
      >
        <meshPhysicalMaterial
          color={chemical.color}
          transparent
          opacity={0.7}
          roughness={0.2}
          metalness={0.1}
        />
      </Cylinder>

      {/* Label */}
      <Box args={[0.4, 0.15, 0.01]} position={[0, 0.4, 0.31]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <Text
        position={[0, 0.4, 0.32]}
        fontSize={0.08}
        color="#2c3e50"
        anchorX="center"
        anchorY="middle"
      >
        {chemicalId}
      </Text>

      {/* Hover glow */}
      {isHovered && isDraggable && (
        <Sphere args={[0.4]} position={[0, 0.5, 0]}>
          <meshBasicMaterial color="#00ff88" transparent opacity={0.2} />
        </Sphere>
      )}
    </group>
  )
}

// Dropper Component for Indicators
function Dropper({ chemicalId, position, isDraggable, onPointerDown, onPointerMove, onPointerUp, rotation, liquidScale, isSqueezed }) {
  const [isHovered, setIsHovered] = useState(false)
  const groupRef = useRef()
  
  const chemical = chemicalData.chemicals[chemicalId]
  if (!chemical) return null

  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={rotation || [0, 0, 0]}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerOver={() => { 
        setIsHovered(true)
        if (isDraggable) document.body.style.cursor = 'grab'
      }}
      onPointerOut={() => { 
        setIsHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Dropper Bulb (Rubber top) */}
      <Sphere args={[0.15, 16, 16]} position={[0, 0.9, 0]} scale={[1, isSqueezed ? 0.7 : 1, 1]}>
        <meshStandardMaterial color="#ff6b6b" roughness={0.8} />
      </Sphere>

      {/* Dropper Glass Body */}
      <Cylinder args={[0.08, 0.08, 0.7, 16]} position={[0, 0.4, 0]}>
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1.0}
        />
      </Cylinder>

      {/* Dropper Tip */}
      <Cylinder args={[0.03, 0.01, 0.2, 16]} position={[0, 0.05, 0]}>
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1.0}
        />
      </Cylinder>

      {/* Liquid inside dropper */}
      <Cylinder 
        args={[0.06, 0.06, liquidScale * 0.4, 16]} 
        position={[0, 0.25 + (liquidScale * 0.2), 0]}
      >
        <meshPhysicalMaterial
          color={chemical.color}
          transparent
          opacity={0.8}
          roughness={0.2}
          metalness={0.1}
        />
      </Cylinder>

      {/* Falling Drop (when squeezed and tilted) */}
      {isSqueezed && rotation && Math.abs(rotation[2]) > 0.3 && (
        <Sphere args={[0.04, 8, 8]} position={[0, -0.2, 0]}>
          <meshPhysicalMaterial
            color={chemical.color}
            transparent
            opacity={0.9}
            roughness={0.1}
          />
        </Sphere>
      )}

      {/* Label */}
      <Box args={[0.25, 0.1, 0.01]} position={[0, 0.4, 0.09]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <Text
        position={[0, 0.4, 0.1]}
        fontSize={0.05}
        color="#2c3e50"
        anchorX="center"
        anchorY="middle"
      >
        {chemicalId}
      </Text>

      {/* Hover glow */}
      {isHovered && isDraggable && (
        <Sphere args={[0.25]} position={[0, 0.5, 0]}>
          <meshBasicMaterial color="#00ff88" transparent opacity={0.2} />
        </Sphere>
      )}
    </group>
  )
}

// Litmus Paper Component - for dipping into solutions
function LitmusPaper({ chemicalId, position, isDraggable, onPointerDown, onPointerMove, onPointerUp, rotation }) {
  const [isHovered, setIsHovered] = useState(false)
  const groupRef = useRef()
  
  const chemical = chemicalData.chemicals[chemicalId]
  if (!chemical) return null

  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={rotation || [0, 0, 0]}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerOver={() => { 
        setIsHovered(true)
        if (isDraggable) document.body.style.cursor = 'grab'
      }}
      onPointerOut={() => { 
        setIsHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Paper Strip Holder */}
      <Box args={[0.08, 0.15, 0.05]} position={[0, 0.85, 0]}>
        <meshStandardMaterial color="#555555" />
      </Box>

      {/* Litmus Paper Strip */}
      <Box args={[0.06, 0.8, 0.01]} position={[0, 0.4, 0]}>
        <meshStandardMaterial 
          color={chemical.color}
          roughness={0.9}
        />
      </Box>

      {/* Label */}
      <Text
        position={[0, 0, 0.02]}
        fontSize={0.05}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, 0]}
      >
        Litmus
      </Text>

      {/* Hover glow */}
      {isHovered && isDraggable && (
        <Sphere args={[0.15]} position={[0, 0.5, 0]}>
          <meshBasicMaterial color="#00ff88" transparent opacity={0.2} />
        </Sphere>
      )}
    </group>
  )
}

// Mixing Beaker Component
function MixingBeaker({ position, mixedColor, liquidLevel, containedChemicals, showEffervescence, showPrecipitate }) {
  const [isHovered, setIsHovered] = useState(false)
  const bubblesRef = useRef([])

  useEffect(() => {
    if (showEffervescence) {
      bubblesRef.current = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 0.5,
        z: (Math.random() - 0.5) * 0.5,
        y: liquidLevel * 0.4,
        speed: 0.01 + Math.random() * 0.01,
      }))
    }
  }, [showEffervescence, liquidLevel])

  useFrame(() => {
    if (showEffervescence && bubblesRef.current.length > 0) {
      bubblesRef.current.forEach(bubble => {
        bubble.y += bubble.speed
        if (bubble.y > liquidLevel * 0.8) {
          bubble.y = 0.1
        }
      })
    }
  })

  return (
    <group 
      position={position}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      {/* Beaker Body */}
      <Cylinder args={[0.35, 0.4, 1, 32]} position={[0, 0.5, 0]}>
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.25}
          roughness={0.1}
          metalness={0.05}
          clearcoat={1.0}
          side={THREE.DoubleSide}
        />
      </Cylinder>

      {/* Beaker Rim */}
      <Cylinder args={[0.37, 0.37, 0.05, 32]} position={[0, 1.02, 0]}>
        <meshPhysicalMaterial
          color="#87ceeb"
          transparent
          opacity={0.4}
          roughness={0.2}
        />
      </Cylinder>

      {/* Measurement Lines */}
      {[0.3, 0.5, 0.7, 0.9].map((height, i) => (
        <Cylinder key={i} args={[0.36, 0.36, 0.01, 32]} position={[0, height, 0]}>
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} />
        </Cylinder>
      ))}

      {/* Liquid inside beaker */}
      {liquidLevel > 0 && (
        <Cylinder 
          args={[0.33, 0.38, liquidLevel * 0.8, 32]} 
          position={[0, 0.1 + (liquidLevel * 0.4), 0]}
        >
          <meshPhysicalMaterial
            color={mixedColor}
            transparent
            opacity={0.75}
            roughness={0.2}
            metalness={0.1}
          />
        </Cylinder>
      )}

      {/* Effervescence Bubbles */}
      {showEffervescence && liquidLevel > 0 && bubblesRef.current.map((bubble) => (
        <Sphere 
          key={bubble.id}
          args={[0.02 + Math.random() * 0.02, 8, 8]} 
          position={[bubble.x, 0.1 + bubble.y, bubble.z]}
        >
          <meshStandardMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.6}
            emissive="#ffffff"
            emissiveIntensity={0.2}
          />
        </Sphere>
      ))}

      {/* Precipitate Layer */}
      {showPrecipitate && liquidLevel > 0 && (
        <Cylinder 
          args={[0.32, 0.37, 0.08, 32]} 
          position={[0, 0.08, 0]}
        >
          <meshStandardMaterial
            color="#f0f0f0"
            transparent
            opacity={0.9}
            roughness={0.8}
          />
        </Cylinder>
      )}

      {/* Hover highlight */}
      {isHovered && (
        <Cylinder args={[0.45, 0.5, 1.1, 32]} position={[0, 0.5, 0]}>
          <meshBasicMaterial color="#00ff88" transparent opacity={0.1} />
        </Cylinder>
      )}

      {/* Beaker Label */}
      <Text
        position={[0, -0.1, 0]}
        fontSize={0.1}
        color="#ffffff"
        anchorX="center"
      >
        Mixing Beaker
      </Text>

      {/* Chemical names */}
      {containedChemicals.length > 0 && (
        <Text
          position={[0, 0.15, 0.45]}
          fontSize={0.06}
          color="#00ff88"
          anchorX="center"
        >
          {containedChemicals.map(id => chemicalData.chemicals[id]?.name || id).join(' + ')}
        </Text>
      )}
    </group>
  )
}

// Mixing Workspace Scene with Pouring Mechanics
function MixingWorkspaceScene({ selectedChemicals, onMixComplete }) {
  const [isDragging, setIsDragging] = useState(false)
  const [draggedFlask, setDraggedFlask] = useState(null)
  const [flaskPositions, setFlaskPositions] = useState({})
  const [flaskRotations, setFlaskRotations] = useState({})
  const [liquidScales, setLiquidScales] = useState({})
  const [beakerLiquidLevel, setBeakerLiquidLevel] = useState(0)
  const [beakerColor, setBeakerColor] = useState('#ffffff')
  const [targetBeakerColor, setTargetBeakerColor] = useState('#ffffff')
  const [beakerContents, setBeakerContents] = useState([])
  const [hasReacted, setHasReacted] = useState(false)
  const [showEffervescence, setShowEffervescence] = useState(false)
  const [showPrecipitate, setShowPrecipitate] = useState(false)
  const [squeezedDroppers, setSqueezedDroppers] = useState(new Set())
  
  const dragPlaneRef = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0))
  const raycasterRef = useRef(new THREE.Raycaster())
  const offsetRef = useRef(new THREE.Vector3())
  const isPouringRef = useRef(false)
  
  const { camera } = useThree()

  // Initialize flask positions and liquid scales
  useEffect(() => {
    const positions = {}
    const scales = {}
    const rotations = {}
    
    selectedChemicals.forEach((id, index) => {
      const x = index === 0 ? -1.5 : 1.5
      positions[id] = new THREE.Vector3(x, 0.8, 0)
      scales[id] = 1
      rotations[id] = [0, 0, 0]
    })
    
    setFlaskPositions(positions)
    setLiquidScales(scales)
    setFlaskRotations(rotations)
  }, [selectedChemicals])

  // Continuous pouring logic - runs every frame
  useFrame(() => {
    // Smooth color interpolation
    if (beakerColor !== targetBeakerColor) {
      const currentColor = new THREE.Color(beakerColor)
      const target = new THREE.Color(targetBeakerColor)
      currentColor.lerp(target, 0.1) // 10% interpolation per frame
      setBeakerColor(`#${currentColor.getHexString()}`)
    }
    
    // Always check all flasks for rotation updates, not just dragged one
    selectedChemicals.forEach(sourceId => {
      const sourcePos = flaskPositions[sourceId]
      if (!sourcePos) return

      const beakerPos = new THREE.Vector3(0, 0.8, 0)
      const distance = sourcePos.distanceTo(beakerPos)
      const heightDiff = sourcePos.y - beakerPos.y
      const currentScale = liquidScales[sourceId] || 1

      // Check if it's litmus paper (no pouring, just dipping)
      const isLitmus = isLitmusPaper(sourceId)
      
      // Check if flask is in pouring position AND has liquid remaining
      const isInPouringPosition = distance < 1.0 && heightDiff > 0.2 && currentScale > 0.05
      const isDropper = useDropper(sourceId)

      if (isInPouringPosition && draggedFlask === sourceId) {
        // For litmus paper, just tilt slightly but don't pour
        if (isLitmus) {
          // Tilt litmus paper to dip into beaker
          setFlaskRotations(prev => {
            const currentRotation = prev[sourceId] || [0, 0, 0]
            const targetZ = -Math.PI / 6 // Smaller tilt for dipping
            const currentZ = currentRotation[2]
            const smoothZ = currentZ + (targetZ - currentZ) * 0.15
            
            return {
              ...prev,
              [sourceId]: [0, 0, smoothZ]
            }
          })
          // Litmus paper doesn't add liquid to beaker, just tests pH
          // Color change logic could be added here based on beaker pH
          return
        }
        
        // Smoothly tilt the container for pouring/dropping
        setFlaskRotations(prev => {
          const currentRotation = prev[sourceId] || [0, 0, 0]
          const targetZ = -Math.PI / 3
          const currentZ = currentRotation[2]
          
          // Smooth interpolation to target rotation
          const smoothZ = currentZ + (targetZ - currentZ) * 0.15
          
          return {
            ...prev,
            [sourceId]: [0, 0, smoothZ]
          }
        })

        // Mark as squeezed for droppers
        if (isDropper) {
          setSqueezedDroppers(prev => new Set(prev).add(sourceId))
        }

        // Pour/drop liquid gradually
        const pourRate = isDropper ? 0.003 : 0.008 // Droppers add smaller amounts
        const newSourceScale = Math.max(0, currentScale - pourRate)
        setLiquidScales(prev => ({
          ...prev,
          [sourceId]: newSourceScale
        }))

        // Increase beaker liquid
        setBeakerLiquidLevel(prev => Math.min(1, prev + pourRate * 0.8))

        // Add to beaker contents if not already there
        if (!beakerContents.includes(sourceId)) {
          setBeakerContents(prev => {
            const newContents = [...prev, sourceId]
            
            // Update color and check for reaction
            if (newContents.length >= 2) {
              const mixture = chemicalData.mixtures.find(mix =>
                mix.chemicals.length === newContents.length &&
                mix.chemicals.every(chem => newContents.includes(chem)) &&
                newContents.every(chem => mix.chemicals.includes(chem))
              )
              
              if (mixture && mixture.results) {
                const results = mixture.results
                
                // Apply reaction color smoothly
                if (results.colorChange) {
                  setTargetBeakerColor(results.colorChange)
                }
                
                // Trigger visual effects immediately
                if (results.effervescence) {
                  setShowEffervescence(true)
                }
                if (results.precipitate) {
                  setShowPrecipitate(true)
                }
                
                // Show reaction modal after delay
                if (!hasReacted) {
                  setHasReacted(true)
                  setTimeout(() => {
                    if (onMixComplete) onMixComplete(results)
                  }, 1000)
                }
              } else {
                // Blend colors if no specific reaction
                const colors = newContents.map(id => 
                  new THREE.Color(chemicalData.chemicals[id]?.color || '#ffffff')
                )
                const mixedColor = new THREE.Color()
                colors.forEach((color, i) => {
                  if (i === 0) {
                    mixedColor.copy(color)
                  } else {
                    mixedColor.lerp(color, 0.5)
                  }
                })
                setTargetBeakerColor(`#${mixedColor.getHexString()}`)
              }
            } else {
              setTargetBeakerColor(chemicalData.chemicals[sourceId]?.color || '#ffffff')
            }
            
            return newContents
          })
        }
      } else {
        // Smoothly return container to upright when not in pouring position
        setFlaskRotations(prev => {
          const current = prev[sourceId] || [0, 0, 0]
          const currentZ = current[2]
          
          // Only update if rotation is not already zero
          if (Math.abs(currentZ) > 0.005) {
            // Smooth easing back to upright (faster easing with 0.85 instead of 0.9)
            const newZ = currentZ * 0.85
            return {
              ...prev,
              [sourceId]: [current[0], current[1], Math.abs(newZ) < 0.005 ? 0 : newZ]
            }
          }
          return prev
        })
        
        // Unsqueeze droppers smoothly
        if (useDropper(sourceId)) {
          setSqueezedDroppers(prev => {
            const newSet = new Set(prev)
            newSet.delete(sourceId)
            return newSet
          })
        }
      }
    })
  })

  const handlePointerDown = (flaskId) => (event) => {
    event.stopPropagation()
    setIsDragging(true)
    setDraggedFlask(flaskId)
    document.body.style.cursor = 'grabbing'

    const mousePos = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    )

    dragPlaneRef.current.setFromNormalAndCoplanarPoint(
      camera.getWorldDirection(dragPlaneRef.current.normal),
      flaskPositions[flaskId]
    )

    raycasterRef.current.setFromCamera(mousePos, camera)
    const intersection = new THREE.Vector3()
    raycasterRef.current.ray.intersectPlane(dragPlaneRef.current, intersection)
    offsetRef.current.copy(intersection).sub(flaskPositions[flaskId])
  }

  const handlePointerMove = (event) => {
    if (!isDragging || !draggedFlask) return

    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    )

    raycasterRef.current.setFromCamera(mouse, camera)
    const intersection = new THREE.Vector3()
    raycasterRef.current.ray.intersectPlane(dragPlaneRef.current, intersection)
    
    const targetPos = intersection.sub(offsetRef.current)
    targetPos.y = Math.max(0.8, targetPos.y)
    targetPos.x = Math.max(-2, Math.min(2, targetPos.x))
    targetPos.z = Math.max(-1, Math.min(1, targetPos.z))

    // Smooth interpolation for dragging
    setFlaskPositions(prev => {
      const currentPos = prev[draggedFlask]
      if (!currentPos) return { ...prev, [draggedFlask]: targetPos }
      
      // Lerp for smooth movement (0.3 = 30% interpolation)
      const smoothPos = new THREE.Vector3()
      smoothPos.lerpVectors(currentPos, targetPos, 0.3)
      
      return {
        ...prev,
        [draggedFlask]: smoothPos
      }
    })
  }

  const handlePointerUp = () => {
    setIsDragging(false)
    const releasedFlask = draggedFlask
    setDraggedFlask(null)
    document.body.style.cursor = 'auto'
    
    // Smooth snap-back to original position if not over beaker
    if (releasedFlask) {
      const currentPos = flaskPositions[releasedFlask]
      const beakerPos = new THREE.Vector3(0, 0.8, 0)
      const distance = currentPos.distanceTo(beakerPos)
      
      // If far from beaker, smoothly return to original position
      if (distance > 1.5) {
        const originalIndex = selectedChemicals.indexOf(releasedFlask)
        const originalX = originalIndex === 0 ? -1.5 : 1.5
        const targetPos = new THREE.Vector3(originalX, 0.8, 0)
        
        // Animate back to position
        let progress = 0
        const animateBack = () => {
          progress += 0.1
          if (progress <= 1) {
            setFlaskPositions(prev => {
              const smoothPos = new THREE.Vector3()
              smoothPos.lerpVectors(currentPos, targetPos, Math.min(progress, 1))
              return {
                ...prev,
                [releasedFlask]: smoothPos
              }
            })
            requestAnimationFrame(animateBack)
          }
        }
        animateBack()
      }
    }
  }

  const reset = () => {
    setBeakerLiquidLevel(0)
    setBeakerColor('#ffffff')
    setTargetBeakerColor('#ffffff')
    setBeakerContents([])
    setHasReacted(false)
    setShowEffervescence(false)
    setShowPrecipitate(false)
    setSqueezedDroppers(new Set())
    
    const positions = {}
    const scales = {}
    const rotations = {}
    
    selectedChemicals.forEach((id, index) => {
      const x = index === 0 ? -1.5 : 1.5
      positions[id] = new THREE.Vector3(x, 0.8, 0)
      scales[id] = 1
      rotations[id] = [0, 0, 0]
    })
    
    setFlaskPositions(positions)
    setLiquidScales(scales)
    setFlaskRotations(rotations)
  }

  return (
    <>
      <StaticCamera />

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
      <pointLight position={[0, 5, 0]} intensity={0.5} />
      <spotLight position={[0, 8, 0]} angle={0.3} intensity={0.5} castShadow />

      {/* Lab Table */}
      <Box args={[6, 0.15, 3]} position={[0, 0.65, 0]} receiveShadow>
        <meshStandardMaterial color="#8B4513" roughness={0.7} />
      </Box>

      {/* Table Legs */}
      {[[-2.5, -1.2], [-2.5, 1.2], [2.5, -1.2], [2.5, 1.2]].map(([x, z], i) => (
        <Box key={i} args={[0.15, 1.3, 0.15]} position={[x, 0, z]} castShadow>
          <meshStandardMaterial color="#654321" />
        </Box>
      ))}

      {/* Back Wall */}
      <Box args={[8, 4, 0.1]} position={[0, 2, -2]} receiveShadow>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>

      {/* Instructions */}
      <Text position={[0, 3.2, -1.9]} fontSize={0.18} color="#2c3e50" anchorX="center">
        🧪 Virtual Mixing Station
      </Text>

      <Text position={[0, 2.8, -1.9]} fontSize={0.12} color="#555" anchorX="center">
        Drag containers smoothly - Watch the magic happen!
      </Text>

      {/* Progress Indicator */}
      {beakerLiquidLevel > 0 && (
        <group position={[0, 2.4, -1.9]}>
          <Box args={[2, 0.15, 0.05]}>
            <meshStandardMaterial color="#ddd" />
          </Box>
          <Box args={[beakerLiquidLevel * 2, 0.12, 0.06]} position={[-1 + beakerLiquidLevel, 0, 0.01]}>
            <meshStandardMaterial color="#4CAF50" emissive="#4CAF50" emissiveIntensity={0.3} />
          </Box>
          <Text position={[0, 0.15, 0.05]} fontSize={0.08} color="#333">
            Beaker: {Math.round(beakerLiquidLevel * 100)}%
          </Text>
        </group>
      )}

      {/* Mixing Beaker */}
      <MixingBeaker
        position={[0, 0.73, 0]}
        mixedColor={beakerColor}
        liquidLevel={beakerLiquidLevel}
        containedChemicals={beakerContents}
        showEffervescence={showEffervescence}
        showPrecipitate={showPrecipitate}
      />

      {/* Flasks, Droppers, and Litmus Paper */}
      {selectedChemicals.map((id) => {
        const position = flaskPositions[id]
        const rotation = flaskRotations[id]
        const liquidScale = liquidScales[id] || 1
        const isDropperChem = useDropper(id)
        const isLitmus = isLitmusPaper(id)

        if (!position) return null

        // Render Litmus Paper for litmus
        if (isLitmus) {
          return (
            <LitmusPaper
              key={id}
              chemicalId={id}
              position={[position.x, position.y, position.z]}
              rotation={rotation}
              isDraggable={true}
              onPointerDown={handlePointerDown(id)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            />
          )
        }
        // Render Dropper for liquid indicators
        else if (isDropperChem) {
          return (
            <Dropper
              key={id}
              chemicalId={id}
              position={[position.x, position.y, position.z]}
              rotation={rotation}
              liquidScale={liquidScale}
              isSqueezed={squeezedDroppers.has(id)}
              isDraggable={true}
              onPointerDown={handlePointerDown(id)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            />
          )
        }
        // Render Flask for all other chemicals
        else {
          return (
            <Flask
              key={id}
              chemicalId={id}
              position={[position.x, position.y, position.z]}
              rotation={rotation}
              liquidScale={liquidScale}
              isDraggable={true}
              onPointerDown={handlePointerDown(id)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            />
          )
        }
      })}

      {/* Container Labels */}
      {selectedChemicals.map((id) => {
        const pos = flaskPositions[id]
        if (!pos) return null
        const scale = liquidScales[id] || 1
        const isDropperChem = useDropper(id)
        const isLitmus = isLitmusPaper(id)
        let containerType = 'Flask'
        if (isLitmus) containerType = 'Paper'
        else if (isDropperChem) containerType = 'Dropper'
        
        return (
          <Text 
            key={`label-${id}`}
            position={[pos.x, 0.3, 0]} 
            fontSize={0.08} 
            color="#3498db"
          >
            {chemicalData.chemicals[id]?.name} ({containerType}{isLitmus ? '' : ` - ${Math.round(scale * 100)}%`})
          </Text>
        )
      })}

      {/* Reset Button (3D) */}
      <group position={[2.5, 1.5, -1.8]} onClick={reset}>
        <Box args={[0.8, 0.3, 0.05]}>
          <meshStandardMaterial color="#f39c12" />
        </Box>
        <Text position={[0, 0, 0.03]} fontSize={0.12} color="white">
          Reset
        </Text>
      </group>
    </>
  )
}

// Main Component
export default function MixingWorkspace({ selectedChemicals = [], onBack, onMixComplete }) {
  const [mixingResult, setMixingResult] = useState(null)

  const handleMixComplete = (result) => {
    setMixingResult(result)
    if (onMixComplete) {
      onMixComplete(result)
    }
  }

  // Safety check - if no chemicals selected, show message
  if (!selectedChemicals || selectedChemicals.length === 0) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p>⚠️ No chemicals selected</p>
          <button
            onClick={onBack}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Back to Lab
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 3, 5], fov: 60 }} shadows>
        <MixingWorkspaceScene
          selectedChemicals={selectedChemicals}
          onMixComplete={handleMixComplete}
        />
      </Canvas>

      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            padding: '12px 24px',
            backgroundColor: 'rgba(52, 152, 219, 0.9)',
            color: 'white',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            zIndex: 1000,
            backdropFilter: 'blur(10px)'
          }}
        >
          ← Back to Lab
        </button>
      )}

      {/* Instructions Panel */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        color: 'white',
        borderRadius: '12px',
        minWidth: '280px',
        maxWidth: '320px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', borderBottom: '2px solid #4CAF50', paddingBottom: '8px' }}>
          🧪 Mixing Instructions
        </h3>
        <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
          <p style={{ margin: '0 0 10px 0' }}>
            <strong>Selected Chemicals:</strong>
          </p>
          <ul style={{ margin: '0 0 15px 0', padding: '0 0 0 20px' }}>
            {selectedChemicals.map(id => {
              const isDropperChem = useDropper(id)
              const isLitmus = isLitmusPaper(id)
              return (
                <li key={id} style={{ color: '#3498db' }}>
                  {chemicalData.chemicals[id]?.name}
                  {isDropperChem && <span style={{ color: '#f39c12' }}> 💧 (Dropper)</span>}
                  {isLitmus && <span style={{ color: '#8a2be2' }}> 📄 (Paper)</span>}
                </li>
              )
            })}
          </ul>
          <p style={{ margin: '0 0 8px 0' }}>
            • <strong>Flasks:</strong> Click & drag to pour
          </p>
          <p style={{ margin: '0 0 8px 0' }}>
            • <strong>Droppers:</strong> Add drops carefully
          </p>
          <p style={{ margin: '0 0 8px 0' }}>
            • <strong>Litmus Paper:</strong> Dip to test pH
          </p>
          <p style={{ margin: '0 0 8px 0' }}>
            • <strong>Move away</strong> to stop pouring
          </p>
          <p style={{ margin: '0 0 8px 0' }}>
            • <strong>Return anytime</strong> to pour more!
          </p>
          <p style={{ margin: '0', fontSize: '12px', color: '#f39c12', marginTop: '10px' }}>
            ⚗️ Watch for bubbles, color changes, and precipitates!
          </p>
        </div>
      </div>

      {/* Reaction Modal */}
      {mixingResult && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: 'rgba(20, 20, 20, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            border: '2px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h2 style={{ color: 'white', fontSize: '24px', marginTop: 0 }}>
              🧬 Reaction Complete!
            </h2>

            <div style={{
              backgroundColor: mixingResult.colorChange,
              height: '60px',
              borderRadius: '10px',
              marginBottom: '20px',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {mixingResult.effervescence && (
                <div style={{ color: 'white', fontSize: '20px' }}>
                  💭💭💭 Bubbling!
                </div>
              )}
            </div>

            <div style={{ color: 'white', lineHeight: 1.8 }}>
              <p><strong>🔬 Observation:</strong> {mixingResult.observation}</p>
              <p><strong>📝 Description:</strong> {mixingResult.description}</p>
              {mixingResult.equation && (
                <p><strong>⚗️ Equation:</strong> {mixingResult.equation}</p>
              )}
            </div>

            <button
              onClick={() => setMixingResult(null)}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '12px',
                backgroundColor: 'rgba(52, 152, 219, 0.9)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  )
}