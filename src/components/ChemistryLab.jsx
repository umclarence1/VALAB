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
  const [experiment, setExperiment] = useState({
    step: 0,
    substances: [],
    results: null
  })

  const handleEquipmentClick = (equipmentType) => {
    setSelectedEquipment(equipmentType)
    console.log(`Selected: ${equipmentType}`)
    
    // Simple experiment logic
    if (equipmentType === 'beaker' && experiment.step === 0) {
      setExperiment(prev => ({
        ...prev,
        step: 1,
        substances: ['Water']
      }))
    }
  }

  return (
    <>
      {/* Simple Clear Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1.5} 
        color="#ffffff"
        castShadow
      />
      <pointLight position={[0, 5, 0]} intensity={1} color="#ffffff" />
      
      {/* Camera Controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={0}
        maxDistance={15}
        minDistance={2}
        target={[0, 1, 0]}
        enableRotate={true}
        autoRotate={false}
        autoRotateSpeed={2.0}
        rotateSpeed={0.5}
        enableDamping={true}
        dampingFactor={0.05}
      />
      
      {/* Room Structure - Simple and Clear */}
      {/* Floor */}
      <Box args={[16, 0.1, 10]} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#e8e8e8" />
      </Box>
      
      {/* Walls */}
      <Box args={[0.2, 6, 10]} position={[-8, 3, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <Box args={[0.2, 6, 10]} position={[8, 3, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <Box args={[16, 6, 0.2]} position={[0, 3, -5]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <Box args={[16, 6, 0.2]} position={[0, 3, 5]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      
      {/* Ceiling */}
      <Box args={[16, 0.1, 10]} position={[0, 6, 0]}>
        <meshStandardMaterial color="#f0f0f0" />
      </Box>
      
      {/* Lab Table - Center of Room */}
      <group>
        {/* Table Top */}
        <Box args={[8, 0.2, 2]} position={[0, 1, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#2c3e50" />
        </Box>
        {/* Table Legs */}
        {[-3.5, -1, 1, 3.5].map((x, i) => (
          <group key={i}>
            <Box args={[0.15, 2, 0.15]} position={[x, 0, -0.8]} castShadow>
              <meshStandardMaterial color="#34495e" />
            </Box>
            <Box args={[0.15, 2, 0.15]} position={[x, 0, 0.8]} castShadow>
              <meshStandardMaterial color="#34495e" />
            </Box>
          </group>
        ))}
      </group>
      
      {/* Lab Chairs - Simple Tripod Design */}
      {[-2.5, 0, 2.5].map((x, i) => (
        <group key={i} position={[x, 0, -2.5]}>
          {/* Seat */}
          <Cylinder args={[0.4, 0.4, 0.05]} position={[0, 1.5, 0]} castShadow>
            <meshStandardMaterial color="#34495e" />
          </Cylinder>
          {/* Central Post */}
          <Cylinder args={[0.05, 0.05, 1.5]} position={[0, 0.75, 0]}>
            <meshStandardMaterial color="#7f8c8d" />
          </Cylinder>
          {/* Tripod Legs */}
          {[0, 120, 240].map((angle, j) => {
            const radians = (angle * Math.PI) / 180;
            const legX = Math.cos(radians) * 0.5;
            const legZ = Math.sin(radians) * 0.5;
            return (
              <Box 
                key={j}
                args={[0.03, 0.6, 0.03]} 
                position={[legX * 0.7, 0.3, legZ * 0.7]}
                rotation={[0, radians, Math.atan2(0.4, 0.6)]}
              >
                <meshStandardMaterial color="#7f8c8d" />
              </Box>
            );
          })}
        </group>
      ))}
      
      {/* Additional Lab Furniture */}
      {/* Side Cabinet */}
      <Box args={[3, 2, 1.5]} position={[-9, 1, -6]} castShadow>
        <meshLambertMaterial color="#8e44ad" />
      </Box>
      <Box args={[2.8, 0.1, 1.3]} position={[-9, 2.1, -6]}>
        <meshLambertMaterial color="#9b59b6" />
      </Box>
      
      {/* Wall-Mounted Equipment Shelf */}
      <Box args={[10, 0.15, 1.2]} position={[0, 4, -8.2]}>
        <meshLambertMaterial color="#34495e" />
      </Box>
      {/* Shelf Brackets */}
      {[-4, -2, 0, 2, 4].map((x, i) => (
        <Box key={i} args={[0.3, 0.8, 0.2]} position={[x, 3.6, -8.2]}>
          <meshLambertMaterial color="#7f8c8d" />
        </Box>
      ))}
      
      {/* Safety Cabinet - Enhanced */}
      <Box args={[2.5, 4, 1.2]} position={[9, 2, -7.8]}>
        <meshLambertMaterial color="#e74c3c" />
      </Box>
      {/* Cabinet Door */}
      <Box args={[2.3, 3.8, 0.1]} position={[9, 2, -7.1]}>
        <meshLambertMaterial color="#c0392b" />
      </Box>
      {/* Door Handle */}
      <Cylinder args={[0.05, 0.05, 0.2]} position={[8.2, 2, -7]} rotation={[0, 0, Math.PI/2]}>
        <meshLambertMaterial color="#bdc3c7" />
      </Cylinder>
      <Text
        position={[9, 3.5, -7]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        SAFETY
      </Text>
      <Text
        position={[9, 3.2, -7]}
        fontSize={0.12}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        EQUIPMENT
      </Text>
      
      {/* Fume Hood */}
      <Box args={[4, 3, 2]} position={[-8, 2.5, -7]}>
        <meshLambertMaterial color="#95a5a6" />
      </Box>
      <Box args={[3.8, 0.1, 1.8]} position={[-8, 4.1, -7]}>
        <meshLambertMaterial color="#7f8c8d" />
      </Box>
      <Text
        position={[-8, 1.2, -6]}
        fontSize={0.15}
        color="#2c3e50"
        anchorX="center"
      >
        FUME HOOD
      </Text>
      
      {/* Lab Equipment on Table */}
      <LabEquipment 
        position={[-3, 1.4, 0]} 
        type="beaker" 
        onClick={() => handleEquipmentClick('beaker')}
        isSelected={selectedEquipment === 'beaker'}
      />
      <LabEquipment 
        position={[-1, 1.4, 0]} 
        type="flask" 
        onClick={() => handleEquipmentClick('flask')}
        isSelected={selectedEquipment === 'flask'}
      />
      <LabEquipment 
        position={[1, 1.4, 0]} 
        type="testtube" 
        onClick={() => handleEquipmentClick('testtube')}
        isSelected={selectedEquipment === 'testtube'}
      />
      <LabEquipment 
        position={[3, 1.4, 0]} 
        type="burner" 
        onClick={() => handleEquipmentClick('burner')}
        isSelected={selectedEquipment === 'burner'}
      />
      
      {/* Additional Equipment on Table */}
      <group position={[-5, 1.4, 0.8]}>
        <Cylinder args={[0.15, 0.15, 0.3]} castShadow>
          <meshStandardMaterial color="#ff6b6b" />
        </Cylinder>
        <Text
          position={[0, -0.25, 0]}
          fontSize={0.08}
          color="#2c3e50"
          anchorX="center"
        >
          Scale
        </Text>
      </group>
      
      <group position={[5, 1.4, 0.8]}>
        <Box args={[0.6, 0.2, 0.4]} castShadow>
          <meshStandardMaterial color="#4ecdc4" />
        </Box>
        <Text
          position={[0, -0.2, 0]}
          fontSize={0.06}
          color="#2c3e50"
          anchorX="center"
        >
          pH Meter
        </Text>
      </group>
      
      {/* Chemical Substances on Wall Shelf */}
      {['NaCl', 'H₂SO₄', 'CaCO₃', 'AgNO₃', 'HCl', 'NaOH'].map((substance, i) => (
        <group key={i} position={[-4.5 + i * 1.5, 4.4, -7.8]}>
          <Cylinder args={[0.12, 0.12, 0.35]} position={[0, 0.18, 0]}>
            <meshLambertMaterial color={
              substance.includes('H₂SO₄') ? "#ff6b6b" :
              substance.includes('HCl') ? "#ffd93d" :
              substance.includes('NaOH') ? "#6bcf7f" : "#74b9ff"
            } />
          </Cylinder>
          <Text
            position={[0, -0.05, 0]}
            fontSize={0.06}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {substance}
          </Text>
        </group>
      ))}
      
      {/* Lab Equipment Storage on Side Cabinet */}
      {['Pipettes', 'Stirrers', 'Droppers'].map((item, i) => (
        <group key={i} position={[-9, 2.5 - i * 0.4, -5.2]}>
          <Box args={[0.6, 0.15, 0.3]}>
            <meshLambertMaterial color="#3498db" />
          </Box>
          <Text
            position={[0, 0, 0.2]}
            fontSize={0.06}
            color="white"
            anchorX="center"
          >
            {item}
          </Text>
        </group>
      ))}
      
      {/* Lab Title */}
      <Text
        position={[0, 7.5, -8.5]}
        fontSize={0.6}
        color="#2c3e50"
        anchorX="center"
        anchorY="middle"
        font="/fonts/roboto-bold.woff"
      >
        Virtual Chemistry Laboratory
      </Text>
      
      {/* Lab Room Lighting Fixtures */}
      {[-6, -2, 2, 6].map((x, i) => (
        <group key={i} position={[x, 8.5, 0]}>
          <Box args={[1.5, 0.1, 0.8]}>
            <meshLambertMaterial color="#ecf0f1" />
          </Box>
          <Box args={[1.3, 0.05, 0.6]} position={[0, -0.08, 0]}>
            <meshLambertMaterial color="#f39c12" emissive="#f39c12" emissiveIntensity={0.2} />
          </Box>
        </group>
      ))}
      
      {/* Instructions Panel */}
      <Box args={[6, 2, 0.1]} position={[6, 3, 0]}>
        <meshLambertMaterial color="#34495e" opacity={0.9} transparent />
      </Box>
      <Text
        position={[6, 3.5, 0.1]}
        fontSize={0.25}
        color="#ecf0f1"
        anchorX="center"
        anchorY="middle"
        maxWidth={5.5}
      >
        Instructions
      </Text>
      <Text
        position={[6, 3, 0.1]}
        fontSize={0.15}
        color="#bdc3c7"
        anchorX="center"
        anchorY="middle"
        maxWidth={5.5}
      >
        1. Click on equipment to select
        {experiment.step > 0 ? '\n2. Add substances to beaker' : '\n2. Start with the beaker'}
        {experiment.step > 1 ? '\n3. Heat the mixture' : '\n3. Follow the procedure'}
      </Text>
      
      {/* Experiment Status */}
      {experiment.step > 0 && (
        <Box args={[4, 1, 0.1]} position={[-6, 4, 0]}>
          <meshLambertMaterial color="#27ae60" opacity={0.9} transparent />
        </Box>
      )}
      {experiment.step > 0 && (
        <Text
          position={[-6, 4, 0.1]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Experiment Started!
          {experiment.substances.length > 0 && `\nSubstances: ${experiment.substances.join(', ')}`}
        </Text>
      )}
      
      {/* Safety Notice */}
      <Text
        position={[0, -0.5, 5]}
        fontSize={0.15}
        color="#e74c3c"
        anchorX="center"
        anchorY="middle"
      >
        ⚠️ Always follow safety protocols in real laboratories
      </Text>
    </>
  )
}

function ChemistryLab({ onBack }) {
  return (
    <div className="chemistry-lab">
      <Canvas 
        camera={{ position: [0, 4, 8], fov: 75 }}
        aria-label="Virtual Chemistry Laboratory"
        role="application"
        shadows
      >
        <ChemistryLabScene />
      </Canvas>
      
      {/* Back Button */}
      <button 
        className="back-btn"
        onClick={onBack}
        aria-label="Return to lobby"
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '12px 24px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          zIndex: 1000
        }}
      >
        ← Back to Lobby
      </button>
      
      {/* Lab Controls UI */}
      <div className="lab-controls">
        <div className="control-panel">
          <h3>Lab Controls</h3>
          <button 
            className="control-btn"
            onClick={() => console.log('Voice commands activated')}
            aria-label="Activate voice commands"
          >
            🎤 Voice Commands
          </button>
          <button 
            className="control-btn"
            onClick={() => console.log('Help opened')}
            aria-label="Open help guide"
          >
            ❓ Help
          </button>
          <button 
            className="control-btn emergency"
            onClick={() => console.log('Emergency stop')}
            aria-label="Emergency stop"
          >
            🛑 Emergency Stop
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChemistryLab
