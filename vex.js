import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export class ParticlesSwarm {
    constructor(container, count = 20000) {
        this.count = count;
        this.container = container;
        this.speedMult = 1;
        
        // SETUP
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000000, 0.01);
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.camera.position.set(0, 0, 100);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        // POST PROCESSING
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.strength = 1.8; bloomPass.radius = 0.4; bloomPass.threshold = 0;
        this.composer.addPass(bloomPass);

        // OBJECTS
        this.dummy = new THREE.Object3D();
        this.color = new THREE.Color();
        this.target = new THREE.Vector3();
        this.pColor = new THREE.Color();
        
        this.geometry = new THREE.TetrahedronGeometry(0.25);
        this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        
        this.mesh = new THREE.InstancedMesh(this.geometry, this.material, this.count);
        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.scene.add(this.mesh);
        
        this.positions = [];
        for(let i=0; i<this.count; i++) {
            this.positions.push(new THREE.Vector3((Math.random()-0.5)*100, (Math.random()-0.5)*100, (Math.random()-0.5)*100));
            this.mesh.setColorAt(i, this.color.setHex(0x00ff88));
        }
        
        this.clock = new THREE.Clock();
        this.animate = this.animate.bind(this);
        this.animate();
    }

    animate() {
        requestAnimationFrame(this.animate);
        const time = this.clock.getElapsedTime() * this.speedMult;
        
        if(this.material.uniforms && this.material.uniforms.uTime) {
            this.material.uniforms.uTime.value = time;
        }

        // API Stubs
        const PARAMS = {"flow":1,"glitch":0.18,"scale":180};
        const addControl = (id, l, min, max, val) => {
             return PARAMS[id] !== undefined ? PARAMS[id] : val;
        };
        const setInfo = () => {};
        const annotate = () => {};
        let THREE_LIB = THREE;
        const count = this.count; // Alias for user code
        
        for(let i=0; i<this.count; i++) {
            let target = this.target;
            let color = this.pColor;
            
            // INJECTED CODE
            const flow = addControl("flow", "Data Stream", 0.0, 5.0, 1.5);
            const glitch = addControl("glitch", "Simulation Glitch", 0.0, 1.0, 0.3);
            const scale = addControl("scale", "Construct Scale", 50.0, 300.0, 180.0);
            const gridSize = Math.max(2.0, Math.ceil(Math.pow(count, 0.333333)));
            const halfGrid = gridSize * 0.5;
            const gx = (i % gridSize) - halfGrid;
            const gy = (Math.floor(i / gridSize) % gridSize) - halfGrid;
            const gz = Math.floor(i / (gridSize * gridSize)) - halfGrid;
            const nx = gx / halfGrid;
            const ny = gy / halfGrid;
            const nz = gz / halfGrid;
            const dist = Math.max(0.0001, Math.sqrt(nx * nx + ny * ny + nz * nz));
            const pulse = Math.sin(dist * 12.0 - time * flow * 4.0);
            const gNoise = Math.sin(i * 98.72 + time * flow * 15.0);
            const isGlitch = Math.max(0.0, Math.min(1.0, (gNoise - (1.0 - glitch)) * 50.0));
            const t = time * 0.1 * flow;
            const c1 = Math.cos(t);
            const s1 = Math.sin(t);
            const c2 = Math.cos(t * 1.618);
            const s2 = Math.sin(t * 1.618);
            let rx = nx * c1 - nz * s1;
            let rz = nx * s1 + nz * c1;
            let ry = ny * c2 - rz * s2;
            let rz2 = ny * s2 + rz * c2;
            const gOffset = 0.5 * isGlitch;
            const fx = rx + Math.cos(time * 41.0 + i) * gOffset;
            const fy = ry + Math.sin(time * 37.0 + i) * gOffset;
            const fz = rz2 + Math.cos(time * 29.0 + i) * gOffset;
            const expand = 1.0 + (Math.max(0.0, pulse) * 0.2);
            target.set(fx * scale * expand, fy * scale * expand, fz * scale * expand);
            const baseHue = 0.52 + (pulse * 0.03);
            const hue = baseHue * (1.0 - isGlitch) + 0.03 * isGlitch;
            const pSq = Math.max(0.0, pulse * pulse * pulse);
            const sat = 0.8 * (1.0 - pSq) * (1.0 - isGlitch) + 1.0 * isGlitch;
            const lit = 0.15 + (pSq * 0.6) + (isGlitch * 0.6);
            color.setHSL(Math.abs(hue % 1.0), sat, Math.max(0.0, Math.min(1.0, lit)));
            if (i === 0) {
            setInfo("Vex Network Architecture", "Spade here. You plugged us into a Vex conflux, didn't you? If I start reciting Pi in binary, just smack the nearest glowing cube. Kidding. Mostly.");
            }
            
            
            // UPDATE
            this.positions[i].lerp(this.target, 0.1);
            this.dummy.position.copy(this.positions[i]);
            this.dummy.updateMatrix();
            this.mesh.setMatrixAt(i, this.dummy.matrix);
            this.mesh.setColorAt(i, this.pColor);
        }
        this.mesh.instanceMatrix.needsUpdate = true;
        this.mesh.instanceColor.needsUpdate = true;
        
        this.composer.render();
    }
    
    dispose() {
        this.geometry.dispose();
        this.material.dispose();
        this.scene.remove(this.mesh);
        this.renderer.dispose();
    }
}