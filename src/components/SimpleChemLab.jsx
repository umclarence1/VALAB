import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, Box, Cylinder, Sphere, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import chemicalData from '../data/chemicalMixtures.json'
import FirstPersonControls from './FirstPersonControls'
import MixingWorkspace from './MixingWorkspace'

function LabEquipment({ position, type, onClick, isSelected }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  const getEquipmentColor = () => {
    switch (type) {
      case 'beaker': return isSelected ? '#00ff88' : '#87ceeb'
      case 'flask': return isSelected ? '#ff6b6b' : '#ffa07a'
      case 'testtube': return isSelected ? '#4ecdc4' : '#98fb98'
      case 'burner': return isSelected ? '#ffd93d' : '#daa520'
      default: return '#cccccc'
    }
  }

  const renderEquipment = () => {
    switch (type) {
      case 'beaker':
        return (
          <group ref={meshRef}>
            <Cylinder args={[0.3, 0.4, 0.8]} position={[0, 0.4, 0]}>
              <meshLambertMaterial color={getEquipmentColor()} transparent opacity={0.8} />
            </Cylinder>
            <Text position={[0, -0.3, 0]} fontSize={0.1} color="white" anchorX="center">
              Beaker
            </Text>
          </group>
        )
      case 'flask':
        return (
          <group ref={meshRef}>
            <Sphere args={[0.3]} position={[0, 0.2, 0]}>
              <meshLambertMaterial color={getEquipmentColor()} transparent opacity={0.8} />
            </Sphere>
            <Cylinder args={[0.1, 0.1, 0.4]} position={[0, 0.7, 0]}>
              <meshLambertMaterial color={getEquipmentColor()} transparent opacity={0.8} />
            </Cylinder>
            <Text position={[0, -0.3, 0]} fontSize={0.1} color="white" anchorX="center">
              Flask
            </Text>
          </group>
        )
      case 'testtube':
        return (
          <group ref={meshRef}>
            <Cylinder args={[0.05, 0.05, 0.6]} position={[0, 0.3, 0]}>
              <meshLambertMaterial color={getEquipmentColor()} transparent opacity={0.8} />
            </Cylinder>
            <Text position={[0, -0.2, 0]} fontSize={0.08} color="white" anchorX="center">
              Test Tube
            </Text>
          </group>
        )
      case 'burner':
        return (
          <group ref={meshRef}>
            <Cylinder args={[0.2, 0.25, 0.3]} position={[0, 0.15, 0]}>
              <meshLambertMaterial color={getEquipmentColor()} />
            </Cylinder>
            <Cylinder args={[0.05, 0.05, 0.2]} position={[0, 0.4, 0]}>
              <meshLambertMaterial color="#333333" />
            </Cylinder>
            <Text position={[0, -0.2, 0]} fontSize={0.08} color="white" anchorX="center">
              Bunsen Burner
            </Text>
          </group>
        )
      default:
        return null
    }
  }

  return (
    <group 
      position={position}
      onClick={onClick}
      onPointerOver={(e) => { document.body.style.cursor = 'pointer' }}
      onPointerOut={(e) => { document.body.style.cursor = 'auto' }}
    >
      {renderEquipment()}
    </group>
  )
}

function CameraSetup() {
  const { camera, gl, size } = useThree()
  
  useEffect(() => {
    // Force immediate sharp rendering
    const forceSharpRender = () => {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      gl.setSize(window.innerWidth, window.innerHeight, false)
      gl.domElement.style.width = '100vw'
      gl.domElement.style.height = '100vh'
      gl.domElement.style.imageRendering = 'auto'
      gl.domElement.style.imageRendering = 'crisp-edges'
    }
    
    // Initial setup
    camera.position.set(0, 2.5, 4)
    camera.lookAt(0, 1.8, -1)
    camera.updateProjectionMatrix()
    
    // Force sharp rendering immediately
    forceSharpRender()
    
    // Force another refresh after a brief delay to ensure it sticks
    setTimeout(forceSharpRender, 100)
    setTimeout(forceSharpRender, 500)
    
    // Enable better rendering quality
    gl.shadowMap.enabled = true
    gl.shadowMap.type = THREE.PCFSoftShadowMap
  }, [camera, gl])
  
  useEffect(() => {
    // Handle size changes with forced pixel ratio update
    const updateSize = () => {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      gl.setSize(size.width, size.height, false)
      camera.aspect = size.width / size.height
      camera.updateProjectionMatrix()
      
      // Force DOM update
      gl.domElement.style.width = '100vw'
      gl.domElement.style.height = '100vh'
    }
    
    updateSize()
    
    // Additional update after brief delay
    setTimeout(updateSize, 50)
  }, [size, camera, gl])
  
  return null
}

function ChemistryLabScene({ selectedChemicals, setSelectedChemicals, onContextSelect }) {
  const [selectedEquipment, setSelectedEquipment] = useState(null)

  const handleEquipmentClick = (equipmentType) => {
    setSelectedEquipment(equipmentType)
    console.log(`Selected: ${equipmentType}`)
  }

  const handleChemicalClick = (chemicalId) => {
    if (selectedChemicals.includes(chemicalId)) {
      setSelectedChemicals(prev => prev.filter(id => id !== chemicalId))
    } else if (selectedChemicals.length < 2) {
      setSelectedChemicals(prev => [...prev, chemicalId])
    }
    console.log(`Selected chemicals: ${selectedChemicals}`)
  }

  const handleChemicalRightClick = (e, chemicalId) => {
    e.stopPropagation()
    e.preventDefault()
    onContextSelect(chemicalId, e.clientX, e.clientY)
  }

  return (
    <>
      {/* Camera Setup */}
      <CameraSetup />
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1.2} 
        color="#ffffff" 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[0, 6, 0]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-8, 4, 0]} intensity={0.4} color="#ffffff" />
      <pointLight position={[8, 4, 0]} intensity={0.4} color="#ffffff" />
      
      {/* Camera Controls - Immersive First Person View */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={-Math.PI / 6}
        maxDistance={12}
        minDistance={2}
        target={[0, 1.8, -1]}
        enableDamping={true}
        dampingFactor={0.08}
        autoRotate={false}
        makeDefault
        zoomSpeed={0.8}
        panSpeed={0.8}
        rotateSpeed={0.5}
      />
      
      {/* ROOM STRUCTURE - Immersive Scale */}
      {/* Floor */}
      <Box args={[24, 0.1, 18]} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#f0f0f0" />
      </Box>
      
      {/* Floor Pattern */}
      {Array.from({ length: 12 }, (_, i) => 
        Array.from({ length: 9 }, (_, j) => (
          <Box 
            key={`${i}-${j}`}
            args={[1.8, 0.005, 1.8]} 
            position={[-11 + i * 2, 0.055, -8 + j * 2]}
          >
            <meshStandardMaterial color={((i + j) % 2 === 0) ? "#ffffff" : "#f8f8f8"} />
          </Box>
        ))
      ).flat()}
      
      {/* Walls */}
      <Box args={[0.2, 8, 18]} position={[-12, 4, 0]}>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>
      <Box args={[0.2, 8, 18]} position={[12, 4, 0]}>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>
      <Box args={[24, 8, 0.2]} position={[0, 4, -9]} castShadow>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>
      {/* Entrance Wall with Door */}
      <Box args={[10, 8, 0.2]} position={[-7, 4, 9]} castShadow>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>
      <Box args={[10, 8, 0.2]} position={[7, 4, 9]} castShadow>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>
      <Box args={[4, 2, 0.2]} position={[0, 6, 9]} castShadow>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>
      
      {/* Windows with Frames */}
      <Box args={[4, 3, 0.1]} position={[11.9, 4.5, 0]}>
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} />
      </Box>
      <Box args={[4.2, 3.2, 0.05]} position={[11.95, 4.5, 0]}>
        <meshStandardMaterial color="#8b4513" />
      </Box>
      <Box args={[4, 3, 0.1]} position={[-11.9, 4.5, 0]}>
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} />
      </Box>
      <Box args={[4.2, 3.2, 0.05]} position={[-11.95, 4.5, 0]}>
        <meshStandardMaterial color="#8b4513" />
      </Box>
      
      {/* Ceiling */}
      <Box args={[24, 0.1, 18]} position={[0, 8, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      
      {/* Ceiling Lights */}
      {[-4, 0, 4].map((x, i) => (
        <group key={i} position={[x, 7.8, 0]}>
          <Box args={[2, 0.1, 1]}>
            <meshStandardMaterial color="#f0f0f0" emissive="#ffffff" emissiveIntensity={0.1} />
          </Box>
        </group>
      ))}
      
      {/* LAB TABLE - CENTER OF ROOM */}
      <group position={[0, 0, -1]}>
        {/* Table Top - Dark Lab Surface */}
        <Box args={[12, 0.25, 3]} position={[0, 0.9, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.1} />
        </Box>
        {/* Table Edge */}
        <Box args={[12.1, 0.05, 3.1]} position={[0, 1.02, 0]}>
          <meshStandardMaterial color="#333333" />
        </Box>
        {/* Table Legs */}
        {[-5, -2, 2, 5].map((x, i) => (
          <group key={i}>
            <Box args={[0.2, 1.8, 0.2]} position={[x, 0, -1.3]} castShadow>
              <meshStandardMaterial color="#555555" />
            </Box>
            <Box args={[0.2, 1.8, 0.2]} position={[x, 0, 1.3]} castShadow>
              <meshStandardMaterial color="#555555" />
            </Box>
            {/* Cross Brace */}
            <Box args={[0.06, 0.06, 2.6]} position={[x, 0.4, 0]}>
              <meshStandardMaterial color="#666666" />
            </Box>
          </group>
        ))}
        {/* Support Beam */}
        <Box args={[11.5, 0.12, 0.25]} position={[0, 0.4, 0]}>
          <meshStandardMaterial color="#666666" />
        </Box>
      </group>
      
      {/* TRIPOD CHAIRS - 3 CHAIRS AROUND TABLE */}
      {[-3.5, 0, 3.5].map((x, i) => (
        <group key={i} position={[x, 0, 1.8]}>
          {/* Seat Base */}
          <Cylinder args={[0.45, 0.45, 0.06]} position={[0, 1.7, 0]} castShadow>
            <meshStandardMaterial color="#2c3e50" />
          </Cylinder>
          {/* Seat Cushion */}
          <Cylinder args={[0.4, 0.4, 0.04]} position={[0, 1.77, 0]}>
            <meshStandardMaterial color="#3498db" />
          </Cylinder>
          {/* Central Post */}
          <Cylinder args={[0.06, 0.06, 1.7]} position={[0, 0.85, 0]}>
            <meshStandardMaterial color="#7f8c8d" />
          </Cylinder>
          {/* Height Adjustment Ring */}
          <Cylinder args={[0.09, 0.09, 0.08]} position={[0, 1.3, 0]}>
            <meshStandardMaterial color="#95a5a6" />
          </Cylinder>
          {/* Tripod Legs */}
          {[0, 120, 240].map((angle, j) => {
            const radians = (angle * Math.PI) / 180;
            const legX = Math.cos(radians) * 0.7;
            const legZ = Math.sin(radians) * 0.7;
            return (
              <group key={j}>
                <Box 
                  args={[0.05, 0.8, 0.05]} 
                  position={[legX * 0.8, 0.4, legZ * 0.8]}
                  rotation={[0, radians, Math.atan2(0.6, 0.8)]}
                >
                  <meshStandardMaterial color="#7f8c8d" />
                </Box>
                {/* Foot */}
                <Cylinder args={[0.08, 0.06, 0.03]} position={[legX, 0.015, legZ]}>
                  <meshStandardMaterial color="#2c3e50" />
                </Cylinder>
              </group>
            );
          })}
        </group>
      ))}
      
      {/* LAB EQUIPMENT ON TABLE */}
      <LabEquipment 
        position={[-4, 1.4, -1]} 
        type="beaker" 
        onClick={() => handleEquipmentClick('beaker')}
        isSelected={selectedEquipment === 'beaker'}
      />
      <LabEquipment 
        position={[-1.5, 1.4, -1]} 
        type="flask" 
        onClick={() => handleEquipmentClick('flask')}
        isSelected={selectedEquipment === 'flask'}
      />
      <LabEquipment 
        position={[1.5, 1.4, -1]} 
        type="testtube" 
        onClick={() => handleEquipmentClick('testtube')}
        isSelected={selectedEquipment === 'testtube'}
      />
      <LabEquipment 
        position={[4, 1.4, -1]} 
        type="burner" 
        onClick={() => handleEquipmentClick('burner')}
        isSelected={selectedEquipment === 'burner'}
      />
      
      {/* LAB TITLE ON BACK WALL */}
      <Text
        position={[0, 6.5, -8.5]}
        fontSize={0.8}
        color="#2c3e50"
        anchorX="center"
        anchorY="middle"
      >
        Chemistry Laboratory
      </Text>
      
      {/* INDICATOR SOLUTIONS SHELF - Open Frame Structure */}
      {/* Back Panel */}
      <Box args={[0.1, 3, 5]} position={[4.2, 3.5, -7]} castShadow>
        <meshStandardMaterial color="#34495e" />
      </Box>
      
      {/* Side Supports */}
      <Box args={[1.2, 3, 0.1]} position={[4.7, 3.5, -9.5]} castShadow>
        <meshStandardMaterial color="#34495e" />
      </Box>
      <Box args={[1.2, 3, 0.1]} position={[4.7, 3.5, -4.5]} castShadow>
        <meshStandardMaterial color="#34495e" />
      </Box>
      
      {/* Shelf Levels */}
      {[2.5, 3.8, 5.1].map((y, shelfIndex) => (
        <Box key={shelfIndex} args={[1.0, 0.1, 4.8]} position={[4.8, y, -7]} castShadow>
          <meshStandardMaterial color="#8b4513" roughness={0.7} />
        </Box>
      ))}
      
      {/* Indicator Solutions */}
      {[
        { id: 'Phenolphthalein', name: 'Phenolphthalein', color: '#ff69b4', short: 'PhPh', pos: -8.5, shelf: 5.1 },
        { id: 'MethylOrange', name: 'Methyl Orange', color: '#ff4500', short: 'MO', pos: -7, shelf: 5.1 },
        { id: 'Litmus', name: 'Litmus', color: '#8a2be2', short: 'Litmus', pos: -5.5, shelf: 3.8 },
        { id: 'UniversalIndicator', name: 'Universal', color: '#32cd32', short: 'Universal', pos: -7, shelf: 3.8 }
      ].map((indicator, i) => (
        <group 
          key={i} 
          position={[5.2, indicator.shelf, indicator.pos]}
          onClick={() => handleChemicalClick(indicator.id)}
          onPointerOver={(e) => { document.body.style.cursor = 'pointer' }}
          onPointerOut={(e) => { document.body.style.cursor = 'auto' }}
        >
          {/* Bottle Body */}
          <Cylinder args={[0.12, 0.12, 0.3]} position={[0, 0, 0]}>
            <meshStandardMaterial 
              color={selectedChemicals.includes(indicator.id) ? '#00ff88' : indicator.color} 
              transparent 
              opacity={0.8} 
            />
          </Cylinder>
          {/* Bottle Cap */}
          <Cylinder args={[0.1, 0.1, 0.05]} position={[0, 0.18, 0]}>
            <meshStandardMaterial color="#2c3e50" />
          </Cylinder>
          {/* Label Background */}
          <Box args={[0.25, 0.1, 0.01]} position={[0, 0, 0.13]}>
            <meshStandardMaterial color="#ffffff" />
          </Box>
          {/* Chemical Name on Label */}
          <Text
            position={[0, 0, 0.14]}
            fontSize={0.04}
            color="#2c3e50"
            anchorX="center"
            anchorY="middle"
          >
            {indicator.short}
          </Text>
        </group>
      ))}
      
      {/* Shelf Label */}
      <Text
        position={[4.5, 2.2, -7]}
        fontSize={0.12}
        color="#e74c3c"
        anchorX="center"
        rotation={[0, Math.PI/2, 0]}
      >
        INDICATORS
      </Text>
      
      {/* Additional Equipment on Indicator Shelf */}
      
      {/* Pipettes on Bottom Shelf */}
      <group position={[5.1, 2.65, -8]}>
        <Cylinder args={[0.01, 0.01, 0.25]} position={[0, 0.125, 0]}>
          <meshStandardMaterial color="#ffffff" transparent opacity={0.9} />
        </Cylinder>
        <Sphere args={[0.03]} position={[0, 0.27, 0]}>
          <meshStandardMaterial color="#e74c3c" transparent opacity={0.8} />
        </Sphere>
        <Text position={[0, -0.05, 0]} fontSize={0.03} color="white" anchorX="center">
          Pipette
        </Text>
      </group>
      
      <group position={[5.1, 2.65, -6]}>
        <Cylinder args={[0.01, 0.01, 0.25]} position={[0, 0.125, 0]}>
          <meshStandardMaterial color="#ffffff" transparent opacity={0.9} />
        </Cylinder>
        <Sphere args={[0.03]} position={[0, 0.27, 0]}>
          <meshStandardMaterial color="#27ae60" transparent opacity={0.8} />
        </Sphere>
        <Text position={[0, -0.05, 0]} fontSize={0.03} color="white" anchorX="center">
          Pipette
        </Text>
      </group>
      
      {/* pH Paper on Middle Shelf */}
      <group position={[5.1, 3.95, -8.5]}>
        <Box args={[0.15, 0.08, 0.02]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#f39c12" />
        </Box>
        <Text position={[0, -0.08, 0]} fontSize={0.03} color="white" anchorX="center">
          pH Paper
        </Text>
      </group>
      
      {/* FUME HOOD */}
      <Box args={[4, 3.5, 1.8]} position={[-7, 3.75, -6.5]} castShadow>
        <meshStandardMaterial color="#95a5a6" />
      </Box>
      <Box args={[3.8, 0.1, 1.6]} position={[-7, 5.5, -6.5]}>
        <meshStandardMaterial color="#7f8c8d" />
      </Box>
      <Text
        position={[-7, 2.2, -5.5]}
        fontSize={0.2}
        color="#2c3e50"
        anchorX="center"
      >
        FUME HOOD
      </Text>
      
      {/* ORGANIC SOLVENTS SHELF - Open Frame Structure */}
      {/* Back Panel */}
      <Box args={[0.1, 4, 6]} position={[-9.3, 2.5, 2]} castShadow>
        <meshStandardMaterial color="#e67e22" />
      </Box>
      
      {/* Side Supports */}
      <Box args={[1.6, 4, 0.1]} position={[-8.5, 2.5, -1]} castShadow>
        <meshStandardMaterial color="#e67e22" />
      </Box>
      <Box args={[1.6, 4, 0.1]} position={[-8.5, 2.5, 5]} castShadow>
        <meshStandardMaterial color="#e67e22" />
      </Box>
      
      {/* Shelf Levels */}
      {[1.0, 2.5, 4.0].map((y, shelfIndex) => (
        <Box key={shelfIndex} args={[1.4, 0.15, 5.8]} position={[-8.6, y, 2]} castShadow>
          <meshStandardMaterial color="#8b4513" roughness={0.7} />
        </Box>
      ))}
      
      {/* Solvent Bottles */}
      {[
        { id: 'Acetone', name: 'Acetone', color: '#f39c12', pos: -1.5, shelf: 4.0 },
        { id: 'Ethanol', name: 'Ethanol', color: '#3498db', pos: 0.5, shelf: 4.0 },
        { id: 'Methanol', name: 'Methanol', color: '#9b59b6', pos: 2.5, shelf: 2.5 },
        { id: 'Hexane', name: 'Hexane', color: '#1abc9c', pos: 4.5, shelf: 2.5 }
      ].map((solvent, i) => (
        <group 
          key={`solvent-${i}`} 
          position={[-8.2, solvent.shelf, solvent.pos]}
          onClick={() => handleChemicalClick(solvent.id)}
          onPointerOver={(e) => { document.body.style.cursor = 'pointer' }}
          onPointerOut={(e) => { document.body.style.cursor = 'auto' }}
        >
          {/* Bottle Body */}
          <Cylinder args={[0.15, 0.15, 0.5]} position={[0, 0, 0]}>
            <meshStandardMaterial 
              color={selectedChemicals.includes(solvent.id) ? '#00ff88' : solvent.color} 
              transparent 
              opacity={0.7} 
            />
          </Cylinder>
          {/* Bottle Cap */}
          <Cylinder args={[0.12, 0.12, 0.08]} position={[0, 0.29, 0]}>
            <meshStandardMaterial color="#2c3e50" />
          </Cylinder>
          {/* Label Background */}
          <Box args={[0.32, 0.15, 0.01]} position={[0, 0, -0.16]}>
            <meshStandardMaterial color="#ffffff" />
          </Box>
          {/* Chemical Name on Label */}
          <Text
            position={[0, 0, -0.17]}
            fontSize={0.06}
            color="#2c3e50"
            anchorX="center"
            anchorY="middle"
            rotation={[0, Math.PI, 0]}
          >
            {solvent.name}
          </Text>
        </group>
      ))}
      
      <Text
        position={[-7.2, 4.5, 2]}
        fontSize={0.15}
        color="#e67e22"
        anchorX="center"
        rotation={[0, -Math.PI/2, 0]}
      >
        ORGANIC SOLVENTS
      </Text>
      
      {/* Additional Laboratory Equipment on Organic Shelf */}
      
      {/* Test Tubes on Bottom Shelf */}
      <group position={[-8.2, 1.15, 0.5]}>
        <Cylinder args={[0.02, 0.02, 0.3]} position={[0, 0.15, 0]}>
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.8} />
        </Cylinder>
        <Cylinder args={[0.025, 0.025, 0.02]} position={[0, 0.31, 0]}>
          <meshStandardMaterial color="#2c3e50" />
        </Cylinder>
        <Text position={[0, -0.05, 0]} fontSize={0.03} color="white" anchorX="center">
          Test Tube
        </Text>
      </group>
      
      <group position={[-8.2, 1.15, 1.5]}>
        <Cylinder args={[0.02, 0.02, 0.3]} position={[0, 0.15, 0]}>
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.8} />
        </Cylinder>
        <Cylinder args={[0.025, 0.025, 0.02]} position={[0, 0.31, 0]}>
          <meshStandardMaterial color="#2c3e50" />
        </Cylinder>
        <Text position={[0, -0.05, 0]} fontSize={0.03} color="white" anchorX="center">
          Test Tube
        </Text>
      </group>
      
      {/* Measuring Cylinders on Bottom Shelf */}
      <group position={[-8.2, 1.2, 3.5]}>
        <Cylinder args={[0.06, 0.06, 0.4]} position={[0, 0.2, 0]}>
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.8} />
        </Cylinder>
        <Text position={[0, -0.05, 0]} fontSize={0.03} color="white" anchorX="center">
          Graduated
        </Text>
      </group>
      
      {/* CHEMICAL REAGENT SHELF - Open Frame Structure */}
      {/* Back Panel */}
      <Box args={[0.1, 6, 10]} position={[9.3, 3, 0]} castShadow>
        <meshStandardMaterial color="#34495e" />
      </Box>
      
      {/* Side Supports */}
      <Box args={[1.6, 6, 0.1]} position={[8.5, 3, -5]} castShadow>
        <meshStandardMaterial color="#34495e" />
      </Box>
      <Box args={[1.6, 6, 0.1]} position={[8.5, 3, 5]} castShadow>
        <meshStandardMaterial color="#34495e" />
      </Box>
      
      {/* Shelf Levels - Thicker and More Realistic */}
      {[0.8, 2.3, 3.8, 5.3].map((y, shelfIndex) => (
        <Box key={shelfIndex} args={[1.4, 0.15, 9.8]} position={[8.6, y, 0]} castShadow>
          <meshStandardMaterial color="#8b4513" roughness={0.7} />
        </Box>
      ))}
      
      {/* Vertical Dividers for Organization */}
      {[-2.5, 0, 2.5].map((z, dividerIndex) => (
        <group key={dividerIndex}>
          {[0.8, 2.3, 3.8, 5.3].map((y, shelfIndex) => (
            <Box key={`${dividerIndex}-${shelfIndex}`} args={[1.2, 0.05, 0.05]} position={[8.6, y + 0.08, z]}>
              <meshStandardMaterial color="#34495e" />
            </Box>
          ))}
        </group>
      ))}
      
      {/* Chemical Bottles - Top Shelf (Acids) */}
      {[
        { id: 'HCl', name: 'HCl', color: '#e74c3c', pos: -3.5 },
        { id: 'H2SO4', name: 'H₂SO₄', color: '#8e44ad', pos: -1.5 },
        { id: 'HNO3', name: 'HNO₃', color: '#f39c12', pos: 0.5 },
        { id: 'BaCl2', name: 'BaCl₂', color: '#ecf0f1', pos: 2.5 }
      ].map((chemical, i) => (
        <group
          key={`acid-${i}`}
          position={[8.2, 5.55, chemical.pos]}
          onClick={() => handleChemicalClick(chemical.id)}
          onContextMenu={(e) => handleChemicalRightClick(e, chemical.id)}
          onPointerOver={(e) => { document.body.style.cursor = 'pointer' }}
          onPointerOut={(e) => { document.body.style.cursor = 'auto' }}
        >
          {/* Bottle Body */}
          <Cylinder args={[0.15, 0.15, 0.5]} position={[0, 0, 0]}>
            <meshStandardMaterial
              color={selectedChemicals.includes(chemical.id) ? '#00ff88' : chemical.color}
              transparent
              opacity={0.7}
            />
          </Cylinder>
          {/* Bottle Cap */}
          <Cylinder args={[0.12, 0.12, 0.08]} position={[0, 0.29, 0]}>
            <meshStandardMaterial color="#2c3e50" />
          </Cylinder>
          {/* Label Background */}
          <Box args={[0.32, 0.15, 0.01]} position={[0, 0, 0.16]}>
            <meshStandardMaterial color="#ffffff" />
          </Box>
          {/* Chemical Name on Label */}
          <Text
            position={[0, 0, 0.17]}
            fontSize={0.06}
            color="#2c3e50"
            anchorX="center"
            anchorY="middle"
          >
            {chemical.name}
          </Text>
        </group>
      ))}
      
      {/* Chemical Bottles - Second Shelf (Bases) */}
      {[
        { id: 'NaOH', name: 'NaOH', color: '#27ae60', pos: -3.5 },
        { id: 'KOH', name: 'KOH', color: '#2ecc71', pos: -1.5 },
        { id: 'NH4OH', name: 'NH₄OH', color: '#16a085', pos: 0.5 },
        { id: 'AgNO3', name: 'AgNO₃', color: '#95a5a6', pos: 2.5 }
      ].map((chemical, i) => (
        <group 
          key={`base-${i}`} 
          position={[8.2, 4.05, chemical.pos]}
          onClick={() => handleChemicalClick(chemical.id)}
          onPointerOver={(e) => { document.body.style.cursor = 'pointer' }}
          onPointerOut={(e) => { document.body.style.cursor = 'auto' }}
        >
          {/* Bottle Body */}
          <Cylinder args={[0.15, 0.15, 0.5]} position={[0, 0, 0]}>
            <meshStandardMaterial 
              color={selectedChemicals.includes(chemical.id) ? '#00ff88' : chemical.color} 
              transparent 
              opacity={0.7} 
            />
          </Cylinder>
          {/* Bottle Cap */}
          <Cylinder args={[0.12, 0.12, 0.08]} position={[0, 0.29, 0]}>
            <meshStandardMaterial color="#2c3e50" />
          </Cylinder>
          {/* Label Background */}
          <Box args={[0.32, 0.15, 0.01]} position={[0, 0, 0.16]}>
            <meshStandardMaterial color="#ffffff" />
          </Box>
          {/* Chemical Name on Label */}
          <Text
            position={[0, 0, 0.17]}
            fontSize={0.06}
            color="#2c3e50"
            anchorX="center"
            anchorY="middle"
          >
            {chemical.name}
          </Text>
        </group>
      ))}
      
      {/* Chemical Bottles - Third Shelf (Salts) */}
      {[
        { id: 'NaCl', name: 'NaCl', color: '#ffffff', pos: -3.5 },
        { id: 'CuSO4', name: 'CuSO₄', color: '#3498db', pos: -1.5 },
        { id: 'FeCl3', name: 'FeCl₃', color: '#f39c12', pos: 0.5 },
        { id: 'BaCl2', name: 'BaCl₂', color: '#ecf0f1', pos: 2.5 }
      ].map((chemical, i) => (
        <group 
          key={`salt-${i}`} 
          position={[8.2, 2.55, chemical.pos]}
          onClick={() => handleChemicalClick(chemical.id)}
          onPointerOver={(e) => { document.body.style.cursor = 'pointer' }}
          onPointerOut={(e) => { document.body.style.cursor = 'auto' }}
        >
          {/* Bottle Body */}
          <Cylinder args={[0.15, 0.15, 0.5]} position={[0, 0, 0]}>
            <meshStandardMaterial 
              color={selectedChemicals.includes(chemical.id) ? '#00ff88' : chemical.color} 
              transparent 
              opacity={0.8} 
            />
          </Cylinder>
          {/* Bottle Cap */}
          <Cylinder args={[0.12, 0.12, 0.08]} position={[0, 0.29, 0]}>
            <meshStandardMaterial color="#2c3e50" />
          </Cylinder>
          {/* Label Background */}
          <Box args={[0.32, 0.15, 0.01]} position={[0, 0, 0.16]}>
            <meshStandardMaterial color="#ffffff" />
          </Box>
          {/* Chemical Name on Label */}
          <Text
            position={[0, 0, 0.17]}
            fontSize={0.06}
            color="#2c3e50"
            anchorX="center"
            anchorY="middle"
          >
            {chemical.name}
          </Text>
        </group>
      ))}
      
      {/* Chemical Bottles - Bottom Shelf (Catalysts & Organic) */}
      {[
        { name: 'MnO₂', color: '#34495e', pos: -3.5 },
        { name: 'Pt', color: '#7f8c8d', pos: -1.5 },
        { name: 'C₂H₅OH', color: '#f1c40f', pos: 0.5 },
        { name: 'C₆H₆', color: '#e67e22', pos: 2.5 }
      ].map((chemical, i) => (
        <group key={`catalyst-${i}`} position={[8.2, 1.05, chemical.pos]}>
          {/* Bottle Body */}
          <Cylinder args={[0.15, 0.15, 0.5]} position={[0, 0, 0]}>
            <meshStandardMaterial color={chemical.color} transparent opacity={0.8} />
          </Cylinder>
          {/* Bottle Cap */}
          <Cylinder args={[0.12, 0.12, 0.08]} position={[0, 0.29, 0]}>
            <meshStandardMaterial color="#2c3e50" />
          </Cylinder>
          {/* Label Background */}
          <Box args={[0.32, 0.15, 0.01]} position={[0, 0, 0.16]}>
            <meshStandardMaterial color="#ffffff" />
          </Box>
          {/* Chemical Name on Label */}
          <Text
            position={[0, 0, 0.17]}
            fontSize={0.06}
            color="#2c3e50"
            anchorX="center"
            anchorY="middle"
          >
            {chemical.name}
          </Text>
        </group>
      ))}
      
      {/* Laboratory Apparatus on Shelves */}
      
      {/* Bunsen Burners on Bottom Shelf */}
      <group position={[8.3, 0.95, -1]}>
        <Cylinder args={[0.08, 0.1, 0.15]} position={[0, 0.075, 0]}>
          <meshStandardMaterial color="#34495e" />
        </Cylinder>
        <Cylinder args={[0.03, 0.03, 0.2]} position={[0, 0.25, 0]}>
          <meshStandardMaterial color="#2c3e50" />
        </Cylinder>
        <Text position={[0, -0.1, 0]} fontSize={0.04} color="white" anchorX="center">
          Bunsen
        </Text>
      </group>
      
      <group position={[8.3, 0.95, 1]}>
        <Cylinder args={[0.08, 0.1, 0.15]} position={[0, 0.075, 0]}>
          <meshStandardMaterial color="#34495e" />
        </Cylinder>
        <Cylinder args={[0.03, 0.03, 0.2]} position={[0, 0.25, 0]}>
          <meshStandardMaterial color="#2c3e50" />
        </Cylinder>
        <Text position={[0, -0.1, 0]} fontSize={0.04} color="white" anchorX="center">
          Bunsen
        </Text>
      </group>
      
      {/* Conical Flasks on Second Shelf */}
      <group position={[8.3, 2.38, -1]}>
        <Sphere args={[0.12]} position={[0, 0.08, 0]}>
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.8} />
        </Sphere>
        <Cylinder args={[0.04, 0.04, 0.25]} position={[0, 0.32, 0]}>
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.8} />
        </Cylinder>
        <Text position={[0, -0.1, 0]} fontSize={0.04} color="white" anchorX="center">
          Flask
        </Text>
      </group>
      
      <group position={[8.3, 2.38, 1]}>
        <Sphere args={[0.12]} position={[0, 0.08, 0]}>
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.8} />
        </Sphere>
        <Cylinder args={[0.04, 0.04, 0.25]} position={[0, 0.32, 0]}>
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.8} />
        </Cylinder>
        <Text position={[0, -0.1, 0]} fontSize={0.04} color="white" anchorX="center">
          Flask
        </Text>
      </group>
      
      {/* Beakers on Third Shelf */}
      <group position={[8.3, 3.88, -1]}>
        <Cylinder args={[0.12, 0.15, 0.25]} position={[0, 0.125, 0]}>
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.8} />
        </Cylinder>
        <Text position={[0, -0.08, 0]} fontSize={0.04} color="white" anchorX="center">
          Beaker
        </Text>
      </group>
      
      <group position={[8.3, 3.88, 1]}>
        <Cylinder args={[0.12, 0.15, 0.25]} position={[0, 0.125, 0]}>
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.8} />
        </Cylinder>
        <Text position={[0, -0.08, 0]} fontSize={0.04} color="white" anchorX="center">
          Beaker
        </Text>
      </group>
      
      {/* Funnels on Top Shelf */}
      <group position={[8.3, 5.38, -1]}>
        <Cylinder args={[0.1, 0.02, 0.15]} position={[0, 0.075, 0]}>
          <meshStandardMaterial color="#ffffff" transparent opacity={0.9} />
        </Cylinder>
        <Cylinder args={[0.02, 0.02, 0.1]} position={[0, -0.05, 0]}>
          <meshStandardMaterial color="#ffffff" transparent opacity={0.9} />
        </Cylinder>
        <Text position={[0, -0.15, 0]} fontSize={0.04} color="white" anchorX="center">
          Funnel
        </Text>
      </group>
      
      <group position={[8.3, 5.38, 1]}>
        <Cylinder args={[0.1, 0.02, 0.15]} position={[0, 0.075, 0]}>
          <meshStandardMaterial color="#ffffff" transparent opacity={0.9} />
        </Cylinder>
        <Cylinder args={[0.02, 0.02, 0.1]} position={[0, -0.05, 0]}>
          <meshStandardMaterial color="#ffffff" transparent opacity={0.9} />
        </Cylinder>
        <Text position={[0, -0.15, 0]} fontSize={0.04} color="white" anchorX="center">
          Funnel
        </Text>
      </group>
      
      {/* Additional Specialized Equipment */}
      
      {/* Petri Dishes on Second Shelf */}
      <group position={[8.3, 2.38, 3]}>
        <Cylinder args={[0.08, 0.08, 0.02]} position={[0, 0.01, 0]}>
          <meshStandardMaterial color="#ffffff" transparent opacity={0.9} />
        </Cylinder>
        <Cylinder args={[0.075, 0.075, 0.015]} position={[0, 0.025, 0]}>
          <meshStandardMaterial color="#ffffff" transparent opacity={0.9} />
        </Cylinder>
        <Text position={[0, -0.05, 0]} fontSize={0.03} color="white" anchorX="center">
          Petri
        </Text>
      </group>
      
      {/* Thermometer on Third Shelf */}
      <group position={[8.3, 3.88, 3]}>
        <Cylinder args={[0.01, 0.01, 0.3]} position={[0, 0.15, 0]}>
          <meshStandardMaterial color="#e74c3c" />
        </Cylinder>
        <Sphere args={[0.02]} position={[0, -0.02, 0]}>
          <meshStandardMaterial color="#e74c3c" />
        </Sphere>
        <Text position={[0, -0.08, 0]} fontSize={0.03} color="white" anchorX="center">
          Thermometer
        </Text>
      </group>
      
      {/* Watch Glass on Top Shelf */}
      <group position={[8.3, 5.38, 3]}>
        <Sphere args={[0.08]} position={[0, 0.04, 0]} scale={[1, 0.3, 1]}>
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.8} />
        </Sphere>
        <Text position={[0, -0.05, 0]} fontSize={0.03} color="white" anchorX="center">
          Watch Glass
        </Text>
      </group>
      
      {/* Shelf Category Labels */}
      <Text
        position={[7.2, 5.8, -4.5]}
        fontSize={0.12}
        color="#e74c3c"
        anchorX="center"
        rotation={[0, Math.PI/2, 0]}
      >
        ACIDS
      </Text>
      <Text
        position={[7.2, 4.3, -4.5]}
        fontSize={0.12}
        color="#27ae60"
        anchorX="center"
        rotation={[0, Math.PI/2, 0]}
      >
        BASES
      </Text>
      <Text
        position={[7.2, 2.8, -4.5]}
        fontSize={0.12}
        color="#3498db"
        anchorX="center"
        rotation={[0, Math.PI/2, 0]}
      >
        SALTS
      </Text>
      <Text
        position={[7.2, 1.3, -4.5]}
        fontSize={0.12}
        color="#f39c12"
        anchorX="center"
        rotation={[0, Math.PI/2, 0]}
      >
        CATALYSTS
      </Text>
      
      {/* SAFETY NOTICE ON ENTRY WALL */}
      <Text
        position={[0, 3.5, 8.5]}
        fontSize={0.4}
        color="#e74c3c"
        anchorX="center"
        anchorY="middle"
      >
        🔬 Virtual Chemistry Laboratory
      </Text>
      
      {/* Room Instructions */}
      <Text
        position={[0, 2.8, 8.5]}
        fontSize={0.18}
        color="#2c3e50"
        anchorX="center"
        anchorY="middle"
      >
        Click on equipment to interact • Drag to look around
      </Text>
      
      {/* LABORATORY ENTRANCE DOOR */}
      
      {/* Door Frame */}
      <Box args={[0.15, 5, 0.25]} position={[-1.1, 2.5, 8.9]} castShadow>
        <meshStandardMaterial color="#8b4513" />
      </Box>
      <Box args={[0.15, 5, 0.25]} position={[1.1, 2.5, 8.9]} castShadow>
        <meshStandardMaterial color="#8b4513" />
      </Box>
      <Box args={[2.2, 0.15, 0.25]} position={[0, 4.85, 8.9]} castShadow>
        <meshStandardMaterial color="#8b4513" />
      </Box>
      
      {/* Door Panels */}
      <Box args={[0.9, 4.7, 0.1]} position={[-0.5, 2.35, 8.95]} castShadow>
        <meshStandardMaterial color="#d4c5a7" roughness={0.7} />
      </Box>
      <Box args={[0.9, 4.7, 0.1]} position={[0.5, 2.35, 8.95]} castShadow>
        <meshStandardMaterial color="#d4c5a7" roughness={0.7} />
      </Box>
      
      {/* Door Panel Details */}
      <Box args={[0.7, 2, 0.05]} position={[-0.5, 3.2, 8.98]} castShadow>
        <meshStandardMaterial color="#c4b59a" />
      </Box>
      <Box args={[0.7, 2, 0.05]} position={[-0.5, 1.2, 8.98]} castShadow>
        <meshStandardMaterial color="#c4b59a" />
      </Box>
      <Box args={[0.7, 2, 0.05]} position={[0.5, 3.2, 8.98]} castShadow>
        <meshStandardMaterial color="#c4b59a" />
      </Box>
      <Box args={[0.7, 2, 0.05]} position={[0.5, 1.2, 8.98]} castShadow>
        <meshStandardMaterial color="#c4b59a" />
      </Box>
      
      {/* Door Handles */}
      <Cylinder args={[0.03, 0.03, 0.15]} position={[-0.8, 2.3, 9.0]} rotation={[0, 0, Math.PI/2]}>
        <meshStandardMaterial color="#c9b037" metalness={0.8} roughness={0.2} />
      </Cylinder>
      <Cylinder args={[0.03, 0.03, 0.15]} position={[0.8, 2.3, 9.0]} rotation={[0, 0, Math.PI/2]}>
        <meshStandardMaterial color="#c9b037" metalness={0.8} roughness={0.2} />
      </Cylinder>
      
      {/* Door Window (Safety Glass) */}
      <Box args={[1.6, 1.2, 0.05]} position={[0, 3.8, 8.98]}>
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} />
      </Box>
      <Box args={[1.65, 1.25, 0.03]} position={[0, 3.8, 8.97]}>
        <meshStandardMaterial color="#8b4513" />
      </Box>
      
      {/* Door Window Grid (Safety Feature) */}
      <Box args={[0.03, 1.2, 0.02]} position={[0, 3.8, 8.99]}>
        <meshStandardMaterial color="#2c3e50" />
      </Box>
      <Box args={[1.6, 0.03, 0.02]} position={[0, 3.8, 8.99]}>
        <meshStandardMaterial color="#2c3e50" />
      </Box>
      
      {/* Laboratory Door Sign */}
      <Box args={[1.8, 0.3, 0.05]} position={[0, 1.5, 8.98]}>
        <meshStandardMaterial color="#e74c3c" />
      </Box>
      <Text
        position={[0, 1.52, 9.01]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        CHEMISTRY LAB
      </Text>
      
      {/* Safety Warning Sign */}
      <Box args={[1.5, 0.2, 0.03]} position={[0, 1.1, 8.98]}>
        <meshStandardMaterial color="#f39c12" />
      </Box>
      <Text
        position={[0, 1.12, 9.0]}
        fontSize={0.08}
        color="#2c3e50"
        anchorX="center"
        anchorY="middle"
      >
        ⚠️ SAFETY EQUIPMENT REQUIRED
      </Text>
      
      {/* Door Threshold */}
      <Box args={[2.4, 0.05, 0.3]} position={[0, 0.025, 8.85]}>
        <meshStandardMaterial color="#7f8c8d" />
      </Box>
    </>
  )
}

function ChemistryLab({ onBack }) {
  // Setup flow states
  const [setupVisible, setSetupVisible] = useState(true)
  const [setupStep, setSetupStep] = useState(1) // 1: experiment, 2: tools, 3: question, 4: chemicals
  const [selectedExperiment, setSelectedExperiment] = useState(null)
  const [generatedQuestions, setGeneratedQuestions] = useState([])
  const [chosenQuestion, setChosenQuestion] = useState(null)
  const [setupChemicals, setSetupChemicals] = useState([])
  const [requiredTools, setRequiredTools] = useState([])

  // --- Experiment preview state & helpers (shows brief when tapping an experiment) ---
  const [experimentPreview, setExperimentPreview] = useState(null)
  const [showExperimentInfo, setShowExperimentInfo] = useState(false)
  
  const experimentDescriptions = {
    'Simple titration': 'Determine concentration of an unknown acid using a standard base. Add titrant until endpoint, record volume, calculate molarity.',
    'Back titration': 'Add excess reagent to react with the analyte, then titrate leftover reagent. Useful when direct titration is impractical.',
    'Redox titration': 'Titrate based on oxidation–reduction (electron transfer) reactions. Common oxidants: KMnO4, dichromate.',
    'Distillation': 'Separate components by boiling point; collect fractions and measure yield. Use simple distillation for large b.p. differences.'
  }

  const previewExperiment = (exp) => {
    setExperimentPreview(exp)
    setShowExperimentInfo(true)
  }

  const confirmStartExperiment = () => {
    if (!experimentPreview) return
    setSelectedExperiment(experimentPreview)
    setRequiredTools(toolsForExperiment[experimentPreview] || [])
    setShowExperimentInfo(false)
    setSetupStep(2)
  }

  const cancelExperimentPreview = () => {
    setExperimentPreview(null)
    setShowExperimentInfo(false)
  }
  // --- end experiment preview helpers ---

  // Tools required per experiment
  const toolsForExperiment = {
    'Simple titration': ['Burette (50 mL)', 'Pipette (25 mL)', 'Conical flask (Erlenmeyer)', 'Phenolphthalein indicator', 'Standard NaOH solution', 'White tile'],
    'Back titration': ['Analytical balance', 'Volumetric flask (250 mL)', 'Pipette (25 mL)', 'Excess HCl', 'Indicator solution', 'Burette'],
    'Redox titration': ['Burette (50 mL)', 'Pipette (25 mL)', 'Conical flask', 'KMnO₄ solution', 'Reducing agent', 'Stirrer'],
    'Distillation': ['Round-bottom flask (500 mL)', 'Liebig condenser', 'Heating mantle', 'Receiving flask', 'Thermometer (0-110°C)', 'Adapter joints']
  }

  // Lab experiments list
  const experiments = ['Simple titration', 'Back titration', 'Redox titration', 'Distillation']

  // Generate questions for experiment
  const generateQuestionsFor = (experiment) => {
    const pool = {
      'Simple titration': [
        'Determine the concentration of an unknown monoprotic acid using NaOH titration.',
        'Calculate molarity of HCl using titration with standardized NaOH solution.'
      ],
      'Back titration': [
        'Find the amount of CaCO₃ in an impure sample using back titration with excess HCl.',
        'Determine concentration of a weak base by back titration using standardized HCl.'
      ],
      'Redox titration': [
        'Determine the oxidizing agent concentration using KMnO₄ titration (show balanced equation).',
        'Calculate iron(II) concentration by titration with standardized potassium dichromate.'
      ],
      'Distillation': [
        'Separate ethanol from a 50:50 ethanol-water mixture and calculate yield percentage.',
        'Purify a volatile organic solvent using simple distillation and record boiling point.'
      ]
    }
    const opts = (pool[experiment] || []).slice()
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[opts[i], opts[j]] = [opts[j], opts[i]]
    }
    return opts
  }

  // Start experiment flow
  const startExperiment = (exp) => {
    setSelectedExperiment(exp)
    setChosenQuestion(null)
    setRequiredTools(toolsForExperiment[exp] || [])
    setSetupStep(2)
  }

  // Acknowledge tools and continue
  const acknowledgeToolsAndContinue = () => {
    if (!selectedExperiment) return
    setGeneratedQuestions(generateQuestionsFor(selectedExperiment))
    setSetupStep(3)
  }

  // Toggle chemical selection
  const toggleChemicalSelection = (chemId) => {
    const exists = setupChemicals.find(c => c.id === chemId)
    if (exists) {
      setSetupChemicals(prev => prev.filter(c => c.id !== chemId))
    } else {
      setSetupChemicals(prev => [...prev, { id: chemId, volume: '' }])
    }
  }

  // Set chemical volume
  const setChemicalVolume = (chemId, value) => {
    setSetupChemicals(prev => prev.map(c => c.id === chemId ? { ...c, volume: value } : c))
  }

  // Check if can enter mixing workspace
  const canEnterWorkspace = () => {
    if (!chosenQuestion) return false
    if (setupChemicals.length === 0) return false
    return setupChemicals.every(c => c.volume && !isNaN(Number(c.volume)) && Number(c.volume) > 0)
  }

  // Enter mixing workspace with selected chemicals
  const enterMixingWorkspace = () => {
    if (!canEnterWorkspace()) return
    const ids = setupChemicals.map(c => c.id)
    setSelectedChemicals(ids)
    setSetupVisible(false)
    setShowMixingWorkspace(true)
  }

  // Skip setup and go directly
  const skipAndEnter = () => {
    const ids = setupChemicals.length ? setupChemicals.map(c => c.id) : selectedChemicals
    setSelectedChemicals(ids)
    setSetupVisible(false)
    setShowMixingWorkspace(true)
  }

  // Original lab states
  const [selectedChemicals, setSelectedChemicals] = useState([])
  const [mixingResult, setMixingResult] = useState(null)
  const [showMixingPanel, setShowMixingPanel] = useState(false)
  //  const [cart, setCart] = useState([])
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, chemicalId: null })
  const [showMixingWorkspace, setShowMixingWorkspace] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [selectedChemicalDetails, setSelectedChemicalDetails] = useState({})

  useEffect(() => {
    // Ensure body and html have proper sizing
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.body.style.overflow = 'hidden'
    document.documentElement.style.width = '100%'
    document.documentElement.style.height = '100%'
    
    // Add bubble animation CSS
    const style = document.createElement('style')
    style.textContent = `
      @keyframes bubble {
        0%, 100% { transform: translateX(-50%) translateY(0px); opacity: 1; }
        50% { transform: translateX(-50%) translateY(-10px); opacity: 0.7; }
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const mixChemicals = () => {
    if (selectedChemicals.length !== 2) return

    // Find matching mixture in JSON data
    const mixture = chemicalData.mixtures.find(mix => 
      mix.chemicals.every(chem => selectedChemicals.includes(chem)) &&
      selectedChemicals.every(chem => mix.chemicals.includes(chem))
    )

    if (mixture) {
      setMixingResult(mixture.results)
      setShowMixingPanel(true)
    } else {
      // Default reaction for unmapped combinations
      setMixingResult({
        colorChange: "#f8f9fa",
        effervescence: false,
        temperatureChange: "none",
        precipitate: false,
        description: "No significant reaction observed",
        observation: "Chemicals mixed but no visible change occurred"
      })
      setShowMixingPanel(true)
    }
  }

  const clearMixing = () => {
    setSelectedChemicals([])
    setMixingResult(null)
    setShowMixingPanel(false)
  }

 

  const handleContextSelect = (chemicalId, x, y) => {
    setContextMenu({ visible: true, x, y, chemicalId })
  }

  const closeContextMenu = () => setContextMenu({ visible: false, x: 0, y: 0, chemicalId: null })

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.trim() === '') {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    // Search for chemicals by name or ID
    const results = Object.keys(chemicalData.chemicals).filter(id => {
      const chemical = chemicalData.chemicals[id]
      return (
        id.toLowerCase().includes(query.toLowerCase()) ||
        chemical.name.toLowerCase().includes(query.toLowerCase())
      )
    })

    setSearchResults(results)
    setShowSearchResults(results.length > 0)
  }

  const handleSearchSelect = (chemicalId) => {
    if (selectedChemicals.length < 2 && !selectedChemicals.includes(chemicalId)) {
      setSelectedChemicals(prev => [...prev, chemicalId])
    }
    setSearchQuery('')
    setShowSearchResults(false)
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleSearchSelect(searchResults[0])
    }
  }

  const goToMixingWorkspace = () => {
    if (selectedChemicals.length >= 2) {
      setShowMixingWorkspace(true)
    }
  }

  const backToLab = () => {
    setShowMixingWorkspace(false)
  }

  // If in mixing workspace, show that instead
  if (showMixingWorkspace) {
    return (
      <MixingWorkspace
        selectedChemicals={selectedChemicals}
        onBack={() => { setShowMixingWorkspace(false) }}
        onMixComplete={(result) => {
          setMixingResult(result)
          setShowMixingPanel(true)
        }}
      />
    )
  }

  return (
    <div className="chemistry-lab" style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden',
      background: '#000'
    }}>
      {/* Setup Overlay */}
      {setupVisible && (
        <div role="dialog" aria-modal="true" aria-label="Chemistry lab setup" style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(10,20,40,0.9), rgba(20,40,80,0.9))', zIndex: 3000, padding: '24px'
        }}>
          <div style={{ 
            width: '900px', maxWidth: '96vw', background: 'linear-gradient(135deg, #0f1720 0%, #1a2a3a 100%)', 
            borderRadius: 16, padding: 32, color: 'white', boxShadow: '0 20px 60px rgba(0,255,136,0.2), 0 0 40px rgba(52,152,219,0.1)',
            border: '2px solid rgba(0,255,136,0.3)'
          }}>
            {/* Header */}
            <div style={{ marginBottom: 24, borderBottom: '2px solid rgba(0,255,136,0.2)', paddingBottom: 16 }}>
              <h2 style={{ marginTop: 0, color: '#00ff88', fontSize: 28, fontWeight: 'bold' }}>🧪 Chemistry Lab Setup</h2>
              <div style={{ color: '#9aa7b4', fontSize: 14 }}>Step {setupStep} of 4 | {selectedExperiment ? selectedExperiment : 'Select Experiment'}</div>
            </div>

            {/* Step 1 - Experiment Selection */}
            {setupStep === 1 && (
              <div>
                <p style={{ color: '#d1d5db', fontSize: 16, marginBottom: 16 }}>Choose an experiment type to begin:</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  {experiments.map(exp => (
                    <button
                      key={exp}
                      onClick={() => previewExperiment(exp)}
                      style={{
                        padding: '14px 16px',
                        background: 'linear-gradient(135deg, rgba(52,152,219,0.2), rgba(52,152,219,0.1))',
                        border: '2px solid rgba(52,152,219,0.4)',
                        color: 'white',
                        borderRadius: 10,
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: '500',
                        transition: 'all 0.3s ease',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,255,136,0.1))'
                        e.target.style.borderColor = 'rgba(0,255,136,0.6)'
                        e.target.style.boxShadow = '0 0 20px rgba(0,255,136,0.2)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, rgba(52,152,219,0.2), rgba(52,152,219,0.1))'
                        e.target.style.borderColor = 'rgba(52,152,219,0.4)'
                        e.target.style.boxShadow = 'none'
                      }}
                    >
                      {exp === 'Simple titration' && '🧫'}
                      {exp === 'Back titration' && '🔄'}
                      {exp === 'Redox titration' && '⚡'}
                      {exp === 'Distillation' && '🔥'}
                      {' ' + exp}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Experiment Info Modal (preview when tapping an experiment) */}
            {showExperimentInfo && experimentPreview && (
              <div role="dialog" aria-modal="true" aria-label={`${experimentPreview} information`} style={{
                position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.6)', zIndex: 3500, pointerEvents: 'auto'
              }}>
                <div style={{ width: 560, maxWidth: '94vw', background: '#081226', padding: 20, borderRadius: 12, color: 'white', border: '2px solid rgba(255,255,255,0.06)' }}>
                  <h3 style={{ marginTop: 0, color: '#00d1ff' }}>{experimentPreview}</h3>
                  <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.5 }}>{experimentDescriptions[experimentPreview]}</p>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
                    <button onClick={cancelExperimentPreview} style={{ padding: '8px 12px', borderRadius: 8, background: '#374151', color: 'white', border: 'none' }}>Close</button>
                    <button onClick={confirmStartExperiment} style={{ padding: '8px 12px', borderRadius: 8, background: 'linear-gradient(135deg,#16a34a,#0f7a38)', color: 'white', border: 'none' }}>Start this experiment</button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2 - Required Tools */}
            {setupStep === 2 && (
              <div>
                <p style={{ color: '#d1d5db', fontSize: 16, marginBottom: 12 }}><strong>{selectedExperiment}</strong> requires these tools:</p>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: 16, borderRadius: 10, marginBottom: 20 }}>
                  <ul style={{ margin: 0, padding: '0 0 0 24px', color: '#bdc3c7', lineHeight: '1.8' }}>
                    {requiredTools.map((tool, i) => (
                      <li key={i} style={{ marginBottom: 8, fontSize: 14 }}>✓ {tool}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
                  <button onClick={() => { setSetupStep(1); setSelectedExperiment(null) }} style={{ background: 'transparent', color: '#9aa7b4', border: 'none', cursor: 'pointer', fontSize: 14, padding: '8px 12px' }}>← Back</button>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => acknowledgeToolsAndContinue()} style={{ padding: '10px 20px', borderRadius: 8, background: 'linear-gradient(135deg, #00ff88, #00cc6a)', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                      I have these tools →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 - Question Selection */}
            {setupStep === 3 && (
              <div>
                <p style={{ color: '#d1d5db', fontSize: 16, marginBottom: 12 }}>Select your experiment question:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20, maxHeight: '280px', overflowY: 'auto', paddingRight: 8 }}>
                  {generatedQuestions.map((q, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12, background: 'rgba(52,152,219,0.1)', borderRadius: 8, border: '2px solid rgba(52,152,219,0.3)', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,255,136,0.1)'; e.currentTarget.style.borderColor = 'rgba(0,255,136,0.4)' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(52,152,219,0.1)'; e.currentTarget.style.borderColor = 'rgba(52,152,219,0.3)' }}>
                      <input
                        type="radio"
                        name="setup-question"
                        checked={chosenQuestion === q}
                        onChange={() => setChosenQuestion(q)}
                        style={{ width: 18, height: 18, marginTop: 2, flexShrink: 0 }}
                      />
                      <span style={{ color: '#e6eef6', fontSize: 14, lineHeight: '1.5' }}>{q}</span>
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
                  <button onClick={() => setSetupStep(2)} style={{ background: 'transparent', color: '#9aa7b4', border: 'none', cursor: 'pointer', fontSize: 14, padding: '8px 12px' }}>← Back</button>
                  <button disabled={!chosenQuestion} onClick={() => setSetupStep(4)} style={{ padding: '10px 20px', borderRadius: 8, background: chosenQuestion ? 'linear-gradient(135deg, #2b6cb0, #1e4d7b)' : 'rgba(100,100,100,0.3)', color: 'white', border: 'none', cursor: chosenQuestion ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}>
                    Continue to Chemicals →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4 - Chemical Selection */}
            {setupStep === 4 && (
              <div>
                <p style={{ color: '#d1d5db', fontSize: 16, marginBottom: 12 }}>Select chemicals and specify volumes (mL):</p>
                <div style={{ maxHeight: 300, overflowY: 'auto', paddingRight: 8, marginBottom: 20, background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 10 }}>
                  {Object.keys(chemicalData.chemicals).slice(0, 20).map((chemId) => {
                    const chem = chemicalData.chemicals[chemId]
                    const selected = setupChemicals.find(c => c.id === chemId)
                    return (
                      <div key={chemId} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <label style={{ flex: 1, display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}>
                          <input type="checkbox" checked={!!selected} onChange={() => toggleChemicalSelection(chemId)} style={{ width: 18, height: 18 }} />
                          <div>
                            <div style={{ color: '#e6eef6', fontSize: 13, fontWeight: '500' }}>{chem.name}</div>
                            <div style={{ color: '#9aa7b4', fontSize: 11 }}>{chemId}</div>
                          </div>
                        </label>
                        <input
                          type="number"
                          min="0"
                          placeholder="mL"
                          value={selected?.volume || ''}
                          onChange={(e) => setChemicalVolume(chemId, e.target.value)}
                          disabled={!selected}
                          style={{ width: 70, padding: '6px 8px', borderRadius: 6, border: '1px solid rgba(0,255,136,0.3)', background: selected ? 'rgba(0,255,136,0.1)' : 'rgba(0,0,0,0.3)', color: 'white' }}
                        />
                      </div>
                    )
                  })}
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
                  <button onClick={() => setSetupStep(3)} style={{ background: 'transparent', color: '#9aa7b4', border: 'none', cursor: 'pointer', fontSize: 14, padding: '8px 12px' }}>← Back</button>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={skipAndEnter} style={{ padding: '10px 16px', borderRadius: 8, background: 'rgba(100,100,100,0.3)', color: 'white', border: '1px solid rgba(100,100,100,0.5)', cursor: 'pointer' }}>Skip</button>
                    <button disabled={!canEnterWorkspace()} onClick={enterMixingWorkspace} style={{ padding: '10px 20px', borderRadius: 8, background: canEnterWorkspace() ? 'linear-gradient(135deg, #16a34a, #0f7a38)' : 'rgba(100,100,100,0.3)', color: 'white', border: 'none', cursor: canEnterWorkspace() ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}>
                      Enter Mixing Workspace 🧬
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Canvas 
        camera={{ 
          position: [0, 2.5, 4], 
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        aria-label="Virtual Chemistry Laboratory"
        role="application"
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
        style={{ 
          width: '100vw', 
          height: '100vh',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      >
        <FirstPersonControls />
        <ChemistryLabScene
          selectedChemicals={selectedChemicals}
          setSelectedChemicals={setSelectedChemicals}
          onContextSelect={handleContextSelect}
        />
      </Canvas>
      
      {/* Back Button - Fixed Overlay */}
      <button 
        className="back-btn"
        onClick={onBack}
        aria-label="Return to lobby"
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
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(52, 152, 219, 1)'
          e.target.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'rgba(52, 152, 219, 0.9)'
          e.target.style.transform = 'scale(1)'
        }}
      >
        ← Back to Lobby
      </button>

      {/* Chemical Search Bar */}
      <div style={{
        position: 'fixed',
        top: '80px',
        left: '20px',
        zIndex: 1000,
        width: '300px'
      }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="🔍 Search chemicals..."
            style={{
              width: '100%',
              padding: '12px 15px',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              fontSize: '14px',
              backdropFilter: 'blur(10px)',
              outline: 'none'
            }}
          />
          
          {/* Search Results Dropdown */}
          {showSearchResults && (
            <div style={{
              position: 'absolute',
              top: '50px',
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              borderRadius: '8px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              maxHeight: '250px',
              overflowY: 'auto',
              backdropFilter: 'blur(10px)'
            }}>
              {searchResults.map((chemId) => (
                <div
                  key={chemId}
                  onClick={() => handleSearchSelect(chemId)}
                  style={{
                    padding: '10px 15px',
                    color: 'white',
                    cursor: 'pointer',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(52, 152, 219, 0.5)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                    {chemicalData.chemicals[chemId].name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#bbb' }}>
                    {chemId} • {chemicalData.chemicals[chemId].state}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{
          marginTop: '8px',
          fontSize: '11px',
          color: '#bbb',
          textAlign: 'center'
        }}>
          Type chemical name and press Enter to add
        </div>
      </div>
      
      {/* Lab Controls UI - Fixed Overlay */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <button 
          onClick={() => console.log('Voice commands activated')}
          aria-label="Activate voice commands"
          style={{
            padding: '10px 15px',
            backgroundColor: 'rgba(46, 204, 113, 0.9)',
            color: 'white',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease'
          }}
        >
         
        </button>
       
      </div>

      {/* Chemical Mixing Station (top-right) — UPDATED to allow entering molarity & volume per selected chemical */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '16px',
        minWidth: '320px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)'
      }}>
        <h3 style={{ color: 'white', fontSize: '16px', marginBottom: '12px', textAlign: 'center' }}>
          🧪 Chemical Mixing Station
        </h3>

        <div style={{ marginBottom: '10px' }}>
          <p style={{ color: '#bbb', fontSize: '13px', marginBottom: '8px' }}>
            Selected Chemicals ({selectedChemicals.length}/2)
          </p>

          {selectedChemicals.length === 0 && (
            <div style={{ color: '#9aa7b4', fontSize: 13 }}>Select up to two chemicals to set molarity & volume.</div>
          )}

          {selectedChemicals.map((chemId, idx) => {
            const details = selectedChemicalDetails[chemId] || { mol: '', volume: '' }
            return (
              <div key={chemId} style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                marginTop: 8,
                padding: '8px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.02)'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>
                    {chemicalData.chemicals[chemId]?.name || chemId}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    <input
                      aria-label={`Molarity for ${chemId}`}
                      type="number"
                      inputMode="decimal"
                      step="any"
                      placeholder="M (e.g. 0.10)"
                      value={details.mol}
                      onChange={(e) => setChemicalDetail(chemId, 'mol', e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
                      style={{
                        width: '118px',
                        padding: '6px 8px',
                        borderRadius: 6,
                        border: '1px solid rgba(255,255,255,0.06)',
                        background: 'rgba(0,0,0,0.55)',
                        color: 'white',
                        fontSize: 13,
                        outline: 'none'
                      }}
                    />
                    <input
                      aria-label={`Volume (mL) for ${chemId}`}
                      type="number"
                      inputMode="decimal"
                      step="any"
                      placeholder="mL"
                      value={details.volume}
                      onChange={(e) => setChemicalDetail(chemId, 'volume', e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
                      style={{
                        width: '70px',
                        padding: '6px 8px',
                        borderRadius: 6,
                        border: '1px solid rgba(255,255,255,0.06)',
                        background: 'rgba(0,0,0,0.55)',
                        color: 'white',
                        fontSize: 13,
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <button
                    aria-label={`Remove ${chemId}`}
                    onClick={() => {
                      setSelectedChemicals(prev => prev.filter(id => id !== chemId))
                      setSelectedChemicalDetails(prev => {
                        const next = { ...prev }; delete next[chemId]; return next
                      })
                    }}
                    style={{
                      background: 'rgba(231,76,60,0.9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 8px',
                      cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button
            onClick={goToMixingWorkspace}
            disabled={selectedChemicals.length < 2}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 8,
              border: 'none',
              background: selectedChemicals.length >= 2 ? 'linear-gradient(90deg,#9b59b6,#6d3f9a)' : 'rgba(127,140,141,0.45)',
              color: 'white',
              fontWeight: 700,
              cursor: selectedChemicals.length >= 2 ? 'pointer' : 'not-allowed'
            }}
          >
            🧬 Workspace
          </button>

          <button
            onClick={() => {
              // ensure details are kept; mixChemicals will read selectedChemicalDetails
              mixChemicals()
            }}
            disabled={selectedChemicals.length !== 2}
            style={{
              width: 110,
              padding: '10px',
              borderRadius: 8,
              border: 'none',
              background: selectedChemicals.length === 2 ? 'linear-gradient(90deg,#2ecc71,#27ae60)' : 'rgba(127,140,141,0.45)',
              color: 'white',
              fontWeight: 700,
              cursor: selectedChemicals.length === 2 ? 'pointer' : 'not-allowed'
            }}
            aria-disabled={selectedChemicals.length !== 2}
          >
            Quick Mix
          </button>
        </div>

        <div style={{ fontSize: 12, color: '#bbb', textAlign: 'center', marginTop: 10 }}>
          Set molarity (M) and volume (mL) for each selected chemical. Values are stored locally and included in the mix summary.
        </div>
      </div>

      {/* Reaction Results Modal */}
      {showMixingPanel && mixingResult && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
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
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 16px 64px rgba(0, 0, 0, 0.7)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: 'white', fontSize: '24px', margin: 0 }}>
                🧬 Reaction Results
              </h2>
              <button
                onClick={clearMixing}
                style={{
                  background: 'rgba(231, 76, 60, 0.8)',
                  border: 'none',
                  borderRadius: '50%',
                  color: 'white',
                  cursor: 'pointer',
                  width: '30px',
                  height: '30px',
                  fontSize: '16px'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                backgroundColor: mixingResult.colorChange,
                height: '60px',
                borderRadius: '10px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                marginBottom: '15px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {mixingResult.effervescence && (
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'white',
                    fontSize: '20px',
                    animation: 'bubble 1s infinite'
                  }}>
                    💭💭💭
                  </div>
                )}
                {mixingResult.precipitate && (
                  <div style={{
                    position: 'absolute',
                    bottom: '5px',
                    left: '0',
                    right: '0',
                    height: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '0 0 8px 8px'
                  }} />
                )}
              </div>
            </div>

            <div style={{ color: 'white', lineHeight: 1.6 }}>
              <p><strong>🔬 Observation:</strong> {mixingResult.observation}</p>
              <p><strong>📝 Description:</strong> {mixingResult.description}</p>
              {mixingResult.equation && (
                <p><strong>⚗️ Chemical Equation:</strong> {mixingResult.equation}</p>
              )}
              <div style={{ display: 'flex', gap: '20px', marginTop: '15px', fontSize: '14px' }}>
                <span>🌡️ Temperature: {mixingResult.temperatureChange}</span>
                <span>🫧 Effervescence: {mixingResult.effervescence ? 'Yes' : 'No'}</span>
                <span>🥄 Precipitate: {mixingResult.precipitate ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            background: 'rgba(30,30,30,0.95)',
            color: '#fff',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            zIndex: 2000,
            minWidth: '180px'
          }}
          role="menu"
          aria-label={`Actions for ${contextMenu.chemicalId}`}
          onMouseLeave={closeContextMenu}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{chemicalData.chemicals[contextMenu.chemicalId]?.name || contextMenu.chemicalId}</div>
         
          <button
            onClick={() => {
              setSelectedChemicals(prev => prev.length < 2 && !prev.includes(contextMenu.chemicalId) ? [...prev, contextMenu.chemicalId] : prev)
              closeContextMenu()
            }}
            style={buttonStyle}
            aria-label="Select for mixing"
          >🧪 Select for Mixing</button>
          <button onClick={closeContextMenu} style={buttonStyle} aria-label="Close menu">✕ Close</button>
        </div>
      )}

      
    </div>
  )
}

const buttonStyle = {
  width: '100%',
  background: 'rgba(52,152,219,0.7)',
  color: '#fff',
  border: 'none',
  padding: '8px 10px',
  marginBottom: '6px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px',
  textAlign: 'left'
}

const smallButtonStyle = {
  background: 'rgba(231,76,60,0.8)',
  border: 'none',
  color: '#fff',
  cursor: 'pointer',
  padding: '4px 6px',
  borderRadius: '4px',
  fontSize: '11px'
}

export default ChemistryLab
