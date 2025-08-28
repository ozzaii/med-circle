import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface NeuralNetworkProps {
  learningProgress: number; // 0-100
  activeConnections?: number;
  className?: string;
}

const NeuralNetworkVisualization: React.FC<NeuralNetworkProps> = ({ 
  learningProgress = 0, 
  activeConnections = 0,
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  // Particle class for neural connections
  class Particle {
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    speed: number;
    size: number;
    opacity: number;
    color: string;

    constructor(startX: number, startY: number, endX: number, endY: number) {
      this.x = startX;
      this.y = startY;
      this.targetX = endX;
      this.targetY = endY;
      this.speed = 0.02 + Math.random() * 0.03;
      this.size = 1 + Math.random() * 2;
      this.opacity = 0.3 + Math.random() * 0.7;
      this.color = `rgba(${96 + Math.random() * 60}, ${165 + Math.random() * 40}, 250, ${this.opacity})`;
    }

    update() {
      this.x += (this.targetX - this.x) * this.speed;
      this.y += (this.targetY - this.y) * this.speed;
      
      // Reset if reached target
      const dist = Math.sqrt((this.targetX - this.x) ** 2 + (this.targetY - this.y) ** 2);
      if (dist < 1) {
        return true; // Signal to remove this particle
      }
      return false;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      
      // Draw glow effect
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(this.x - this.size * 3, this.y - this.size * 3, this.size * 6, this.size * 6);
    }
  }

  // Neural network structure
  const layers = [
    { neurons: 4, label: 'Girdi' },
    { neurons: 6, label: 'Gizli 1' },
    { neurons: 8, label: 'Gizli 2' },
    { neurons: 6, label: 'Gizli 3' },
    { neurons: 3, label: 'Çıktı' }
  ];

  const drawNeuralNetwork = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    const layerSpacing = width / (layers.length + 1);
    const neurons: { x: number; y: number; layer: number; index: number }[] = [];
    
    // Draw neurons
    layers.forEach((layer, layerIndex) => {
      const x = layerSpacing * (layerIndex + 1);
      const neuronSpacing = height / (layer.neurons + 1);
      
      for (let i = 0; i < layer.neurons; i++) {
        const y = neuronSpacing * (i + 1);
        neurons.push({ x, y, layer: layerIndex, index: i });
        
        // Draw neuron
        const isActive = Math.random() < learningProgress / 100;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        
        if (isActive) {
          // Active neuron
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, 12);
          gradient.addColorStop(0, 'rgba(96, 165, 250, 1)');
          gradient.addColorStop(0.5, 'rgba(96, 165, 250, 0.6)');
          gradient.addColorStop(1, 'rgba(96, 165, 250, 0)');
          ctx.fillStyle = gradient;
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#60a5fa';
          ctx.fill();
        } else {
          // Inactive neuron
          ctx.fillStyle = 'rgba(71, 85, 105, 0.5)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      
      // Draw layer label
      ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
      ctx.font = '10px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(layer.label, x, height - 10);
    });
    
    // Draw connections
    for (let i = 0; i < neurons.length - 1; i++) {
      const neuron = neurons[i];
      const nextLayerNeurons = neurons.filter(n => n.layer === neuron.layer + 1);
      
      nextLayerNeurons.forEach(nextNeuron => {
        const isActive = Math.random() < (learningProgress / 100) * 0.3;
        
        ctx.beginPath();
        ctx.moveTo(neuron.x, neuron.y);
        ctx.lineTo(nextNeuron.x, nextNeuron.y);
        
        if (isActive) {
          ctx.strokeStyle = `rgba(96, 165, 250, ${0.3 + Math.random() * 0.3})`;
          ctx.lineWidth = 1 + Math.random();
          
          // Create particle for active connection occasionally
          if (Math.random() < 0.1 && particlesRef.current.length < 20) {
            particlesRef.current.push(
              new Particle(neuron.x, neuron.y, nextNeuron.x, nextNeuron.y)
            );
          }
        } else {
          ctx.strokeStyle = 'rgba(71, 85, 105, 0.1)';
          ctx.lineWidth = 0.5;
        }
        ctx.stroke();
      });
    }
    
    // Draw and update particles
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.draw(ctx);
      return !particle.update();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation loop
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      drawNeuralNetwork(ctx, rect.width, rect.height);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [learningProgress, activeConnections]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ minHeight: '200px' }}
      />
      
      {/* Stats overlay */}
      <div className="absolute top-4 left-4 space-y-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass px-3 py-2 rounded-lg"
        >
          <div className="text-xs text-gray-400">Öğrenme İlerlemesi</div>
          <div className="text-lg font-bold text-white">{learningProgress}%</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass px-3 py-2 rounded-lg"
        >
          <div className="text-xs text-gray-400">Aktif Bağlantılar</div>
          <div className="text-lg font-bold text-medical-cyan">{activeConnections || particlesRef.current.length}</div>
        </motion.div>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="h-2 bg-medical-darker rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-medical-blue to-medical-cyan"
            initial={{ width: 0 }}
            animate={{ width: `${learningProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
};

export default NeuralNetworkVisualization;