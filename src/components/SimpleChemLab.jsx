import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, Box, Cylinder, Sphere, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

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

// Camera initialization component
function CameraController() {
  const { camera, gl, scene, invalidate } = useThree()
  
  useEffect(() => {
    // Set camera position immediately on mount
    camera.position.set(0, 4, 8)
    camera.lookAt(0, 2, 0)
    camera.updateProjectionMatrix()
    
    // Ensure the renderer is properly sized
    const canvas = gl.domElement
    if (canvas) {
      gl.setSize(canvas.clientWidth, canvas.clientHeight, false)
    }
    
    // Force a re-render to apply changes immediately
    invalidate()
  }, [camera, gl, scene, invalidate])
  
  return null
}

function ChemistryLabScene() {
  const [selectedEquipment, setSelectedEquipment] = useState(null)

  const handleEquipmentClick = (equipmentType) => {
    setSelectedEquipment(equipmentType)
    console.log(`Selected: ${equipmentType}`)
  }

  return (
    <>
      {/* Camera Controller for immediate initialization */}
      <CameraController />
      
      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" castShadow />
      <pointLight position={[0, 5, 0]} intensity={1} color="#ffffff" />
      
      {/* Camera Controls - Properly Configured */}
      <OrbitControls 
        makeDefault
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={Math.PI / 6}
        maxDistance={15}
        minDistance={3}
        target={[0, 2, 0]}
        enableDamping={true}
        dampingFactor={0.05}
        rotateSpeed={0.8}
        zoomSpeed={1.0}
        panSpeed={0.8}
        autoRotate={false}
        regress
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
        { name: 'Phenolphthalein', color: '#ff69b4', short: 'PhPh', pos: -8.5, shelf: 5.1 },
        { name: 'Methyl Orange', color: '#ff4500', short: 'MO', pos: -7, shelf: 5.1 },
        { name: 'Litmus', color: '#8a2be2', short: 'Litmus', pos: -5.5, shelf: 3.8 },
        { name: 'Universal', color: '#32cd32', short: 'Universal', pos: -7, shelf: 3.8 }
      ].map((indicator, i) => (
        <group key={i} position={[5.2, indicator.shelf, indicator.pos]}>
          {/* Bottle Body */}
          <Cylinder args={[0.12, 0.12, 0.3]} position={[0, 0, 0]}>
            <meshStandardMaterial color={indicator.color} transparent opacity={0.8} />
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
        { name: 'Acetone', color: '#f39c12', pos: -1.5, shelf: 4.0 },
        { name: 'Ethanol', color: '#3498db', pos: 0.5, shelf: 4.0 },
        { name: 'Methanol', color: '#9b59b6', pos: 2.5, shelf: 2.5 },
        { name: 'Hexane', color: '#1abc9c', pos: 4.5, shelf: 2.5 }
      ].map((solvent, i) => (
        <group key={`solvent-${i}`} position={[-8.2, solvent.shelf, solvent.pos]}>
          {/* Bottle Body */}
          <Cylinder args={[0.15, 0.15, 0.5]} position={[0, 0, 0]}>
            <meshStandardMaterial color={solvent.color} transparent opacity={0.7} />
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
        { name: 'HCl', color: '#e74c3c', pos: -3.5 },
        { name: 'H₂SO₄', color: '#8e44ad', pos: -1.5 },
        { name: 'HNO₃', color: '#f39c12', pos: 0.5 },
        { name: 'CH₃COOH', color: '#3498db', pos: 2.5 }
      ].map((chemical, i) => (
        <group key={`acid-${i}`} position={[8.2, 5.55, chemical.pos]}>
          {/* Bottle Body */}
          <Cylinder args={[0.15, 0.15, 0.5]} position={[0, 0, 0]}>
            <meshStandardMaterial color={chemical.color} transparent opacity={0.7} />
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
        { name: 'NaOH', color: '#27ae60', pos: -3.5 },
        { name: 'KOH', color: '#2ecc71', pos: -1.5 },
        { name: 'NH₄OH', color: '#16a085', pos: 0.5 },
        { name: 'Ca(OH)₂', color: '#1abc9c', pos: 2.5 }
      ].map((chemical, i) => (
        <group key={`base-${i}`} position={[8.2, 4.05, chemical.pos]}>
          {/* Bottle Body */}
          <Cylinder args={[0.15, 0.15, 0.5]} position={[0, 0, 0]}>
            <meshStandardMaterial color={chemical.color} transparent opacity={0.7} />
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
        { name: 'NaCl', color: '#ffffff', pos: -3.5 },
        { name: 'CuSO₄', color: '#3498db', pos: -1.5 },
        { name: 'FeCl₃', color: '#f39c12', pos: 0.5 },
        { name: 'AgNO₃', color: '#95a5a6', pos: 2.5 }
      ].map((chemical, i) => (
        <group key={`salt-${i}`} position={[8.2, 2.55, chemical.pos]}>
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
  useEffect(() => {
    // Prevent body scroll when in lab
    document.body.style.overflow = 'hidden'
    
    // Ensure proper viewport sizing
    const handleResize = () => {
      // Trigger canvas resize if needed
      window.dispatchEvent(new Event('resize'))
    }
    
    // Initial resize after mount
    setTimeout(handleResize, 100)
    
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div className="chemistry-lab" style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Canvas 
        camera={{ 
          position: [0, 4, 8], 
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        aria-label="Virtual Chemistry Laboratory"
        role="application"
        shadows
        gl={{ 
          antialias: true,
          alpha: false,
          preserveDrawingBuffer: false,
          powerPreference: "high-performance"
        }}
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block',
          background: '#f0f0f0'
        }}
        onCreated={({ gl, camera }) => {
          // Ensure the canvas fills the viewport immediately
          gl.setSize(window.innerWidth, window.innerHeight)
          camera.aspect = window.innerWidth / window.innerHeight
          camera.updateProjectionMatrix()
        }}
      >
        <ChemistryLabScene />
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
          🎤 Voice Commands
        </button>
        <button 
          onClick={() => console.log('Help opened')}
          aria-label="Open help guide"
          style={{
            padding: '10px 15px',
            backgroundColor: 'rgba(241, 196, 15, 0.9)',
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
          ❓ Help
        </button>
        <button 
          onClick={() => console.log('Emergency stop')}
          aria-label="Emergency stop"
          style={{
            padding: '10px 15px',
            backgroundColor: 'rgba(231, 76, 60, 0.9)',
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
          🛑 Emergency Stop
        </button>
      </div>
    </div>
  )
}

export default ChemistryLab
