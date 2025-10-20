"use client"

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useRef, useState, useEffect } from 'react'
import { OrbitControls, Environment, Text, Stars } from '@react-three/drei'
import * as THREE from 'three'

// Jetson Nano 3D Model Component (simplified geometric representation)
function JetsonNanoModel({ 
  position = [0, 0, 0] as [number, number, number], 
  processingActive, 
  onProcessingToggle,
  ...props 
}: { 
  position?: [number, number, number],
  processingActive: boolean,
  onProcessingToggle: () => void 
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const heatSinkRef = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.08
      // Much slower rotation
      groupRef.current.rotation.y += 0.001
    }
    
    // Heat sink animation - always reset to proper position
    if (heatSinkRef.current) {
      if (processingActive) {
        heatSinkRef.current.position.y = Math.sin(state.clock.elapsedTime * 8) * 0.005
      } else {
        heatSinkRef.current.position.y = 0
      }
    }
  })

  return (
    <group ref={groupRef} position={position} {...props}>
      {/* Multi-layer PCB Board with visible layers */}
      {/* Bottom layer */}
      <mesh
        position={[0, -0.005, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2.4, 0.02, 1.6]} />
        <meshStandardMaterial 
          color="#1e40af" 
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Core layer 1 */}
      <mesh
        position={[0, 0.015, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2.4, 0.02, 1.6]} />
        <meshStandardMaterial 
          color="#7c2d12" 
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      
      {/* Core layer 2 */}
      <mesh
        position={[0, 0.035, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2.4, 0.02, 1.6]} />
        <meshStandardMaterial 
          color="#166534" 
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      
      {/* Top solder mask layer */}
      <mesh
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[2.4, 0.02, 1.6]} />
        <meshStandardMaterial 
          color={hovered ? "#4ade80" : "#10b981"} 
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Ground planes - visible through cutouts */}
      {([
        [-0.8, 0.025, -0.6], [0.8, 0.025, -0.6], [-0.8, 0.025, 0.6], [0.8, 0.025, 0.6],
        [0, 0.025, -0.3], [0, 0.025, 0.3], [-0.4, 0.025, 0], [0.4, 0.025, 0]
      ] as [number, number, number][]).map((pos, i) => (
        <mesh key={`gnd-${i}`} position={pos} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.001]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* Via stitching - visible through holes */}
      {([
        [-1.0, 0.05, -0.5], [-0.5, 0.05, -0.5], [0, 0.05, -0.5], [0.5, 0.05, -0.5], [1.0, 0.05, -0.5],
        [-1.0, 0.05, 0], [-0.5, 0.05, 0], [0.5, 0.05, 0], [1.0, 0.05, 0],
        [-1.0, 0.05, 0.5], [-0.5, 0.05, 0.5], [0, 0.05, 0.5], [0.5, 0.05, 0.5], [1.0, 0.05, 0.5]
      ] as [number, number, number][]).map((pos, i) => (
        <mesh key={`via-${i}`} position={pos} castShadow>
          <cylinderGeometry args={[0.005, 0.005, 0.1]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* CPU/GPU Module */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[1.2, 0.15, 1.0]} />
        <meshStandardMaterial 
          color="#1f2937" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Advanced Heat Sink Assembly */}
      <group ref={heatSinkRef}>
        {/* Heat sink base plate */}
        <mesh position={[0, 0.18, 0]} castShadow>
          <boxGeometry args={[1.0, 0.08, 0.8]} />
          <meshStandardMaterial 
            color={processingActive ? "#7c3aed" : "#6b7280"} 
            metalness={0.9}
            roughness={0.1}
            emissive={processingActive ? "#7c3aed" : "#000000"}
            emissiveIntensity={processingActive ? 0.1 : 0}
          />
        </mesh>
        
        {/* Primary heat sink fins */}
        {[...Array(12)].map((_, i) => (
          <mesh key={`fin-${i}`} position={[-0.42 + i * 0.07, 0.28, 0]} castShadow>
            <boxGeometry args={[0.02, 0.2, 0.8]} />
            <meshStandardMaterial 
              color={processingActive ? "#a855f7" : "#9ca3af"} 
              metalness={0.9}
              roughness={0.1}
              emissive={processingActive ? "#a855f7" : "#000000"}
              emissiveIntensity={processingActive ? 0.2 : 0}
            />
          </mesh>
        ))}

        {/* Secondary micro-fins for increased surface area */}
        {[...Array(24)].map((_, i) => (
          <mesh key={`microfin-${i}`} position={[-0.46 + i * 0.04, 0.32, -0.35 + (i % 2) * 0.7]} castShadow>
            <boxGeometry args={[0.01, 0.12, 0.1]} />
            <meshStandardMaterial 
              color="#d1d5db" 
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        ))}

        {/* Heat pipes */}
        {[...Array(3)].map((_, i) => (
          <mesh key={`heatpipe-${i}`} position={[-0.2 + i * 0.2, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.8]} />
            <meshStandardMaterial 
              color="#e5e7eb" 
              metalness={0.95}
              roughness={0.05}
            />
          </mesh>
        ))}

        {/* Thermal interface material indicator */}
        <mesh position={[0, 0.145, 0]} castShadow>
          <boxGeometry args={[1.05, 0.01, 0.85]} />
          <meshStandardMaterial 
            color="#f3f4f6" 
            metalness={0.1}
            roughness={0.9}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Heat sink mounting screws */}
        {([
          [-0.4, 0.15, -0.3], [0.4, 0.15, -0.3], [-0.4, 0.15, 0.3], [0.4, 0.15, 0.3]
        ] as [number, number, number][]).map((pos, i) => (
          <mesh key={`screw-${i}`} position={pos} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.08]} />
            <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Detailed GPIO Pins - 40-pin header */}
      <mesh position={[-0.8, 0.05, -0.5]} castShadow>
        <boxGeometry args={[0.8, 0.3, 0.1]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      {/* Individual GPIO pins */}
      {[...Array(40)].map((_, i) => (
        <mesh 
          key={i} 
          position={[
            -1.15 + (i % 2) * 0.1, 
            0.2, 
            -0.45 - Math.floor(i / 2) * 0.025
          ]} 
          castShadow
        >
          <cylinderGeometry args={[0.01, 0.01, 0.15]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* Detailed USB 3.0 Ports */}
      <mesh position={[0.9, 0.05, 0.4]} castShadow>
        <boxGeometry args={[0.2, 0.15, 0.2]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.9, 0.05, 0.15]} castShadow>
        <boxGeometry args={[0.2, 0.15, 0.2]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {/* USB connector internals */}
      <mesh position={[0.85, 0.05, 0.4]} castShadow>
        <boxGeometry args={[0.1, 0.08, 0.15]} />
        <meshStandardMaterial color="#0ea5e9" />
      </mesh>
      <mesh position={[0.85, 0.05, 0.15]} castShadow>
        <boxGeometry args={[0.1, 0.08, 0.15]} />
        <meshStandardMaterial color="#0ea5e9" />
      </mesh>

      {/* Gigabit Ethernet Port */}
      <mesh position={[0.9, 0.05, -0.3]} castShadow>
        <boxGeometry args={[0.2, 0.15, 0.25]} />
        <meshStandardMaterial color="#059669" />
      </mesh>
      {/* Ethernet connector detail */}
      <mesh position={[0.85, 0.05, -0.3]} castShadow>
        <boxGeometry args={[0.1, 0.1, 0.2]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>

      {/* Barrel Jack Power Connector - More detailed */}
      <mesh position={[-0.9, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.15, 8]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {/* Power jack inner contact */}
      <mesh position={[-0.82, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.08]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Power jack threading */}
      {[...Array(4)].map((_, i) => (
        <mesh key={`thread-${i}`} position={[-0.92 - i * 0.01, 0.05, 0]} castShadow>
          <torusGeometry args={[0.075, 0.005, 6, 12]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
      ))}

      {/* MicroSD Card Slot */}
      <mesh position={[-0.9, 0.02, -0.4]} castShadow>
        <boxGeometry args={[0.15, 0.02, 0.2]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* Camera Connector (CSI) */}
      <mesh position={[0, 0.05, 0.8]} castShadow>
        <boxGeometry args={[0.6, 0.08, 0.05]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Display Connector (DSI) - More detailed */}
      <mesh position={[0.6, 0.05, -0.8]} castShadow>
        <boxGeometry args={[0.4, 0.08, 0.05]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {/* DSI connector pins */}
      {[...Array(15)].map((_, i) => (
        <mesh key={`dsi-${i}`} position={[0.45 + i * 0.01, 0.06, -0.8]} castShadow>
          <boxGeometry args={[0.005, 0.02, 0.01]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* I2S Audio Header */}
      <mesh position={[-0.4, 0.05, -0.8]} castShadow>
        <boxGeometry args={[0.2, 0.08, 0.05]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      {/* I2S pins */}
      {[...Array(4)].map((_, i) => (
        <mesh key={`i2s-${i}`} position={[-0.45 + i * 0.025, 0.06, -0.8]} castShadow>
          <cylinderGeometry args={[0.005, 0.005, 0.02]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* Fan Header (5V PWM) */}
      <mesh position={[-0.6, 0.05, 0.8]} castShadow>
        <boxGeometry args={[0.15, 0.08, 0.05]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {/* Fan header pins */}
      {[...Array(4)].map((_, i) => (
        <mesh key={`fan-${i}`} position={[-0.635 + i * 0.025, 0.06, 0.8]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.02]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* UART Debug Header */}
      <mesh position={[0.3, 0.05, 0.8]} castShadow>
        <boxGeometry args={[0.1, 0.08, 0.05]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      {/* UART pins */}
      {[...Array(3)].map((_, i) => (
        <mesh key={`uart-${i}`} position={[0.275 + i * 0.025, 0.06, 0.8]} castShadow>
          <cylinderGeometry args={[0.006, 0.006, 0.02]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* Boot Configuration Jumpers */}
      <mesh position={[0.8, 0.05, 0.6]} castShadow>
        <boxGeometry args={[0.08, 0.06, 0.04]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Jumper pins */}
      {[...Array(6)].map((_, i) => (
        <mesh key={`jumper-${i}`} position={[0.785 + (i % 2) * 0.015, 0.06, 0.585 + Math.floor(i / 2) * 0.01]} castShadow>
          <cylinderGeometry args={[0.004, 0.004, 0.015]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* Reset Button */}
      <mesh position={[-0.8, 0.08, 0.5]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.02]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[-0.8, 0.09, 0.5]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.01]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Recovery Button */}
      <mesh position={[-0.8, 0.08, -0.5]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.02]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      <mesh position={[-0.8, 0.09, -0.5]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.01]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>



      {/* Surface Mount Components - Much more detailed */}
      {/* SMD Capacitors */}
      {([
        [-0.6, 0.07, -0.2], [-0.4, 0.07, -0.2], [-0.2, 0.07, -0.2], [0, 0.07, -0.2],
        [0.2, 0.07, -0.2], [0.4, 0.07, -0.2], [-0.6, 0.07, 0.1], [-0.4, 0.07, 0.1],
        [-0.2, 0.07, 0.1], [0, 0.07, 0.1], [0.2, 0.07, 0.1], [0.4, 0.07, 0.1],
        [-0.7, 0.07, 0.4], [-0.5, 0.07, 0.4], [0.5, 0.07, 0.4], [0.7, 0.07, 0.4],
        [-0.3, 0.07, 0.5], [0.1, 0.07, 0.5], [0.3, 0.07, 0.5]
      ] as [number, number, number][]).map((pos, i) => (
        <mesh key={`cap-${i}`} position={pos} castShadow>
          <boxGeometry args={[0.025, 0.015, 0.02]} />
          <meshStandardMaterial 
            color={i % 4 === 0 ? "#fbbf24" : i % 4 === 1 ? "#ef4444" : i % 4 === 2 ? "#3b82f6" : "#10b981"}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* SMD Resistors */}
      {([
        [-0.8, 0.07, -0.1], [-0.6, 0.07, -0.1], [-0.4, 0.07, -0.1], [-0.2, 0.07, -0.1],
        [0, 0.07, -0.1], [0.2, 0.07, -0.1], [0.4, 0.07, -0.1], [0.6, 0.07, -0.1],
        [-0.5, 0.07, 0.2], [-0.3, 0.07, 0.2], [-0.1, 0.07, 0.2], [0.1, 0.07, 0.2],
        [0.3, 0.07, 0.2], [0.5, 0.07, 0.2]
      ] as [number, number, number][]).map((pos, i) => (
        <mesh key={`res-${i}`} position={pos} castShadow>
          <boxGeometry args={[0.02, 0.01, 0.015]} />
          <meshStandardMaterial 
            color="#1f2937" 
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
      ))}

      {/* Inductors and Ferrite Beads */}
      {([
        [-0.3, 0.08, -0.4], [0.3, 0.08, -0.4], [-0.2, 0.08, 0.3], [0.2, 0.08, 0.3],
        [0.6, 0.08, 0], [-0.6, 0.08, 0]
      ] as [number, number, number][]).map((pos, i) => (
        <mesh key={`ind-${i}`} position={pos} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.04]} />
          <meshStandardMaterial 
            color="#374151" 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Detailed ICs and Microchips */}
      {([
        [-0.4, 0.075, -0.5], [0.4, 0.075, -0.5], [-0.6, 0.075, 0.2], 
        [0.6, 0.075, 0.2], [-0.2, 0.075, 0.6], [0.2, 0.075, 0.6]
      ] as [number, number, number][]).map((pos, i) => (
        <group key={`ic-${i}`}>
          <mesh position={pos} castShadow>
            <boxGeometry args={[0.08, 0.02, 0.08]} />
            <meshStandardMaterial 
              color="#0f172a" 
              metalness={0.1}
              roughness={0.8}
            />
          </mesh>
          {/* IC pins */}
          {[...Array(16)].map((_, pinIndex) => {
            const side = Math.floor(pinIndex / 4)
            const position = pinIndex % 4
            const pinPos: [number, number, number] = [
              pos[0] + (side === 0 ? -0.045 : side === 2 ? 0.045 : (position - 1.5) * 0.01),
              pos[1] - 0.005,
              pos[2] + (side === 1 ? -0.045 : side === 3 ? 0.045 : (position - 1.5) * 0.01)
            ]
            return (
              <mesh key={`pin-${pinIndex}`} position={pinPos} castShadow>
                <cylinderGeometry args={[0.002, 0.002, 0.01]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
              </mesh>
            )
          })}
        </group>
      ))}

      {/* Crystal Oscillators and Clock Sources */}
      <mesh position={[0.4, 0.08, 0.2]} castShadow>
        <boxGeometry args={[0.08, 0.05, 0.06]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.35, 0.08, -0.15]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.03]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.15, 0.08, -0.35]} castShadow>
        <boxGeometry args={[0.04, 0.03, 0.04]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Power Management ICs and Voltage Regulators */}
      <mesh position={[-0.3, 0.08, 0.3]} castShadow>
        <boxGeometry args={[0.08, 0.04, 0.08]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.2, 0.08, 0.4]} castShadow>
        <boxGeometry args={[0.06, 0.04, 0.06]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[-0.5, 0.08, -0.3]} castShadow>
        <boxGeometry args={[0.05, 0.03, 0.05]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.5, 0.08, -0.1]} castShadow>
        <boxGeometry args={[0.04, 0.03, 0.04]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* EEPROM and Flash Memory */}
      <mesh position={[-0.1, 0.075, -0.6]} castShadow>
        <boxGeometry args={[0.06, 0.02, 0.04]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh position={[0.3, 0.075, -0.6]} castShadow>
        <boxGeometry args={[0.05, 0.02, 0.03]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Temperature Sensors */}
      <mesh position={[0.7, 0.07, -0.2]} castShadow>
        <boxGeometry args={[0.02, 0.01, 0.015]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[-0.7, 0.07, 0.1]} castShadow>
        <boxGeometry args={[0.02, 0.01, 0.015]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* Audio Codec */}
      <mesh position={[0.1, 0.08, -0.7]} castShadow>
        <boxGeometry args={[0.1, 0.03, 0.08]} />
        <meshStandardMaterial color="#6366f1" />
      </mesh>

      {/* WiFi/Bluetooth Module Connector */}
      <mesh position={[-0.2, 0.08, -0.75]} castShadow>
        <boxGeometry args={[0.3, 0.04, 0.08]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* Test Points */}
      {([
        [0.8, 0.07, 0.3], [0.8, 0.07, 0.1], [0.8, 0.07, -0.1], [0.8, 0.07, -0.3],
        [-0.8, 0.07, 0.3], [-0.8, 0.07, 0.1], [-0.8, 0.07, -0.1], [-0.8, 0.07, -0.3],
        [0.3, 0.07, 0.8], [0.1, 0.07, 0.8], [-0.1, 0.07, 0.8], [-0.3, 0.07, 0.8]
      ] as [number, number, number][]).map((pos, i) => (
        <mesh key={`tp-${i}`} position={pos} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.01]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* PCB Traces - Visible routing */}
      {([
        [[-0.5, 0.055, -0.2], [0.5, 0.055, -0.2]], [[-0.3, 0.055, 0.1], [0.3, 0.055, 0.1]],
        [[0, 0.055, -0.5], [0, 0.055, 0.5]], [[-0.7, 0.055, 0], [0.7, 0.055, 0]],
        [[-0.4, 0.055, -0.4], [0.4, 0.055, 0.4]], [[0.2, 0.055, -0.3], [0.2, 0.055, 0.3]]
      ] as [[number, number, number], [number, number, number]][]).map((trace, i) => {
        const start = new THREE.Vector3(...trace[0])
        const end = new THREE.Vector3(...trace[1])
        const direction = new THREE.Vector3().subVectors(end, start)
        const length = direction.length()
        const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
        
        return (
          <mesh key={`trace-${i}`} position={[center.x, center.y, center.z]} castShadow>
            <boxGeometry args={[length, 0.002, 0.005]} />
            <meshStandardMaterial color="#10b981" metalness={0.8} roughness={0.3} />
          </mesh>
        )
      })}

      {/* Mounting Holes */}
      {([
        [-1.0, 0.02, -0.7], [1.0, 0.02, -0.7], [-1.0, 0.02, 0.7], [1.0, 0.02, 0.7]
      ] as [number, number, number][]).map((pos, i) => (
        <mesh key={`hole-${i}`} position={pos}>
          <cylinderGeometry args={[0.04, 0.04, 0.12]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      ))}

      {/* Board Silkscreen Text */}
      <Text
        position={[-0.8, 0.065, 0.6]}
        fontSize={0.02}
        color="#f8fafc"
        anchorX="left"
        anchorY="middle"
        rotation={[Math.PI / 2, 0, 0]}
      >
        J41 GPIO
      </Text>
      
      <Text
        position={[0.7, 0.065, 0.3]}
        fontSize={0.015}
        color="#f8fafc"
        anchorX="center"
        anchorY="middle"
        rotation={[Math.PI / 2, 0, 0]}
      >
        USB3.0
      </Text>

      <Text
        position={[0.7, 0.065, -0.3]}
        fontSize={0.015}
        color="#f8fafc"
        anchorX="center"
        anchorY="middle"
        rotation={[Math.PI / 2, 0, 0]}
      >
        ETH
      </Text>

      {/* WiFi/BT Antenna Traces */}
      {([
        [[-0.8, 0.056, 0.7], [-0.6, 0.056, 0.7]], [[-0.6, 0.056, 0.7], [-0.6, 0.056, 0.5]],
        [[-0.6, 0.056, 0.5], [-0.4, 0.056, 0.5]], [[-0.4, 0.056, 0.5], [-0.4, 0.056, 0.7]],
        [[-0.4, 0.056, 0.7], [-0.2, 0.056, 0.7]], [[-0.2, 0.056, 0.7], [-0.2, 0.056, 0.5]]
      ] as [[number, number, number], [number, number, number]][]).map((trace, i) => {
        const start = new THREE.Vector3(...trace[0])
        const end = new THREE.Vector3(...trace[1])
        const direction = new THREE.Vector3().subVectors(end, start)
        const length = direction.length()
        const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
        
        return (
          <mesh key={`antenna-${i}`} position={[center.x, center.y, center.z]} castShadow>
            <boxGeometry args={[length, 0.003, 0.008]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
          </mesh>
        )
      })}

      {/* Antenna pads */}
      {([
        [-0.8, 0.057, 0.7], [-0.2, 0.057, 0.5]
      ] as [number, number, number][]).map((pos, i) => (
        <mesh key={`antpad-${i}`} position={pos} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.002]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* Electromagnetic shielding cans */}
      <mesh position={[-0.3, 0.12, 0.6]} castShadow>
        <boxGeometry args={[0.2, 0.08, 0.15]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.3, 0.12, 0.6]} castShadow>
        <boxGeometry args={[0.15, 0.06, 0.12]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* High-frequency crystal oscillators */}
      <mesh position={[0.6, 0.08, 0.1]} castShadow>
        <boxGeometry args={[0.03, 0.025, 0.025]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.6, 0.08, -0.05]} castShadow>
        <boxGeometry args={[0.025, 0.02, 0.02]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* ESD protection diodes */}
      {([
        [0.85, 0.07, 0.35], [0.85, 0.07, 0.05], [0.85, 0.07, -0.35]
      ] as [number, number, number][]).map((pos, i) => (
        <mesh key={`esd-${i}`} position={pos} castShadow>
          <boxGeometry args={[0.01, 0.008, 0.006]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      ))}

      {/* Decoupling capacitor arrays */}
      {([
        [-0.1, 0.07, -0.05], [0.1, 0.07, -0.05], [-0.05, 0.07, 0.05], [0.05, 0.07, 0.05]
      ] as [number, number, number][]).map((pos, i) => (
        <group key={`decap-${i}`}>
          {[...Array(4)].map((_, j) => (
            <mesh key={j} position={[pos[0] + (j % 2) * 0.015, pos[1], pos[2] + Math.floor(j / 2) * 0.01]} castShadow>
              <boxGeometry args={[0.008, 0.006, 0.005]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.4} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Board edge connector gold fingers */}
      {[...Array(20)].map((_, i) => (
        <mesh key={`gold-${i}`} position={[-1.15, 0.052, -0.7 + i * 0.07]} castShadow>
          <boxGeometry args={[0.05, 0.001, 0.02]} />
          <meshStandardMaterial color="#ffd700" metalness={0.95} roughness={0.05} />
        </mesh>
      ))}

      {/* Manufacturing date and lot code */}
      <Text
        position={[0.8, 0.065, 0.8]}
        fontSize={0.008}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
        rotation={[Math.PI / 2, 0, 0]}
      >
        2024.42
      </Text>
      
      <Text
        position={[-0.8, 0.065, -0.8]}
        fontSize={0.008}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
        rotation={[Math.PI / 2, 0, 0]}
      >
        LOT: A7B2C
      </Text>

      {/* Enhanced Status LEDs */}
      {/* Power LED - Always on */}
      <mesh position={[0.4, 0.08, 0.7]} castShadow>
        <sphereGeometry args={[0.025]} />
        <meshStandardMaterial 
          color="#ef4444" 
          emissive="#ef4444"
          emissiveIntensity={0.8}
        />
      </mesh>
      
      {/* Activity LED - Dynamic blinking */}
      <mesh position={[0.5, 0.08, 0.7]} castShadow>
        <sphereGeometry args={[0.025]} />
        <meshStandardMaterial 
          color="#22c55e" 
          emissive="#22c55e"
          emissiveIntensity={processingActive ? 0.9 : 0.3}
        />
      </mesh>

      {/* Network LED - Pulsing */}
      <mesh position={[0.6, 0.08, 0.7]} castShadow>
        <sphereGeometry args={[0.025]} />
        <meshStandardMaterial 
          color="#f59e0b" 
          emissive="#f59e0b"
          emissiveIntensity={hovered ? 0.8 : 0.5}
        />
      </mesh>

      {/* AI Processing LED - Intense when active */}
      <mesh position={[0.7, 0.08, 0.7]} castShadow>
        <sphereGeometry args={[0.025]} />
        <meshStandardMaterial 
          color="#8b5cf6" 
          emissive="#8b5cf6"
          emissiveIntensity={processingActive ? 1.0 : 0.4}
        />
      </mesh>

      {/* LED Labels */}
      <Text
        position={[0.4, 0.15, 0.7]}
        fontSize={0.02}
        color="#ef4444"
        anchorX="center"
        anchorY="bottom"
      >
        PWR
      </Text>
      
      <Text
        position={[0.5, 0.15, 0.7]}
        fontSize={0.02}
        color="#22c55e"
        anchorX="center"
        anchorY="bottom"
      >
        ACT
      </Text>

      <Text
        position={[0.6, 0.15, 0.7]}
        fontSize={0.02}
        color="#f59e0b"
        anchorX="center"
        anchorY="bottom"
      >
        NET
      </Text>

      <Text
        position={[0.7, 0.15, 0.7]}
        fontSize={0.02}
        color="#8b5cf6"
        anchorX="center"
        anchorY="bottom"
      >
        AI
      </Text>

      {/* Always Visible Text Labels */}
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.12}
        color="#a855f7"
        anchorX="center"
        anchorY="middle"
      >
        NVIDIA Jetson Nano
      </Text>
      
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.06}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
      >
        AI Computing Module
      </Text>

      {/* Always Visible Technical Specifications */}
      <>
        {/* GPU Specifications */}
        <group position={[-1.8, 0.5, 0.8]}>
          <Text fontSize={0.045} color="#06d6a0" anchorX="center" anchorY="top">
            GPU SPECS
          </Text>
          <Text position={[0, -0.08, 0]} fontSize={0.03} color="#64748b" anchorX="center">
            128-core Maxwell
          </Text>
          <Text position={[0, -0.14, 0]} fontSize={0.025} color="#64748b" anchorX="center">
            921 MHz
          </Text>
          <Text position={[0, -0.19, 0]} fontSize={0.025} color="#64748b" anchorX="center">
            CUDA Compute 5.3
          </Text>
        </group>

        {/* CPU Specifications */}
        <group position={[1.8, 0.5, 0.8]}>
          <Text fontSize={0.045} color="#f59e0b" anchorX="center" anchorY="top">
            CPU SPECS
          </Text>
          <Text position={[0, -0.08, 0]} fontSize={0.03} color="#64748b" anchorX="center">
            Quad-core ARM A57
          </Text>
          <Text position={[0, -0.14, 0]} fontSize={0.025} color="#64748b" anchorX="center">
            1.43 GHz
          </Text>
          <Text position={[0, -0.19, 0]} fontSize={0.025} color="#64748b" anchorX="center">
            64-bit ARMv8
          </Text>
        </group>

        {/* Memory Specifications */}
        <group position={[0, 0.5, -1.5]}>
          <Text fontSize={0.045} color="#ef4444" anchorX="center" anchorY="top">
            MEMORY
          </Text>
          <Text position={[0, -0.08, 0]} fontSize={0.03} color="#64748b" anchorX="center">
            4GB LPDDR4
          </Text>
          <Text position={[0, -0.14, 0]} fontSize={0.025} color="#64748b" anchorX="center">
            25.6 GB/s
          </Text>
          <Text position={[0, -0.19, 0]} fontSize={0.025} color="#64748b" anchorX="center">
            1600 MHz
          </Text>
        </group>

        {/* AI Performance */}
        <group position={[0, -0.1, 1.5]}>
          <Text fontSize={0.045} color="#8b5cf6" anchorX="center" anchorY="top">
            AI PERFORMANCE
          </Text>
          <Text position={[0, -0.08, 0]} fontSize={0.03} color="#64748b" anchorX="center">
            472 GFLOPS (FP16)
          </Text>
          <Text position={[0, -0.14, 0]} fontSize={0.025} color="#64748b" anchorX="center">
            TensorRT Support
          </Text>
          <Text position={[0, -0.19, 0]} fontSize={0.025} color="#64748b" anchorX="center">
            NVENC/NVDEC
          </Text>
        </group>

        {/* Connectivity */}
        <group position={[-1.5, -0.3, -0.8]}>
          <Text fontSize={0.04} color="#10b981" anchorX="center" anchorY="top">
            CONNECTIVITY
          </Text>
          <Text position={[0, -0.08, 0]} fontSize={0.025} color="#64748b" anchorX="center">
            Gigabit Ethernet
          </Text>
          <Text position={[0, -0.13, 0]} fontSize={0.025} color="#64748b" anchorX="center">
            4x USB 3.0
          </Text>
          <Text position={[0, -0.18, 0]} fontSize={0.025} color="#64748b" anchorX="center">
            CSI/DSI
          </Text>
        </group>

        {/* Power Consumption */}
        <group position={[1.5, -0.3, -0.8]}>
          <Text fontSize={0.04} color="#f97316" anchorX="center" anchorY="top">
            POWER
          </Text>
          <Text position={[0, -0.08, 0]} fontSize={0.025} color="#64748b" anchorX="center">
            5W Typical
          </Text>
          <Text position={[0, -0.13, 0]} fontSize={0.025} color="#64748b" anchorX="center">
            10W Maximum
          </Text>
          <Text position={[0, -0.18, 0]} fontSize={0.025} color="#64748b" anchorX="center">
            5V DC Input
          </Text>
        </group>
      </>

      {/* Always Visible Holographic Effects */}
      <group>
        {/* Main holographic sphere */}
        <mesh>
          <sphereGeometry args={[1.8, 32, 32]} />
          <meshBasicMaterial 
            color="#8b5cf6" 
            transparent 
            opacity={hovered ? 0.12 : 0.06}
            wireframe
          />
        </mesh>
        
        {/* Inner holographic field */}
        <mesh>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshBasicMaterial 
            color={processingActive ? "#06d6a0" : "#8b5cf6"} 
            transparent 
            opacity={processingActive ? 0.15 : 0.04}
            wireframe
          />
        </mesh>
        
        {/* Data flow rings */}
        {[...Array(3)].map((_, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, i * Math.PI / 3]}>
            <torusGeometry args={[0.8 + i * 0.3, 0.02, 8, 32]} />
            <meshStandardMaterial 
              color="#06d6a0" 
              transparent 
              opacity={processingActive ? 0.6 : 0.15}
              emissive="#06d6a0"
              emissiveIntensity={processingActive ? 0.3 : 0.08}
            />
          </mesh>
        ))}
      </group>

      {/* Processing Energy Field */}
      {processingActive && (
        <mesh>
          <sphereGeometry args={[2.2, 16, 16]} />
          <meshBasicMaterial 
            color="#7c3aed" 
            transparent 
            opacity={0.03}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Interactive Toggle Button - Positioned to the right side */}
      <mesh 
        position={[2.5, 0, 0]} 
        onClick={onProcessingToggle}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'default'
        }}
      >
        <boxGeometry args={[0.6, 0.3, 0.15]} />
        <meshStandardMaterial 
          color={processingActive ? "#10b981" : "#374151"}
          emissive={processingActive ? "#059669" : "#000000"}
          emissiveIntensity={processingActive ? 0.3 : 0}
        />
      </mesh>
      
      {/* Button Text */}
      <Text
        position={[2.5, 0, 0.08]}
        fontSize={0.06}
        color={processingActive ? "#ffffff" : "#9ca3af"}
        anchorX="center"
        anchorY="middle"
      >
        {processingActive ? "AI ACTIVE" : "AI IDLE"}
      </Text>

      {/* Button Instruction */}
      <Text
        position={[2.5, -0.3, 0]}
        fontSize={0.04}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
      >
        Click to Toggle
      </Text>

    </group>
  )
}



// Clean Scene with Single Detailed Model
function Scene() {
  const [processingActive, setProcessingActive] = useState(false);
  const handleProcessingToggle = () => setProcessingActive((prev) => !prev);
  return (
    <group>
      <JetsonNanoModel 
        position={[0, 0, 0]} 
        processingActive={processingActive} 
        onProcessingToggle={handleProcessingToggle}
      />
    </group>
  );
}

// Loading Component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 animate-spin">
          <div className="w-full h-full border-4 border-primary/30 border-t-primary rounded-full"></div>
        </div>
        <div className="text-primary animate-pulse font-medium">Loading 3D Scene...</div>
      </div>
    </div>
  )
}

// Fallback for WebGL not supported
function WebGLFallback() {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20">
      <div className="text-center p-8">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
          <div className="text-white text-2xl font-bold">JN</div>
        </div>
        <h3 className="text-xl font-bold text-primary mb-2">NVIDIA Jetson Nano</h3>
        <p className="text-muted-foreground mb-4">AI Computing Module</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-semibold text-primary">GPU</div>
            <div className="text-muted-foreground">128-core Maxwell</div>
          </div>
          <div>
            <div className="font-semibold text-primary">CPU</div>
            <div className="text-muted-foreground">Quad-core ARM A57</div>
          </div>
          <div>
            <div className="font-semibold text-primary">Memory</div>
            <div className="text-muted-foreground">4GB LPDDR4</div>
          </div>
          <div>
            <div className="font-semibold text-primary">AI Performance</div>
            <div className="text-muted-foreground">472 GFLOPS</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simplified Camera Controller (No Auto Rotation)
function CameraController() {
  // Camera is now fully controlled by OrbitControls
  // No automatic movement or rotation
  return null
}

// Main Scene Component
export function JetsonNanoScene() {
  const [mounted, setMounted] = useState(false)
  const [webglSupported, setWebglSupported] = useState(true)

  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
      setWebglSupported(false)
    }
    setMounted(true)
  }, [])

  if (!mounted) {
    return <LoadingFallback />
  }

  if (!webglSupported) {
    return <WebGLFallback />
  }

  return (
    <Canvas
      shadows
      camera={{ position: [6, 4, 6], fov: 50 }}
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1
      }}
      gl={{ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      }}
      onCreated={({ gl }) => {
        gl.setClearColor('#000000', 0) // Fully transparent background
      }}
    >
        <Suspense fallback={null}>
          {/* Enhanced Camera with Zoom */}
          <CameraController />

          {/* Interactive Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={15}
            autoRotate={false}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            target={[0, 0, 0]}
          />

          {/* Lighting Setup */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[-5, 5, -5]} intensity={0.6} color="#8b5cf6" />
          <pointLight position={[5, 5, 5]} intensity={0.6} color="#06d6a0" />
          <spotLight 
            position={[0, 10, 0]} 
            intensity={0.8} 
            angle={0.6} 
            penumbra={1} 
            color="#ffffff"
            castShadow
          />

          {/* Environment and Effects */}
          <Stars 
            radius={100} 
            depth={50} 
            count={1000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={1}
          />
          
          {/* Fog for depth */}
          <fog attach="fog" args={['#0f0f23', 5, 30]} />

          {/* 3D Scene */}
          <Scene />
        </Suspense>
      </Canvas>
  )
}

export default JetsonNanoScene