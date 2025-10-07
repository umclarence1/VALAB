import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
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

function ChemistryLabScene() {
  const [selectedEquipment, setSelectedEquipment] = useState(null)

  const handleEquipmentClick = (equipmentType) => {
    setSelectedEquipment(equipmentType)
    console.log(`Selected: ${equipmentType}`)
  }

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" castShadow />
      <pointLight position={[0, 5, 0]} intensity={1} color="#ffffff" />
      
      {/* Camera Controls - Immersive First Person View */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={-Math.PI / 6}
        maxDistance={8}
        minDistance={1}
        target={[0, 1.5, -1]}
        enableDamping={true}
        dampingFactor={0.05}
        autoRotate={false}
      />
      
      {/* ROOM STRUCTURE - Immersive Scale */}
      {/* Floor */}
      <Box args={[20, 0.1, 15]} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#f0f0f0" />
      </Box>
      
      {/* Floor Pattern */}
      {Array.from({ length: 10 }, (_, i) => 
        Array.from({ length: 7 }, (_, j) => (
          <Box 
            key={`${i}-${j}`}
            args={[1.8, 0.005, 1.8]} 
            position={[-9 + i * 2, 0.055, -6 + j * 2]}
          >
            <meshStandardMaterial color={((i + j) % 2 === 0) ? "#ffffff" : "#f8f8f8"} />
          </Box>
        ))
      ).flat()}
      
      {/* Walls */}
      <Box args={[0.2, 8, 15]} position={[-10, 4, 0]}>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>
      <Box args={[0.2, 8, 15]} position={[10, 4, 0]}>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>
      <Box args={[20, 8, 0.2]} position={[0, 4, -7.5]}>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>
      <Box args={[20, 8, 0.2]} position={[0, 4, 7.5]}>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>
      
      {/* Windows with Frames */}
      <Box args={[4, 3, 0.1]} position={[9.9, 4.5, 0]}>
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} />
      </Box>
      <Box args={[4.2, 3.2, 0.05]} position={[9.95, 4.5, 0]}>
        <meshStandardMaterial color="#8b4513" />
      </Box>
      <Box args={[4, 3, 0.1]} position={[-9.9, 4.5, 0]}>
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} />
      </Box>
      <Box args={[4.2, 3.2, 0.05]} position={[-9.95, 4.5, 0]}>
        <meshStandardMaterial color="#8b4513" />
      </Box>
      
      {/* Ceiling */}
      <Box args={[20, 0.1, 15]} position={[0, 8, 0]}>
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
        position={[0, 6, -7]}
        fontSize={0.6}
        color="#2c3e50"
        anchorX="center"
        anchorY="middle"
      >
        Chemistry Laboratory
      </Text>
      
      {/* WALL CABINET WITH CHEMICALS */}
      <Box args={[5, 3, 1.2]} position={[7, 3.5, -7]} castShadow>
        <meshStandardMaterial color="#34495e" />
      </Box>
      <Box args={[4.8, 2.8, 0.1]} position={[7, 3.5, -6.3]}>
        <meshStandardMaterial color="#2c3e50" />
      </Box>
      
      {/* Indicator Solutions on Cabinet */}
      {[
        { name: 'Phenolphthalein', color: '#ff69b4', short: 'PhPh' },
        { name: 'Methyl Orange', color: '#ff4500', short: 'MO' },
        { name: 'Litmus', color: '#8a2be2', short: 'Litmus' },
        { name: 'Universal', color: '#32cd32', short: 'Universal' }
      ].map((indicator, i) => (
        <group key={i} position={[5.5 + i * 0.8, 4.2, -6.2]}>
          <Cylinder args={[0.1, 0.1, 0.3]}>
            <meshStandardMaterial color={indicator.color} transparent opacity={0.8} />
          </Cylinder>
          <Text
            position={[0, -0.25, 0]}
            fontSize={0.05}
            color="white"
            anchorX="center"
          >
            {indicator.short}
          </Text>
        </group>
      ))}
      
      {/* Cabinet Label */}
      <Text
        position={[7, 3, -6.2]}
        fontSize={0.12}
        color="#ecf0f1"
        anchorX="center"
      >
        INDICATORS
      </Text>
      
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
      
      {/* ORGANIC SOLVENTS CABINET */}
      <Box args={[1.5, 4, 6]} position={[-8.5, 2.5, 2]} castShadow>
        <meshStandardMaterial color="#e67e22" />
      </Box>
      
      {/* Solvent Bottles */}
      {[
        { name: 'Acetone', color: '#f39c12', pos: -2 },
        { name: 'Ethanol', color: '#3498db', pos: -0.5 },
        { name: 'Methanol', color: '#9b59b6', pos: 1 },
        { name: 'Hexane', color: '#1abc9c', pos: 2.5 }
      ].map((solvent, i) => (
        <group key={`solvent-${i}`} position={[-7.8, 3.5, solvent.pos]}>
          <Cylinder args={[0.15, 0.15, 0.5]}>
            <meshStandardMaterial color={solvent.color} transparent opacity={0.7} />
          </Cylinder>
          <Cylinder args={[0.1, 0.1, 0.06]} position={[0, 0.28, 0]}>
            <meshStandardMaterial color="#2c3e50" />
          </Cylinder>
          <Text
            position={[0, -0.35, 0]}
            fontSize={0.08}
            color="white"
            anchorX="center"
            rotation={[0, -Math.PI/2, 0]}
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
        <group key={`acid-${i}`} position={[8.2, 5.7, chemical.pos]}>
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
        <group key={`base-${i}`} position={[8.2, 4.2, chemical.pos]}>
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
        { name: 'NaCl', color: '#3498db', pos: -3.5 },
        { name: 'KI', color: '#9b59b6', pos: -1.5 },
        { name: 'AgNO₃', color: '#95a5a6', pos: 0.5 },
        { name: 'CuSO₄', color: '#2980b9', pos: 2.5 }
      ].map((chemical, i) => (
        <group key={`salt-${i}`} position={[7.8, 2.8, chemical.pos]}>
          <Cylinder args={[0.12, 0.12, 0.4]}>
            <meshStandardMaterial color={chemical.color} transparent opacity={0.8} />
          </Cylinder>
          <Cylinder args={[0.08, 0.08, 0.05]} position={[0, 0.22, 0]}>
            <meshStandardMaterial color="#2c3e50" />
          </Cylinder>
          <Text
            position={[0, -0.3, 0]}
            fontSize={0.08}
            color="white"
            anchorX="center"
            rotation={[0, Math.PI/2, 0]}
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
        <group key={`catalyst-${i}`} position={[7.8, 1.3, chemical.pos]}>
          <Cylinder args={[0.12, 0.12, 0.4]}>
            <meshStandardMaterial color={chemical.color} transparent opacity={0.8} />
          </Cylinder>
          <Cylinder args={[0.08, 0.08, 0.05]} position={[0, 0.22, 0]}>
            <meshStandardMaterial color="#2c3e50" />
          </Cylinder>
          <Text
            position={[0, -0.3, 0]}
            fontSize={0.08}
            color="white"
            anchorX="center"
            rotation={[0, Math.PI/2, 0]}
          >
            {chemical.name}
          </Text>
        </group>
      ))}
      
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
        position={[0, 3, 7]}
        fontSize={0.3}
        color="#e74c3c"
        anchorX="center"
        anchorY="middle"
      >
        🔬 Virtual Chemistry Laboratory
      </Text>
      
      {/* Room Instructions */}
      <Text
        position={[0, 2.2, 7]}
        fontSize={0.15}
        color="#2c3e50"
        anchorX="center"
        anchorY="middle"
      >
        Click on equipment to interact • Drag to look around
      </Text>
    </>
  )
}

function ChemistryLab({ onBack }) {
  return (
    <div className="chemistry-lab" style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Canvas 
        camera={{ position: [0, 1.7, 2], fov: 90 }}
        aria-label="Virtual Chemistry Laboratory"
        role="application"
        shadows
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block'
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
