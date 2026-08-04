'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiAward, FiGift } from 'react-icons/fi';
import { useAuraCoins } from '@/context/AuraCoinContext';
import styles from './SpinWheel.module.css';

interface SpinWheelProps {
  onClose: () => void;
}

export default function SpinWheel({ onClose }: SpinWheelProps) {
  const { earnCoins } = useAuraCoins();
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);
  const [hasSpunToday, setHasSpunToday] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentAngleRef = useRef(0);

  const prizes = [
    { text: '50 Coins', value: 50, color: '#8B5CF6' },
    { text: 'Better Luck', value: 0, color: '#1E293B' },
    { text: '100 Coins', value: 100, color: '#EC4899' },
    { text: 'Free Delivery', value: 0, type: 'voucher', color: '#059669' },
    { text: '250 Coins', value: 250, color: '#F59E0B' },
    { text: 'Try Again', value: 0, color: '#475569' },
    { text: '500 Coins!', value: 500, color: '#EF4444' },
    { text: 'AURA50 Code', value: 0, type: 'coupon', color: '#3B82F6' }
  ];

  useEffect(() => {
    // Check cooldown
    const lastSpin = localStorage.getItem('auramart_last_spin');
    const todayStr = new Date().toDateString();
    if (lastSpin === todayStr) {
      setHasSpunToday(true);
    }

    drawWheel();
  }, []);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const radius = width / 2;
    const arc = Math.PI / (prizes.length / 2);

    ctx.clearRect(0, 0, width, height);

    prizes.forEach((p, i) => {
      const angle = i * arc;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(radius, radius, radius - 10, angle, angle + arc, false);
      ctx.lineTo(radius, radius);
      ctx.fill();

      // Text label drawing
      ctx.save();
      ctx.fillStyle = 'white';
      ctx.font = 'bold 11px sans-serif';
      ctx.translate(radius, radius);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillText(p.text, radius - 25, 5);
      ctx.restore();
    });

    // Draw center pin
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(radius, radius, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(radius, radius, 16, 0, Math.PI * 2);
    ctx.stroke();
  };

  const spin = () => {
    if (spinning || hasSpunToday) return;

    setSpinning(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const extraSpins = 4 + Math.floor(Math.random() * 4); // 4-8 full spins
    const targetPrizeIndex = Math.floor(Math.random() * prizes.length);
    const sliceAngle = (Math.PI * 2) / prizes.length;
    
    // Calculate final angle to land on targeted slice
    const targetAngle = (Math.PI * 2) - (targetPrizeIndex * sliceAngle + sliceAngle / 2);
    const totalRotation = extraSpins * Math.PI * 2 + targetAngle;

    let start = Date.now();
    const duration = 4000; // 4 seconds animation

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = easeOut * totalRotation;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(currentRotation);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        drawWheel();
        ctx.restore();
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        const winningPrize = prizes[targetPrizeIndex];
        setPrize(winningPrize.text);
        
        // Update user coins balance
        if (winningPrize.value > 0) {
          earnCoins(winningPrize.value, `Won via daily Spin Wheel: ${winningPrize.text}`);
        }

        // Set cooldown to prevent double spins
        const todayStr = new Date().toDateString();
        localStorage.setItem('auramart_last_spin', todayStr);
        setHasSpunToday(true);
        setSpinning(false);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close spinner">
          <FiX />
        </button>

        <span className={styles.badge}>DAILY REWARDS</span>
        <h3 className={styles.title}>AuraCoin Spin Wheel</h3>
        <p className={styles.subtitle}>Spin once every 24 hours to win free coins, delivery vouchers, and exclusive coupon discounts!</p>

        <div className={styles.wheelWrapper}>
          <div className={styles.pointer}></div>
          <canvas 
            ref={canvasRef} 
            width={280} 
            height={280} 
            className={`${styles.canvas} ${spinning ? styles.canvasSpinning : ''}`}
          />
        </div>

        {prize ? (
          <div className={styles.prizeReveal}>
            <FiAward className={styles.prizeIcon} />
            <h4>Congratulations! 🎉</h4>
            <p>You won: <strong>{prize}</strong></p>
            <button className={styles.actionBtn} onClick={onClose}>Sweet, thanks!</button>
          </div>
        ) : (
          <button 
            onClick={spin}
            disabled={spinning || hasSpunToday}
            className={styles.spinBtn}
          >
            {spinning ? 'Spinning...' : hasSpunToday ? 'Already Spun Today!' : 'Spin & Win! 🎡'}
          </button>
        )}
      </div>
    </div>
  );
}
