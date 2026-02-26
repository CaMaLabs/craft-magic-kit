import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/**
 * Minecraft skin UV layout (64×64):
 * Maps each body part to its UV rectangle on the skin texture.
 * Format: [u, v, width, height] in pixel coords on 64×64 texture.
 */

const TEX_W = 64;
const TEX_H = 64;

function uvRect(x: number, y: number, w: number, h: number): [number, number, number, number] {
  return [x / TEX_W, 1 - (y + h) / TEX_H, w / TEX_W, h / TEX_H];
}

// Each box face order in Three.js BoxGeometry: +x, -x, +y, -y, +z, -z
// Minecraft skin UV for each part: [right, front, left, back, top, bottom]

interface FaceUV {
  right: [number, number, number, number];
  left: [number, number, number, number];
  top: [number, number, number, number];
  bottom: [number, number, number, number];
  front: [number, number, number, number];
  back: [number, number, number, number];
}

function getHeadUVs(): FaceUV {
  return {
    right: uvRect(0, 8, 8, 8),
    front: uvRect(8, 8, 8, 8),
    left: uvRect(16, 8, 8, 8),
    back: uvRect(24, 8, 8, 8),
    top: uvRect(8, 0, 8, 8),
    bottom: uvRect(16, 0, 8, 8),
  };
}

function getBodyUVs(): FaceUV {
  return {
    right: uvRect(16, 20, 4, 12),
    front: uvRect(20, 20, 8, 12),
    left: uvRect(28, 20, 4, 12),
    back: uvRect(32, 20, 8, 12),
    top: uvRect(20, 16, 8, 4),
    bottom: uvRect(28, 16, 8, 4),
  };
}

function getRightArmUVs(): FaceUV {
  return {
    right: uvRect(40, 20, 4, 12),
    front: uvRect(44, 20, 4, 12),
    left: uvRect(48, 20, 4, 12),
    back: uvRect(52, 20, 4, 12),
    top: uvRect(44, 16, 4, 4),
    bottom: uvRect(48, 16, 4, 4),
  };
}

function getLeftArmUVs(): FaceUV {
  return {
    right: uvRect(32, 52, 4, 12),
    front: uvRect(36, 52, 4, 12),
    left: uvRect(40, 52, 4, 12),
    back: uvRect(44, 52, 4, 12),
    top: uvRect(36, 48, 4, 4),
    bottom: uvRect(40, 48, 4, 4),
  };
}

function getRightLegUVs(): FaceUV {
  return {
    right: uvRect(0, 20, 4, 12),
    front: uvRect(4, 20, 4, 12),
    left: uvRect(8, 20, 4, 12),
    back: uvRect(12, 20, 4, 12),
    top: uvRect(4, 16, 4, 4),
    bottom: uvRect(8, 16, 4, 4),
  };
}

function getLeftLegUVs(): FaceUV {
  return {
    right: uvRect(16, 52, 4, 12),
    front: uvRect(20, 52, 4, 12),
    left: uvRect(24, 52, 4, 12),
    back: uvRect(28, 52, 4, 12),
    top: uvRect(20, 48, 4, 4),
    bottom: uvRect(24, 48, 4, 4),
  };
}

function applyUVs(geometry: THREE.BoxGeometry, faceUVs: FaceUV) {
  const uvAttr = geometry.getAttribute("uv");
  const uvs = uvAttr.array as Float32Array;

  // Three.js BoxGeometry face order: +x(right), -x(left), +y(top), -y(bottom), +z(front), -z(back)
  const faceOrder: (keyof FaceUV)[] = ["right", "left", "top", "bottom", "front", "back"];

  for (let face = 0; face < 6; face++) {
    const [u, v, w, h] = faceUVs[faceOrder[face]];
    const idx = face * 8; // 4 vertices × 2 components

    // vertex 0: top-left
    uvs[idx + 0] = u;
    uvs[idx + 1] = v + h;
    // vertex 1: top-right
    uvs[idx + 2] = u + w;
    uvs[idx + 3] = v + h;
    // vertex 2: bottom-left
    uvs[idx + 4] = u;
    uvs[idx + 5] = v;
    // vertex 3: bottom-right
    uvs[idx + 6] = u + w;
    uvs[idx + 7] = v;
  }

  uvAttr.needsUpdate = true;
}

function SkinPart({
  size,
  position,
  faceUVs,
  texture,
}: {
  size: [number, number, number];
  position: [number, number, number];
  faceUVs: FaceUV;
  texture: THREE.Texture;
}) {
  const geometryRef = useRef<THREE.BoxGeometry>(null);

  useEffect(() => {
    if (geometryRef.current) {
      applyUVs(geometryRef.current, faceUVs);
    }
  }, [faceUVs]);

  return (
    <mesh position={position}>
      <boxGeometry ref={geometryRef} args={size} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function MinecraftCharacter({ textureUrl, isSlim }: { textureUrl: string; isSlim: boolean }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(textureUrl, (tex) => {
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    });
  }, [textureUrl]);

  // Gentle idle animation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const armWidth = isSlim ? 3 / 16 : 4 / 16;

  if (!texture) return null;

  // All sizes in Minecraft-unit scale (1 unit = 1/16 block)
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Head */}
      <SkinPart
        size={[8 / 16, 8 / 16, 8 / 16]}
        position={[0, 12 / 16, 0]}
        faceUVs={getHeadUVs()}
        texture={texture}
      />
      {/* Body */}
      <SkinPart
        size={[8 / 16, 12 / 16, 4 / 16]}
        position={[0, 4 / 16, 0]}
        faceUVs={getBodyUVs()}
        texture={texture}
      />
      {/* Right Arm */}
      <SkinPart
        size={[armWidth, 12 / 16, 4 / 16]}
        position={[-(8 / 16 / 2 + armWidth / 2), 4 / 16, 0]}
        faceUVs={getRightArmUVs()}
        texture={texture}
      />
      {/* Left Arm */}
      <SkinPart
        size={[armWidth, 12 / 16, 4 / 16]}
        position={[8 / 16 / 2 + armWidth / 2, 4 / 16, 0]}
        faceUVs={getLeftArmUVs()}
        texture={texture}
      />
      {/* Right Leg */}
      <SkinPart
        size={[4 / 16, 12 / 16, 4 / 16]}
        position={[-2 / 16, -8 / 16, 0]}
        faceUVs={getRightLegUVs()}
        texture={texture}
      />
      {/* Left Leg */}
      <SkinPart
        size={[4 / 16, 12 / 16, 4 / 16]}
        position={[2 / 16, -8 / 16, 0]}
        faceUVs={getLeftLegUVs()}
        texture={texture}
      />
    </group>
  );
}

interface SkinPreview3DProps {
  textureUrl: string | null;
  skinType: string; // "steve" | "alex"
  skinStyle: string;
}

// Generate a placeholder skin canvas based on style
function generatePlaceholderSkin(style: string): string {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;

  const colors: Record<string, { main: string; secondary: string; accent: string }> = {
    warrior: { main: "#8B0000", secondary: "#4a4a4a", accent: "#FFD700" },
    explorer: { main: "#2E7D32", secondary: "#5D4037", accent: "#FFA000" },
    wizard: { main: "#4A148C", secondary: "#1A237E", accent: "#E040FB" },
    robot: { main: "#607D8B", secondary: "#455A64", accent: "#00E5FF" },
    animal: { main: "#FF8A65", secondary: "#F4511E", accent: "#FFFFFF" },
    custom: { main: "#2196F3", secondary: "#1565C0", accent: "#64FFDA" },
  };

  const c = colors[style] || colors.custom;

  // Clear
  ctx.clearRect(0, 0, 64, 64);

  // Head (8x8 at 8,8)
  ctx.fillStyle = c.accent;
  ctx.fillRect(8, 8, 8, 8);
  // Eyes
  ctx.fillStyle = "#000";
  ctx.fillRect(10, 11, 2, 1);
  ctx.fillRect(14, 11, 2, 1);
  // Mouth
  ctx.fillRect(11, 13, 4, 1);
  // Head top
  ctx.fillStyle = c.secondary;
  ctx.fillRect(8, 0, 8, 8);
  // Head sides
  ctx.fillStyle = c.accent;
  ctx.fillRect(0, 8, 8, 8);
  ctx.fillRect(16, 8, 8, 8);
  ctx.fillRect(24, 8, 8, 8);

  // Body (8x12 at 20,20)
  ctx.fillStyle = c.main;
  ctx.fillRect(20, 20, 8, 12);
  // Belt
  ctx.fillStyle = c.accent;
  ctx.fillRect(20, 28, 8, 2);
  // Body sides
  ctx.fillStyle = c.main;
  ctx.fillRect(16, 20, 4, 12);
  ctx.fillRect(28, 20, 4, 12);
  ctx.fillRect(32, 20, 8, 12);
  // Body top/bottom
  ctx.fillRect(20, 16, 8, 4);
  ctx.fillRect(28, 16, 8, 4);

  // Right arm (4x12 at 44,20)
  ctx.fillStyle = c.main;
  ctx.fillRect(44, 20, 4, 12);
  ctx.fillRect(40, 20, 4, 12);
  ctx.fillRect(48, 20, 4, 12);
  ctx.fillRect(52, 20, 4, 12);
  ctx.fillRect(44, 16, 4, 4);

  // Right leg (4x12 at 4,20)
  ctx.fillStyle = c.secondary;
  ctx.fillRect(4, 20, 4, 12);
  ctx.fillRect(0, 20, 4, 12);
  ctx.fillRect(8, 20, 4, 12);
  ctx.fillRect(12, 20, 4, 12);
  ctx.fillRect(4, 16, 4, 4);

  // Left arm (4x12 at 36,52)
  ctx.fillStyle = c.main;
  ctx.fillRect(36, 52, 4, 12);
  ctx.fillRect(32, 52, 4, 12);
  ctx.fillRect(40, 52, 4, 12);
  ctx.fillRect(44, 52, 4, 12);
  ctx.fillRect(36, 48, 4, 4);

  // Left leg (4x12 at 20,52)
  ctx.fillStyle = c.secondary;
  ctx.fillRect(20, 52, 4, 12);
  ctx.fillRect(16, 52, 4, 12);
  ctx.fillRect(24, 52, 4, 12);
  ctx.fillRect(28, 52, 4, 12);
  ctx.fillRect(20, 48, 4, 4);

  return canvas.toDataURL("image/png");
}

const SkinPreview3D = ({ textureUrl, skinType, skinStyle }: SkinPreview3DProps) => {
  const resolvedTexture = useMemo(() => {
    if (textureUrl) return textureUrl;
    if (skinStyle) return generatePlaceholderSkin(skinStyle);
    return null;
  }, [textureUrl, skinStyle]);

  if (!resolvedTexture) {
    return (
      <div className="flex h-full items-center justify-center text-center">
        <div>
          <span className="text-4xl">🧑</span>
          <p className="mt-2 text-sm font-bold text-muted-foreground">
            Pick a style to see your character!
          </p>
        </div>
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0.3, 2], fov: 45 }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 3]} intensity={1} />
      <directionalLight position={[-3, 2, -3]} intensity={0.4} />
      <MinecraftCharacter
        textureUrl={resolvedTexture}
        isSlim={skinType === "alex"}
      />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={1}
        maxDistance={4}
        target={[0, 0.15, 0]}
      />
    </Canvas>
  );
};

export default SkinPreview3D;
