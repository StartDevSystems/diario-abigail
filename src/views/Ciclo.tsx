"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useJournal } from '@/context/JournalContext';
import { CyclePeriod, DayData, Mood } from '@/types/index';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import gsap from 'gsap';
import {
  Heart, Plus, X, Check, Calendar, Droplets,
  Moon, Sun, Sparkles, TrendingUp, ChevronLeft, ChevronRight,
  Trash2, AlertCircle, Clock, Edit2, BookOpen, BarChart3,
  Zap, Activity, Download, Flower2, UtensilsCrossed, Dumbbell, Users
} from 'lucide-react';

// ── Constantes ──────────────────────────────────────────────

const MIN_CYCLE_LENGTH = 21;
const MAX_CYCLE_LENGTH = 45;

const PHASE_COLORS = {
  periodo:   { main: '#e11d74', light: '#fce7f3', label: 'Período' },
  folicular: { main: '#9ca3af', light: '#f3f4f6', label: 'Folicular' },
  fertil:    { main: '#c084fc', light: '#f3e8ff', label: 'Días Fértiles' },
  ovulacion: { main: '#7c3aed', light: '#ede9fe', label: 'Ovulación' },
  lutea:     { main: '#93c5fd', light: '#eff6ff', label: 'Fase Lútea' },
} as const;

type PhaseKey = keyof typeof PHASE_COLORS;

const SYMPTOM_OPTIONS = [
  { id: 'cramps', emoji: '😣', label: 'Cólicos' },
  { id: 'headache', emoji: '🤕', label: 'Dolor de cabeza' },
  { id: 'bloating', emoji: '🫧', label: 'Hinchazón' },
  { id: 'fatigue', emoji: '😴', label: 'Fatiga' },
  { id: 'mood_swings', emoji: '🎭', label: 'Cambios de humor' },
  { id: 'acne', emoji: '😖', label: 'Acné' },
  { id: 'breast_pain', emoji: '💗', label: 'Sensibilidad' },
  { id: 'backache', emoji: '🦴', label: 'Dolor lumbar' },
  { id: 'nausea', emoji: '🤢', label: 'Náuseas' },
  { id: 'cravings', emoji: '🍫', label: 'Antojos' },
  { id: 'insomnia', emoji: '🌙', label: 'Insomnio' },
  { id: 'energy', emoji: '⚡', label: 'Mucha energía' },
];

// ── Utilidades de Ciclo ─────────────────────────────────────

function dateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

function addDays(dateString: string, days: number): string {
  const d = new Date(dateString + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return dateStr(d);
}

function clampCycleLength(len: number): number {
  return Math.max(MIN_CYCLE_LENGTH, Math.min(MAX_CYCLE_LENGTH, len));
}

function getAverageCycleLength(periods: CyclePeriod[]): number {
  if (periods.length < 2) return 28;
  const lengths: number[] = [];
  for (let i = 1; i < periods.length; i++) {
    const len = daysBetween(periods[i - 1].start, periods[i].start);
    if (len >= MIN_CYCLE_LENGTH && len <= MAX_CYCLE_LENGTH) {
      lengths.push(len);
    }
  }
  if (lengths.length === 0) return 28;
  return clampCycleLength(Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length));
}

function getAveragePeriodLength(periods: CyclePeriod[]): number {
  if (periods.length === 0) return 5;
  const lengths = periods.map(p => {
    const len = daysBetween(p.start, p.end) + 1;
    return Math.max(1, Math.min(10, len));
  });
  return Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
}

interface CyclePhaseInfo {
  phase: PhaseKey;
  dayInCycle: number;
  totalDays: number;
  nextPeriod: string;
  ovulationDay: string;
  fertileStart: string;
  fertileEnd: string;
  daysLate: number;
}

function getCycleInfo(periods: CyclePeriod[], cycleLen: number, periodLen: number): CyclePhaseInfo | null {
  if (periods.length === 0) return null;

  const safeLen = clampCycleLength(cycleLen);
  const safePeriodLen = Math.max(1, Math.min(10, periodLen));
  const lastPeriod = periods[periods.length - 1];
  const today = dateStr(new Date());
  const dayInCycle = daysBetween(lastPeriod.start, today) + 1;

  if (dayInCycle < 1) return null;

  const ovulationDayNum = Math.max(safePeriodLen + 1, safeLen - 14);
  const fertileStartNum = Math.max(safePeriodLen + 1, ovulationDayNum - 5);
  const fertileEndNum = ovulationDayNum + 1;

  const nextPeriod = addDays(lastPeriod.start, safeLen);
  const ovulationDay = addDays(lastPeriod.start, ovulationDayNum - 1);
  const fertileStart = addDays(lastPeriod.start, fertileStartNum - 1);
  const fertileEnd = addDays(lastPeriod.start, fertileEndNum - 1);

  // Calcular días de retraso
  const daysLate = Math.max(0, dayInCycle - safeLen);

  let phase: PhaseKey;
  if (dayInCycle > safeLen) {
    // Período retrasado — seguimos en lútea
    phase = 'lutea';
  } else if (dayInCycle <= safePeriodLen) {
    phase = 'periodo';
  } else if (dayInCycle < fertileStartNum) {
    phase = 'folicular';
  } else if (dayInCycle === ovulationDayNum) {
    phase = 'ovulacion';
  } else if (dayInCycle >= fertileStartNum && dayInCycle <= fertileEndNum) {
    phase = 'fertil';
  } else {
    phase = 'lutea';
  }

  return {
    phase, dayInCycle, totalDays: safeLen, nextPeriod, ovulationDay,
    fertileStart, fertileEnd, daysLate
  };
}

// ── Banner de Predicción / Retraso ───────────────────────────

interface PeriodAlertBannerProps {
  cycleInfo: CyclePhaseInfo;
  onQuickLog: () => void;
}

function PeriodAlertBanner({ cycleInfo, onQuickLog }: PeriodAlertBannerProps) {
  const daysToNext = daysBetween(dateStr(new Date()), cycleInfo.nextPeriod);

  // Período retrasado
  if (cycleInfo.daysLate > 0) {
    let message = '';
    let submessage = '';
    let bgColor = '';
    let icon = <Clock size={20} />;

    if (cycleInfo.daysLate <= 3) {
      message = `Tu período lleva ${cycleInfo.daysLate} día${cycleInfo.daysLate > 1 ? 's' : ''} de retraso`;
      submessage = 'Es normal que varíe unos días. No te preocupes.';
      bgColor = '#fef3c7'; // amarillo suave
      icon = <Clock size={20} className="text-amber-600" />;
    } else if (cycleInfo.daysLate <= 7) {
      message = `Llevas ${cycleInfo.daysLate} días de retraso`;
      submessage = 'Puede ser por estrés, cambio de rutina o alimentación. Si es inusual, considera consultar a tu médico.';
      bgColor = '#fed7aa'; // naranja suave
      icon = <AlertCircle size={20} className="text-orange-600" />;
    } else {
      message = `Llevas ${cycleInfo.daysLate} días de retraso`;
      submessage = 'Te recomendamos consultar con tu ginecólogo si esto no es habitual para ti.';
      bgColor = '#fecaca'; // rojo suave
      icon = <AlertCircle size={20} className="text-red-500" />;
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-4 flex items-start gap-3"
        style={{ backgroundColor: bgColor }}
      >
        <div className="mt-0.5 shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-sm">{message}</p>
          <p className="text-gray-600 text-[12px] mt-1 leading-relaxed" style={{ fontSize: 'inherit' }}>{submessage}</p>
          <button
            onClick={onQuickLog}
            className="mt-3 text-[11px] font-bold uppercase tracking-wider py-2 px-4 rounded-xl bg-white/80 hover:bg-white transition-colors text-gray-700"
          >
            Ya me llegó — Registrar ahora
          </button>
        </div>
      </motion.div>
    );
  }

  // Período llega hoy o mañana
  if (daysToNext <= 1 && daysToNext >= 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-4 flex items-start gap-3 bg-[#fce7f3]"
      >
        <Droplets size={20} className="text-[#e11d74] mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-sm">
            {daysToNext === 0 ? 'Tu período podría llegar hoy' : 'Tu período podría llegar mañana'}
          </p>
          <p className="text-gray-600 text-[12px] mt-1" style={{ fontSize: 'inherit' }}>
            {daysToNext === 0 ? 'Prepárate y ten todo a la mano.' : 'Ten tus cosas listas por si acaso.'}
          </p>
          <button
            onClick={onQuickLog}
            className="mt-3 text-[11px] font-bold uppercase tracking-wider py-2 px-4 rounded-xl bg-white/80 hover:bg-white transition-colors text-[#e11d74]"
          >
            Ya llegó — Registrar
          </button>
        </div>
      </motion.div>
    );
  }

  // Próximos 3 días
  if (daysToNext <= 3 && daysToNext > 1) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-4 flex items-center gap-3 bg-[#fce7f3]/50"
      >
        <Droplets size={18} className="text-[#e11d74]/60 shrink-0" />
        <p className="text-sm text-gray-600" style={{ fontSize: 'inherit' }}>
          Tu período podría llegar en <strong className="text-[#e11d74]">{daysToNext} días</strong>. Prepárate.
        </p>
      </motion.div>
    );
  }

  return null;
}

// ── Componente 3D Dial (Three.js + GSAP) ─────────────────────

interface CycleDialProps {
  cycleInfo: CyclePhaseInfo;
  periodLength: number;
}

function CycleDial({ cycleInfo, periodLength }: CycleDialProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    ring: THREE.Group;
    marker: THREE.Mesh;
    particles: THREE.Points;
    glowRing: THREE.Mesh;
    animId: number;
  } | null>(null);
  const prevPhaseRef = useRef<string>('');

  const { dayInCycle, totalDays, phase, daysLate } = cycleInfo;
  const isLate = daysLate > 0;
  const phaseInfo = PHASE_COLORS[phase];
  const markerColor = isLate ? '#ef4444' : phaseInfo.main;

  const safePeriodLen = Math.max(1, Math.min(10, periodLength));
  const ovulationDayNum = Math.max(safePeriodLen + 1, totalDays - 14);
  const fertileStartNum = Math.max(safePeriodLen + 1, ovulationDayNum - 5);
  const fertileEndNum = ovulationDayNum + 1;

  // Build phase segments data
  const phaseSegments = useMemo(() => {
    const all = [
      { key: 'periodo' as PhaseKey, start: 1, end: safePeriodLen },
      { key: 'folicular' as PhaseKey, start: safePeriodLen + 1, end: fertileStartNum - 1 },
      { key: 'fertil' as PhaseKey, start: fertileStartNum, end: ovulationDayNum - 1 },
      { key: 'ovulacion' as PhaseKey, start: ovulationDayNum, end: ovulationDayNum },
      { key: 'fertil' as PhaseKey, start: ovulationDayNum + 1, end: fertileEndNum },
      { key: 'lutea' as PhaseKey, start: fertileEndNum + 1, end: totalDays },
    ];
    return all.filter(p => p.start <= p.end && p.start >= 1);
  }, [safePeriodLen, fertileStartNum, ovulationDayNum, fertileEndNum, totalDays]);

  // Convert hex to THREE.Color
  const toColor = useCallback((hex: string) => new THREE.Color(hex), []);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 340;
    const height = width; // Square

    // ── Scene Setup ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── Ambient Light ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.2, 20);
    pointLight.position.set(2, 3, 5);
    scene.add(pointLight);

    // ── Ring Group ──
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    // Phase-colored torus segments
    const ringRadius = 1.8;
    const tubeRadius = 0.18;

    phaseSegments.forEach((seg) => {
      const startAngle = ((seg.start - 1) / totalDays) * Math.PI * 2 - Math.PI / 2;
      const endAngle = (seg.end / totalDays) * Math.PI * 2 - Math.PI / 2;
      let arc = endAngle - startAngle;
      if (arc <= 0) arc += Math.PI * 2;

      const segments = Math.max(16, Math.round(arc * 30));
      const geometry = new THREE.TorusGeometry(ringRadius, tubeRadius, 16, segments, arc);

      const isActive = seg.key === phase;
      const color = toColor(PHASE_COLORS[seg.key].main);
      const material = new THREE.MeshPhysicalMaterial({
        color,
        emissive: color,
        emissiveIntensity: isActive ? 0.4 : 0.08,
        metalness: 0.3,
        roughness: 0.25,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: isActive ? 1.0 : 0.55,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.z = startAngle + Math.PI / 2;
      mesh.userData = { phaseKey: seg.key, isActive };
      ringGroup.add(mesh);
    });

    // ── Glow Ring (active phase highlight) ──
    const glowGeometry = new THREE.TorusGeometry(ringRadius, tubeRadius + 0.08, 8, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: toColor(markerColor),
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    });
    const glowRing = new THREE.Mesh(glowGeometry, glowMaterial);
    ringGroup.add(glowRing);

    // Pulse the glow ring
    gsap.to(glowMaterial, {
      opacity: 0.25,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // ── Day Marker (sphere on the ring) ──
    const markerAngle = ((dayInCycle - 1) / totalDays) * Math.PI * 2 - Math.PI / 2;
    const markerX = ringRadius * Math.cos(markerAngle);
    const markerY = ringRadius * Math.sin(markerAngle);

    const markerGeometry = new THREE.SphereGeometry(0.22, 32, 32);
    const markerMaterial = new THREE.MeshPhysicalMaterial({
      color: toColor(markerColor),
      emissive: toColor(markerColor),
      emissiveIntensity: 0.6,
      metalness: 0.5,
      roughness: 0.1,
      clearcoat: 1.0,
    });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.set(markerX, markerY, 0.3);
    ringGroup.add(marker);

    // Marker pulse
    gsap.to(marker.scale, {
      x: 1.3, y: 1.3, z: 1.3,
      duration: 1.0,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // ── Marker Glow (point light at marker) ──
    const markerLight = new THREE.PointLight(toColor(markerColor), 1.5, 3);
    markerLight.position.set(markerX, markerY, 0.5);
    ringGroup.add(markerLight);

    gsap.to(markerLight, {
      intensity: 0.5,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // ── Trail Dots ──
    for (let i = 1; i <= Math.min(dayInCycle - 1, 8); i++) {
      const trailDay = dayInCycle - i;
      if (trailDay < 1) break;
      const tAngle = ((trailDay - 1) / totalDays) * Math.PI * 2 - Math.PI / 2;
      const tGeo = new THREE.SphereGeometry(0.06 - i * 0.005, 12, 12);
      const tMat = new THREE.MeshBasicMaterial({
        color: toColor(markerColor),
        transparent: true,
        opacity: 0.5 - i * 0.05,
      });
      const tMesh = new THREE.Mesh(tGeo, tMat);
      tMesh.position.set(
        ringRadius * Math.cos(tAngle),
        ringRadius * Math.sin(tAngle),
        0.15
      );
      ringGroup.add(tMesh);
    }

    // ── Floating Particles ──
    const particleCount = 80;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const phaseColor = toColor(phaseInfo.main);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = ringRadius + (Math.random() - 0.5) * 1.2;
      positions[i * 3] = radius * Math.cos(angle);
      positions[i * 3 + 1] = radius * Math.sin(angle);
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
      colors[i * 3] = phaseColor.r;
      colors[i * 3 + 1] = phaseColor.g;
      colors[i * 3 + 2] = phaseColor.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    ringGroup.add(particles);

    // ── Outer Decorative Ring (thin wireframe) ──
    const outerRingGeo = new THREE.TorusGeometry(ringRadius + 0.35, 0.01, 8, 128);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0xd1d5db,
      transparent: true,
      opacity: 0.3,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    ringGroup.add(outerRing);

    // ── Day Labels (sprites around the ring) ──
    const labelInterval = totalDays <= 30 ? 7 : 10;
    for (let d = 1; d <= totalDays; d += labelInterval) {
      const lAngle = ((d - 1) / totalDays) * Math.PI * 2 - Math.PI / 2;
      const lRadius = ringRadius + 0.55;
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#9ca3af';
        ctx.font = 'bold 28px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(d), 32, 32);
      }
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.6 });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.set(lRadius * Math.cos(lAngle), lRadius * Math.sin(lAngle), 0);
      sprite.scale.set(0.35, 0.35, 1);
      ringGroup.add(sprite);
    }

    // ── Initial Entrance Animation ──
    ringGroup.scale.set(0.01, 0.01, 0.01);
    ringGroup.rotation.x = 0.35;
    gsap.to(ringGroup.scale, {
      x: 1, y: 1, z: 1,
      duration: 1.2,
      ease: 'elastic.out(1, 0.6)',
    });

    // ── Gentle idle rotation ──
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.3;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.3;
    };
    container.addEventListener('mousemove', handleMouseMove);

    // ── Render Loop ──
    let time = 0;
    const animate = () => {
      const animId = requestAnimationFrame(animate);
      if (sceneRef.current) sceneRef.current.animId = animId;
      time += 0.008;

      // Gentle idle float
      ringGroup.rotation.x = 0.35 + Math.sin(time * 0.5) * 0.03 + mouseY * 0.3;
      ringGroup.rotation.y = Math.sin(time * 0.3) * 0.04 + mouseX * 0.3;

      // Particles orbit
      particles.rotation.z += 0.001;

      renderer.render(scene, camera);
    };

    const animId = requestAnimationFrame(animate);

    sceneRef.current = {
      scene, camera, renderer, ring: ringGroup, marker, particles, glowRing, animId
    };

    // ── Resize ──
    const handleResize = () => {
      const w = container.clientWidth || 340;
      renderer.setSize(w, w);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
      gsap.killTweensOf(glowMaterial);
      gsap.killTweensOf(marker.scale);
      gsap.killTweensOf(markerLight);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [phaseSegments, dayInCycle, totalDays, phase, markerColor, phaseInfo.main, toColor, daysLate]);

  // ── GSAP Phase Change Transition ──
  useEffect(() => {
    if (!sceneRef.current || prevPhaseRef.current === phase) return;
    prevPhaseRef.current = phase;

    const { ring } = sceneRef.current;
    // Bounce on phase change
    gsap.fromTo(ring.scale, { x: 0.92, y: 0.92, z: 0.92 }, {
      x: 1, y: 1, z: 1,
      duration: 0.6,
      ease: 'elastic.out(1.2, 0.5)',
    });
  }, [phase]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-[340px] sm:max-w-[380px] aspect-square relative">
        {/* Three.js Canvas */}
        <div ref={containerRef} className="w-full h-full" style={{ borderRadius: '50%' }} />

        {/* Center overlay (HTML for crisp text) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center" style={{
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(16px)',
            borderRadius: '50%',
            width: '48%',
            height: '48%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.8)',
            border: '1px solid rgba(255,255,255,0.6)',
          }}>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#9ca3af' }}>
              {isLate ? 'RETRASO' : 'DIA'}
            </span>
            <span className="font-black leading-none" style={{
              fontSize: 'clamp(2rem, 6vw, 3.2rem)',
              color: '#1d1d1f',
              fontFamily: 'system-ui, sans-serif',
            }}>
              {isLate ? `+${daysLate}` : dayInCycle}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] mt-0.5" style={{ color: markerColor }}>
              {isLate ? 'DIAS DE RETRASO' : phaseInfo.label.toUpperCase()}
            </span>
            <Heart
              size={14}
              className="mt-1 animate-pulse"
              style={{ color: markerColor, fill: markerColor, opacity: 0.6 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Calendario Mini ──────────────────────────────────────────

interface MiniCalendarProps {
  periods: CyclePeriod[];
  symptoms: Record<string, string[]>;
  cycleLength: number;
  periodLength: number;
  onDayClick: (date: string) => void;
  selectedDate: string | null;
}

function MiniCalendar({ periods, symptoms, cycleLength, periodLength, onDayClick, selectedDate }: MiniCalendarProps) {
  const [monthOffset, setMonthOffset] = useState(0);

  const baseDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthOffset);
    return d;
  }, [monthOffset]);

  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const today = dateStr(new Date());

  const periodDays = new Set<string>();
  const predictedDays = new Set<string>();
  const fertileWindowDays = new Set<string>();

  periods.forEach(p => {
    const d = new Date(p.start + 'T00:00:00');
    const end = new Date(p.end + 'T00:00:00');
    while (d <= end) {
      periodDays.add(dateStr(d));
      d.setDate(d.getDate() + 1);
    }
  });

  if (periods.length > 0) {
    const last = periods[periods.length - 1];
    const safeLen = clampCycleLength(cycleLength);
    // Predict next 3 cycles
    for (let cycle = 1; cycle <= 3; cycle++) {
      const nextStart = addDays(last.start, safeLen * cycle);
      for (let i = 0; i < periodLength; i++) {
        predictedDays.add(addDays(nextStart, i));
      }
    }
    const ovDay = Math.max(periodLength + 1, safeLen - 14);
    for (let i = ovDay - 5; i <= ovDay + 1; i++) {
      fertileWindowDays.add(addDays(last.start, i - 1));
    }
  }

  const monthName = baseDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setMonthOffset(o => o - 1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronLeft size={18} className="text-gray-400" />
        </button>
        <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider capitalize">{monthName}</h4>
        <button onClick={() => setMonthOffset(o => o + 1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronRight size={18} className="text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase pb-2">{d}</div>
        ))}

        {Array.from({ length: startPad }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const ds = dateStr(new Date(year, month, day));
          const isPeriod = periodDays.has(ds);
          const isPredicted = predictedDays.has(ds);
          const isFertile = fertileWindowDays.has(ds);
          const isToday = ds === today;
          const hasSymptoms = symptoms[ds] && symptoms[ds].length > 0;
          const isSelected = ds === selectedDate;

          let bg = '';
          let textColor = 'text-gray-700';
          if (isPeriod) { bg = 'bg-[#fce7f3]'; textColor = 'text-[#e11d74] font-bold'; }
          else if (isPredicted) { bg = 'bg-[#fce7f3]/50 border border-dashed border-[#e11d74]/30'; }
          else if (isFertile) { bg = 'bg-[#f3e8ff]'; textColor = 'text-[#7c3aed]'; }

          return (
            <button
              key={day}
              onClick={() => onDayClick(ds)}
              className={`relative w-full aspect-square max-w-[40px] mx-auto rounded-xl flex items-center justify-center text-[12px] transition-colors
                ${bg} ${textColor}
                ${isToday ? 'ring-2 ring-[var(--color-theme-primary)] font-black' : ''}
                ${isSelected ? 'shadow-md bg-[var(--color-theme-pastel)]' : 'hover:bg-gray-50'}
              `}
            >
              {day}
              {hasSymptoms && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#7c3aed]" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#fce7f3] border border-[#e11d74]/30" />
          <span className="text-[10px] text-gray-500">Período</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#f3e8ff] border border-[#7c3aed]/30" />
          <span className="text-[10px] text-gray-500">Fértil</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full border border-dashed border-[#e11d74]/40" />
          <span className="text-[10px] text-gray-500">Predicción</span>
        </div>
      </div>
    </div>
  );
}

// ── Registro de Síntomas ─────────────────────────────────────

interface SymptomLogProps {
  date: string;
  currentSymptoms: string[];
  onToggle: (symptomId: string) => void;
}

function SymptomLog({ date, currentSymptoms, onToggle }: SymptomLogProps) {
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  return (
    <div>
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 capitalize">{formattedDate}</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {SYMPTOM_OPTIONS.map(s => {
          const active = currentSymptoms.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => onToggle(s.id)}
              className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-2xl border-2 transition-all text-center
                ${active
                  ? 'border-[var(--color-theme-primary)] bg-[var(--color-theme-pastel)]/30 shadow-sm scale-[1.02]'
                  : 'border-transparent bg-gray-50 hover:bg-gray-100 opacity-70 hover:opacity-100'
                }`}
            >
              <span className="text-xl">{s.emoji}</span>
              <span className="text-[10px] font-semibold text-gray-600 leading-tight">{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Panel de Registro de Período ─────────────────────────────

interface PeriodLogPanelProps {
  onLog: (start: string, end: string) => void;
  onClose: () => void;
  initialStart?: string;
  initialEnd?: string;
}

function PeriodLogPanel({ onLog, onClose, initialStart, initialEnd }: PeriodLogPanelProps) {
  const today = dateStr(new Date());
  const isEditing = !!initialStart;
  const [startDate, setStartDate] = useState(initialStart || today);
  const [endDate, setEndDate] = useState(initialEnd || addDays(today, 4));
  const [error, setError] = useState('');

  const handleSave = () => {
    const dur = daysBetween(startDate, endDate);
    if (dur < 0) {
      setError('La fecha de fin debe ser después del inicio.');
      return;
    }
    if (dur > 14) {
      setError('Un período de más de 14 días no es habitual. Revisa las fechas.');
      return;
    }
    if (daysBetween(today, startDate) > 30) {
      setError('No puedes registrar un período con más de 30 días en el futuro.');
      return;
    }
    setError('');
    onLog(startDate, endDate);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="card-premium"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-700 flex items-center gap-2">
          {isEditing ? <Edit2 size={18} className="text-blue-500" /> : <Droplets size={18} className="text-[#e11d74]" />}
          {isEditing ? 'Editar Período' : 'Registrar Período'}
        </h3>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
          <X size={16} className="text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Inicio</label>
          <input
            type="date"
            value={startDate}
            onChange={e => { setStartDate(e.target.value); setError(''); }}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-theme-primary)]/30"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Fin</label>
          <input
            type="date"
            value={endDate}
            onChange={e => { setEndDate(e.target.value); setError(''); }}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-theme-primary)]/30"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-[12px] font-semibold flex items-center gap-2">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <button
        onClick={handleSave}
        className="w-full py-3 rounded-2xl text-white font-bold text-sm transition-all hover:shadow-lg active:scale-[0.98]"
        style={{ backgroundColor: 'var(--color-theme-primary)' }}
      >
        <Check size={16} className="inline mr-2" />
        {isEditing ? 'Actualizar Período' : 'Guardar Período'}
      </button>
    </motion.div>
  );
}

// ── Info Cards ───────────────────────────────────────────────

function PhaseInfoCard({ cycleInfo }: { cycleInfo: CyclePhaseInfo }) {
  const daysToNext = daysBetween(dateStr(new Date()), cycleInfo.nextPeriod);
  const daysToOvulation = daysBetween(dateStr(new Date()), cycleInfo.ovulationDay);

  const tips: Record<PhaseKey, string> = {
    periodo: 'Descansa, hidrátate y escucha a tu cuerpo. Es normal sentir fatiga.',
    folicular: 'Tu energía sube. Buen momento para nuevos proyectos y ejercicio.',
    fertil: 'Estás en tu ventana fértil. Energía y ánimo en su punto más alto.',
    ovulacion: 'Día de ovulación. Máxima fertilidad y energía social.',
    lutea: 'Fase de preparación. Puede haber cambios de humor. Sé amable contigo.',
  };

  const icons: Record<PhaseKey, React.ReactNode> = {
    periodo: <Droplets size={18} />,
    folicular: <Sun size={18} />,
    fertil: <Sparkles size={18} />,
    ovulacion: <Heart size={18} />,
    lutea: <Moon size={18} />,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ backgroundColor: PHASE_COLORS[cycleInfo.phase].light }}>
        <div className="mt-0.5" style={{ color: PHASE_COLORS[cycleInfo.phase].main }}>
          {icons[cycleInfo.phase]}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed" style={{ fontSize: 'inherit' }}>{tips[cycleInfo.phase]}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#fce7f3]/40 rounded-2xl p-3 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Próximo período</p>
          <p className="text-2xl font-black text-[#e11d74] mt-1">{Math.max(0, daysToNext)}</p>
          <p className="text-[10px] text-gray-500">días</p>
        </div>
        {daysToOvulation > 0 && daysToOvulation < cycleInfo.totalDays ? (
          <div className="bg-[#ede9fe]/40 rounded-2xl p-3 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ovulación</p>
            <p className="text-2xl font-black text-[#7c3aed] mt-1">{daysToOvulation}</p>
            <p className="text-[10px] text-gray-500">días</p>
          </div>
        ) : (
          <div className="bg-[#eff6ff]/60 rounded-2xl p-3 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ciclo</p>
            <p className="text-2xl font-black text-[#93c5fd] mt-1">{cycleInfo.totalDays}</p>
            <p className="text-[10px] text-gray-500">días prom.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Historial de Ciclos (con eliminar) ───────────────────────

interface CycleHistoryProps {
  periods: CyclePeriod[];
  onDelete: (start: string) => void;
  onEdit: (period: CyclePeriod) => void;
}

function CycleHistory({ periods, onDelete, onEdit }: CycleHistoryProps) {
  if (periods.length === 0) return null;

  const sorted = [...periods].sort((a, b) => b.start.localeCompare(a.start));
  const cycleLengths: (number | null)[] = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i < sorted.length - 1) {
      cycleLengths.push(daysBetween(sorted[i + 1].start, sorted[i].start));
    } else {
      cycleLengths.push(null);
    }
  }

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {sorted.slice(0, 6).map((p, i) => {
        const dur = daysBetween(p.start, p.end) + 1;
        const startF = new Date(p.start + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        const endF = new Date(p.end + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        const isConfirming = confirmDelete === p.start;

        return (
          <div key={p.start} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#fce7f3] flex items-center justify-center shrink-0">
                <Droplets size={14} className="text-[#e11d74]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-700">{startF} — {endF}</p>
                <p className="text-[10px] text-gray-400">{dur} días de período</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {cycleLengths[i] !== null && !isConfirming && (
                <div className="text-right mr-2">
                  <p className="text-sm font-bold text-gray-500">{cycleLengths[i]}d</p>
                  <p className="text-[10px] text-gray-400">ciclo</p>
                </div>
              )}
              {isConfirming ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { onDelete(p.start); setConfirmDelete(null); }}
                    className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                    title="Confirmar eliminación"
                  >
                    <Check size={14} className="text-red-600" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="p-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                    title="Cancelar"
                  >
                    <X size={14} className="text-gray-600" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(p)}
                    className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all"
                    title="Editar período"
                  >
                    <Edit2 size={16} className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(p.start)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 transition-all"
                    title="Eliminar período"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Correlación Mood + Ciclo ─────────────────────────────────

const MOOD_EMOJIS: Record<string, string> = {
  triste: '😢', neutral: '😐', bien: '🙂', feliz: '😊', genial: '🤩'
};

const MOOD_LABELS: Record<string, string> = {
  triste: 'Triste', neutral: 'Neutral', bien: 'Bien', feliz: 'Feliz', genial: 'Genial'
};

interface MoodPhaseData {
  phase: PhaseKey;
  moods: Record<string, number>;
  total: number;
  dominant: string | null;
}

function analyzeMoodsByPhase(
  history: DayData[],
  todayData: DayData,
  periods: CyclePeriod[],
  cycleLength: number,
  periodLength: number
): MoodPhaseData[] {
  if (periods.length === 0) return [];

  const phaseKeys: PhaseKey[] = ['periodo', 'folicular', 'fertil', 'ovulacion', 'lutea'];
  const data: Record<PhaseKey, Record<string, number>> = {
    periodo: {}, folicular: {}, fertil: {}, ovulacion: {}, lutea: {}
  };

  const allDays = [...history, todayData].filter(d => d.mood);
  const safeLen = clampCycleLength(cycleLength);
  const safePeriodLen = Math.max(1, Math.min(10, periodLength));
  const ovulationDayNum = Math.max(safePeriodLen + 1, safeLen - 14);
  const fertileStartNum = Math.max(safePeriodLen + 1, ovulationDayNum - 5);
  const fertileEndNum = ovulationDayNum + 1;

  for (const day of allDays) {
    if (!day.mood || !day.date) continue;
    const dayDate = day.date.split('T')[0];

    // Find which period this day belongs to
    let belongsToPeriod: CyclePeriod | null = null;
    for (const p of periods) {
      const dayInCycle = daysBetween(p.start, dayDate) + 1;
      if (dayInCycle >= 1 && dayInCycle <= safeLen) {
        belongsToPeriod = p;
        break;
      }
    }
    if (!belongsToPeriod) continue;

    const dayInCycle = daysBetween(belongsToPeriod.start, dayDate) + 1;
    let phase: PhaseKey;
    if (dayInCycle <= safePeriodLen) phase = 'periodo';
    else if (dayInCycle < fertileStartNum) phase = 'folicular';
    else if (dayInCycle === ovulationDayNum) phase = 'ovulacion';
    else if (dayInCycle >= fertileStartNum && dayInCycle <= fertileEndNum) phase = 'fertil';
    else phase = 'lutea';

    data[phase][day.mood] = (data[phase][day.mood] || 0) + 1;
  }

  return phaseKeys.map(phase => {
    const moods = data[phase];
    const total = Object.values(moods).reduce((a, b) => a + b, 0);
    let dominant: string | null = null;
    let maxCount = 0;
    for (const [mood, count] of Object.entries(moods)) {
      if (count > maxCount) { maxCount = count; dominant = mood; }
    }
    return { phase, moods, total, dominant };
  });
}

interface MoodCycleInsightsProps {
  history: DayData[];
  todayData: DayData;
  periods: CyclePeriod[];
  cycleLength: number;
  periodLength: number;
}

function MoodCycleInsights({ history, todayData, periods, cycleLength, periodLength }: MoodCycleInsightsProps) {
  const analysis = useMemo(
    () => analyzeMoodsByPhase(history, todayData, periods, cycleLength, periodLength),
    [history, todayData, periods, cycleLength, periodLength]
  );

  const hasData = analysis.some(a => a.total > 0);
  if (!hasData) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-400 text-sm" style={{ fontSize: 'inherit' }}>
          Registra tu mood diario en "Hoy" para ver patrones emocionales por fase.
        </p>
        <p className="text-[10px] text-gray-300 mt-2">Necesitas al menos unos días de datos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {analysis.filter(a => a.total > 0).map(({ phase, moods, total, dominant }) => {
        const phaseColor = PHASE_COLORS[phase];
        return (
          <div key={phase} className="rounded-2xl p-3" style={{ backgroundColor: phaseColor.light }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: phaseColor.main }} />
                <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">{phaseColor.label}</span>
              </div>
              {dominant && (
                <div className="flex items-center gap-1 bg-white/70 rounded-full px-2.5 py-1">
                  <span className="text-sm">{MOOD_EMOJIS[dominant]}</span>
                  <span className="text-[10px] font-bold text-gray-600">{MOOD_LABELS[dominant]}</span>
                </div>
              )}
            </div>
            {/* Mood bar */}
            <div className="flex rounded-full overflow-hidden h-3 bg-white/50">
              {Object.entries(moods).map(([mood, count]) => {
                const pct = (count / total) * 100;
                const moodColors: Record<string, string> = {
                  triste: '#93c5fd', neutral: '#d1d5db', bien: '#86efac',
                  feliz: '#fde68a', genial: '#f9a8d4'
                };
                return (
                  <div
                    key={mood}
                    className="h-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: moodColors[mood] || '#d1d5db' }}
                    title={`${MOOD_LABELS[mood]}: ${Math.round(pct)}%`}
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(moods).map(([mood, count]) => (
                <span key={mood} className="text-[10px] text-gray-500">
                  {MOOD_EMOJIS[mood]} {Math.round((count / total) * 100)}%
                </span>
              ))}
              <span className="text-[10px] text-gray-400 ml-auto">{total} días</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Devocional por Fase ──────────────────────────────────────

interface PhaseDevotionalContent {
  verse: string;
  reference: string;
  prayer: string;
  message: string;
}

const PHASE_DEVOTIONALS: Record<PhaseKey, PhaseDevotionalContent> = {
  periodo: {
    verse: '"Vengan a mí todos ustedes que están cansados y agobiados, y yo les daré descanso."',
    reference: 'Mateo 11:28',
    prayer: 'Señor, en estos días de descanso, renueva mi cuerpo y mi espíritu. Dame paz y paciencia conmigo misma.',
    message: 'Tu cuerpo necesita gentileza. Dios te diseñó con sabiduría — descansa sin culpa.',
  },
  folicular: {
    verse: '"Todo lo puedo en Cristo que me fortalece."',
    reference: 'Filipenses 4:13',
    prayer: 'Padre, gracias por esta nueva energía. Ayúdame a usarla con propósito y para tu gloria.',
    message: 'Tu energía renace. Es un buen momento para empezar algo nuevo que Dios puso en tu corazón.',
  },
  fertil: {
    verse: '"Porque yo sé los planes que tengo para ustedes, planes de bienestar y no de calamidad."',
    reference: 'Jeremías 29:11',
    prayer: 'Señor, tú que eres creador de vida, guía mis pasos y mis decisiones en estos días.',
    message: 'Estás en tu momento de mayor vitalidad. Dios te hizo fuerte y capaz — confía en eso.',
  },
  ovulacion: {
    verse: '"El amor es paciente, es bondadoso. No tiene envidia ni es presumido."',
    reference: '1 Corintios 13:4',
    prayer: 'Dios de amor, llena mi corazón de tu presencia. Que todo lo que haga hoy refleje tu bondad.',
    message: 'Tu energía social y emocional está en su punto más alto. Comparte amor hoy.',
  },
  lutea: {
    verse: '"La paz les dejo, mi paz les doy. No se la doy como el mundo la da. No se angustien ni tengan miedo."',
    reference: 'Juan 14:27',
    prayer: 'Señor, cuando mis emociones fluctúan, recuérdame que tu paz es constante. Sé mi ancla.',
    message: 'Puede que sientas cambios de ánimo — es normal. Dios te sostiene en cada momento.',
  },
};

function PhaseDevotional({ phase }: { phase: PhaseKey }) {
  const content = PHASE_DEVOTIONALS[phase];

  return (
    <div className="space-y-4">
      {/* Verse */}
      <div className="bg-[var(--color-theme-pastel)]/20 rounded-2xl p-4 border border-[var(--color-theme-border)]/20">
        <p className="text-gray-700 italic leading-relaxed font-serif" style={{ fontSize: 'inherit' }}>
          {content.verse}
        </p>
        <p className="text-[11px] font-bold mt-2" style={{ color: 'var(--color-theme-primary)' }}>
          — {content.reference}
        </p>
      </div>

      {/* Message */}
      <div className="flex items-start gap-3 p-3 rounded-2xl" style={{ backgroundColor: PHASE_COLORS[phase].light }}>
        <Sparkles size={16} className="mt-0.5 shrink-0" style={{ color: PHASE_COLORS[phase].main }} />
        <p className="text-sm text-gray-600 leading-relaxed" style={{ fontSize: 'inherit' }}>{content.message}</p>
      </div>

      {/* Prayer */}
      <div className="bg-white/60 rounded-2xl p-4 border border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Oración para hoy</p>
        <p className="text-gray-600 leading-relaxed italic" style={{ fontSize: 'inherit' }}>
          {content.prayer}
        </p>
      </div>
    </div>
  );
}

// ── Botones Rápidos ──────────────────────────────────────────

interface QuickActionButtonsProps {
  periods: CyclePeriod[];
  onStartPeriod: () => void;
  onEndPeriod: () => void;
  cycleInfo: CyclePhaseInfo | null;
}

function QuickActionButtons({ periods, onStartPeriod, onEndPeriod, cycleInfo }: QuickActionButtonsProps) {
  const today = dateStr(new Date());
  const lastPeriod = periods.length > 0 ? periods[periods.length - 1] : null;
  const isInPeriod = lastPeriod && today >= lastPeriod.start && today <= lastPeriod.end;
  const periodEndedToday = lastPeriod && lastPeriod.end === today;

  return (
    <div className="flex gap-3">
      {!isInPeriod && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onStartPeriod}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-sm border-2"
          style={{
            backgroundColor: 'var(--color-theme-pastel)',
            borderColor: 'var(--color-theme-primary)',
            color: 'var(--color-theme-primary)'
          }}
        >
          <Droplets size={18} />
          Hoy me llegó
        </motion.button>
      )}
      {isInPeriod && !periodEndedToday && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onEndPeriod}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm bg-green-50 border-2 border-green-400 text-green-700 transition-all shadow-sm"
        >
          <Check size={18} />
          Hoy se me quitó
        </motion.button>
      )}
    </div>
  );
}

// ── Alerta de Ventana Fértil ─────────────────────────────────

function FertileAlert({ cycleInfo }: { cycleInfo: CyclePhaseInfo }) {
  if (cycleInfo.phase !== 'fertil' && cycleInfo.phase !== 'ovulacion') return null;

  const isOvulation = cycleInfo.phase === 'ovulacion';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-4 flex items-start gap-3"
      style={{ backgroundColor: isOvulation ? '#ede9fe' : '#f3e8ff' }}
    >
      <Flower2 size={20} className={isOvulation ? 'text-[#7c3aed] mt-0.5 shrink-0' : 'text-[#c084fc] mt-0.5 shrink-0'} />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800 text-sm">
          {isOvulation ? 'Hoy es tu día de ovulación' : 'Estás en tu ventana fértil'}
        </p>
        <p className="text-gray-600 text-[12px] mt-1 leading-relaxed" style={{ fontSize: 'inherit' }}>
          {isOvulation
            ? 'Máxima fertilidad hoy. Tu energía y ánimo social están en su punto más alto.'
            : `Días fértiles activos. Tu cuerpo está en un momento de alta energía y vitalidad.`
          }
        </p>
      </div>
    </motion.div>
  );
}

// ── Sugerencias de Autocuidado por Fase ──────────────────────

interface SelfCareTip {
  icon: React.ReactNode;
  category: string;
  tip: string;
}

const SELFCARE_TIPS: Record<PhaseKey, SelfCareTip[]> = {
  periodo: [
    { icon: <UtensilsCrossed size={16} />, category: 'Alimentación', tip: 'Hierro y vitamina C: espinacas, lentejas, naranja. Evita exceso de sal.' },
    { icon: <Dumbbell size={16} />, category: 'Ejercicio', tip: 'Yoga suave, caminatas cortas o estiramientos. Nada intenso.' },
    { icon: <Heart size={16} />, category: 'Autocuidado', tip: 'Baño caliente, manta y tu serie favorita. Mereces descansar.' },
  ],
  folicular: [
    { icon: <UtensilsCrossed size={16} />, category: 'Alimentación', tip: 'Proteínas y vegetales frescos. Tu metabolismo se activa.' },
    { icon: <Dumbbell size={16} />, category: 'Ejercicio', tip: 'Cardio, baile, HIIT. Tu cuerpo responde mejor al esfuerzo.' },
    { icon: <Zap size={16} />, category: 'Productividad', tip: 'Inicia proyectos nuevos. Tu creatividad está en aumento.' },
  ],
  fertil: [
    { icon: <UtensilsCrossed size={16} />, category: 'Alimentación', tip: 'Alimentos ricos en zinc y ácido fólico. Frutas frescas.' },
    { icon: <Dumbbell size={16} />, category: 'Ejercicio', tip: 'Ejercicio intenso, deportes en grupo. Energía al máximo.' },
    { icon: <Users size={16} />, category: 'Social', tip: 'Momento ideal para reuniones, presentaciones y conexiones.' },
  ],
  ovulacion: [
    { icon: <UtensilsCrossed size={16} />, category: 'Alimentación', tip: 'Antioxidantes: berries, verduras de hoja verde, té verde.' },
    { icon: <Dumbbell size={16} />, category: 'Ejercicio', tip: 'Tu rendimiento físico está al tope. Aprovecha.' },
    { icon: <Heart size={16} />, category: 'Emocional', tip: 'Comparte tiempo de calidad. Tu empatía está elevada.' },
  ],
  lutea: [
    { icon: <UtensilsCrossed size={16} />, category: 'Alimentación', tip: 'Magnesio y B6: chocolate oscuro, plátano, almendras. Reduce cafeína.' },
    { icon: <Dumbbell size={16} />, category: 'Ejercicio', tip: 'Pilates, natación, caminatas. Moverse sin forzar.' },
    { icon: <Moon size={16} />, category: 'Descanso', tip: 'Prioriza el sueño. Rutina nocturna relajante y sin pantallas.' },
  ],
};

function SelfCareCard({ phase }: { phase: PhaseKey }) {
  const tips = SELFCARE_TIPS[phase];

  return (
    <div className="space-y-3">
      {tips.map((tip, i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50">
          <div className="mt-0.5 shrink-0" style={{ color: PHASE_COLORS[phase].main }}>
            {tip.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{tip.category}</p>
            <p className="text-gray-600 text-sm mt-0.5 leading-relaxed" style={{ fontSize: 'inherit' }}>{tip.tip}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Hábitos por Fase ─────────────────────────────────────────

interface HabitPhaseData {
  phase: PhaseKey;
  completionRate: number;
  totalDays: number;
}

function analyzeHabitsByPhase(
  habits: { completedDays: boolean[] }[],
  history: DayData[],
  todayData: DayData,
  periods: CyclePeriod[],
  cycleLength: number,
  periodLength: number
): HabitPhaseData[] {
  // This is a simplified version — counts habit completions for current week position
  // mapped to cycle phases. Full implementation would need per-day habit tracking.
  if (periods.length === 0 || habits.length === 0) return [];

  const phaseKeys: PhaseKey[] = ['periodo', 'folicular', 'fertil', 'ovulacion', 'lutea'];
  const safeLen = clampCycleLength(cycleLength);
  const safePeriodLen = Math.max(1, Math.min(10, periodLength));
  const ovulationDayNum = Math.max(safePeriodLen + 1, safeLen - 14);
  const fertileStartNum = Math.max(safePeriodLen + 1, ovulationDayNum - 5);
  const fertileEndNum = ovulationDayNum + 1;

  // Map current week days to phases
  const phaseCounts: Record<PhaseKey, { completed: number; total: number }> = {
    periodo: { completed: 0, total: 0 },
    folicular: { completed: 0, total: 0 },
    fertil: { completed: 0, total: 0 },
    ovulacion: { completed: 0, total: 0 },
    lutea: { completed: 0, total: 0 },
  };

  const today = new Date();
  const lastPeriod = periods[periods.length - 1];

  for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
    const d = new Date(today);
    d.setDate(d.getDate() - d.getDay() + dayIdx + 1); // Monday-based
    const ds = dateStr(d);
    const dayInCycle = daysBetween(lastPeriod.start, ds) + 1;

    if (dayInCycle < 1 || dayInCycle > safeLen) continue;

    let phase: PhaseKey;
    if (dayInCycle <= safePeriodLen) phase = 'periodo';
    else if (dayInCycle < fertileStartNum) phase = 'folicular';
    else if (dayInCycle === ovulationDayNum) phase = 'ovulacion';
    else if (dayInCycle >= fertileStartNum && dayInCycle <= fertileEndNum) phase = 'fertil';
    else phase = 'lutea';

    for (const habit of habits) {
      const days = Array.isArray(habit.completedDays) ? habit.completedDays : [];
      phaseCounts[phase].total++;
      if (days[dayIdx]) phaseCounts[phase].completed++;
    }
  }

  return phaseKeys
    .map(phase => ({
      phase,
      completionRate: phaseCounts[phase].total > 0
        ? Math.round((phaseCounts[phase].completed / phaseCounts[phase].total) * 100)
        : 0,
      totalDays: phaseCounts[phase].total,
    }))
    .filter(d => d.totalDays > 0);
}

function HabitsPhaseInsights({ data }: { data: HabitPhaseData[] }) {
  if (data.length === 0) {
    return (
      <p className="text-gray-400 text-sm text-center py-4" style={{ fontSize: 'inherit' }}>
        Completa hábitos en "Hábitos" para ver tu rendimiento por fase.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {data.map(({ phase, completionRate }) => (
        <div key={phase} className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PHASE_COLORS[phase].main }} />
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider w-20 shrink-0">{PHASE_COLORS[phase].label}</span>
          <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: PHASE_COLORS[phase].main }}
            />
          </div>
          <span className="text-sm font-bold text-gray-600 w-12 text-right">{completionRate}%</span>
        </div>
      ))}
    </div>
  );
}

// ── Resumen Mensual ──────────────────────────────────────────

interface CycleSummaryProps {
  periods: CyclePeriod[];
  symptoms: Record<string, string[]>;
  cycleLength: number;
  periodLength: number;
  history: DayData[];
  todayData: DayData;
}

function CycleSummary({ periods, symptoms, cycleLength, periodLength, history, todayData }: CycleSummaryProps) {
  if (periods.length < 1) return null;

  const lastPeriod = periods[periods.length - 1];
  const prevPeriod = periods.length >= 2 ? periods[periods.length - 2] : null;

  const lastCycleLen = prevPeriod ? daysBetween(prevPeriod.start, lastPeriod.start) : null;
  const lastPeriodLen = daysBetween(lastPeriod.start, lastPeriod.end) + 1;

  // Most common symptoms across all dates
  const symptomCounts: Record<string, number> = {};
  Object.values(symptoms).forEach(items => {
    items.forEach(s => { symptomCounts[s] = (symptomCounts[s] || 0) + 1; });
  });
  const topSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => SYMPTOM_OPTIONS.find(s => s.id === id));

  // Mood summary from history
  const moodCounts: Record<string, number> = {};
  [...history, todayData].filter(d => d.mood).forEach(d => {
    if (d.mood) moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1;
  });
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#fce7f3]/30 rounded-2xl p-3 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Último ciclo</p>
          <p className="text-xl font-black text-[#e11d74] mt-1">{lastCycleLen || '—'}</p>
          <p className="text-[10px] text-gray-500">días</p>
        </div>
        <div className="bg-[#fce7f3]/30 rounded-2xl p-3 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Duración período</p>
          <p className="text-xl font-black text-[#e11d74] mt-1">{lastPeriodLen}</p>
          <p className="text-[10px] text-gray-500">días</p>
        </div>
      </div>

      {topSymptoms.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Síntomas más frecuentes</p>
          <div className="flex gap-2">
            {topSymptoms.map(s => s && (
              <div key={s.id} className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-3 py-2">
                <span className="text-lg">{s.emoji}</span>
                <span className="text-[11px] font-semibold text-gray-600">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {topMood && (
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Mood predominante</p>
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 w-fit">
            <span className="text-lg">{MOOD_EMOJIS[topMood[0]]}</span>
            <span className="text-[11px] font-semibold text-gray-600">{MOOD_LABELS[topMood[0]]}</span>
            <span className="text-[10px] text-gray-400">({topMood[1]} días)</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-2xl p-3 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Promedio ciclo</p>
          <p className="text-xl font-black text-gray-600 mt-1">{cycleLength}</p>
          <p className="text-[10px] text-gray-500">días</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-3 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ciclos registrados</p>
          <p className="text-xl font-black text-gray-600 mt-1">{periods.length}</p>
          <p className="text-[10px] text-gray-500">períodos</p>
        </div>
      </div>
    </div>
  );
}

// ── Exportar Reporte ─────────────────────────────────────────

function generateReport(
  periods: CyclePeriod[],
  symptoms: Record<string, string[]>,
  cycleLength: number,
  periodLength: number
): string {
  let report = '═══════════════════════════════\n';
  report += '  REPORTE DE CICLO MENSTRUAL\n';
  report += '  Diario de Abigail\n';
  report += `  Generado: ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}\n`;
  report += '═══════════════════════════════\n\n';

  report += `Promedio de ciclo: ${cycleLength} días\n`;
  report += `Promedio de período: ${periodLength} días\n`;
  report += `Ciclos registrados: ${periods.length}\n\n`;

  report += '── HISTORIAL DE PERÍODOS ──\n';
  const sorted = [...periods].sort((a, b) => b.start.localeCompare(a.start));
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    const dur = daysBetween(p.start, p.end) + 1;
    const cycLen = i < sorted.length - 1 ? daysBetween(sorted[i + 1].start, p.start) : null;
    report += `  ${p.start} → ${p.end} (${dur} días)`;
    if (cycLen) report += ` | Ciclo: ${cycLen} días`;
    report += '\n';
  }

  const symptomCounts: Record<string, number> = {};
  Object.values(symptoms).forEach(items => {
    items.forEach(s => { symptomCounts[s] = (symptomCounts[s] || 0) + 1; });
  });

  if (Object.keys(symptomCounts).length > 0) {
    report += '\n── SÍNTOMAS FRECUENTES ──\n';
    Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([id, count]) => {
        const s = SYMPTOM_OPTIONS.find(opt => opt.id === id);
        if (s) report += `  ${s.label}: ${count} veces\n`;
      });
  }

  report += '\n═══════════════════════════════\n';
  report += 'Este reporte es informativo.\n';
  report += 'Consulte a su ginecólogo para\n';
  report += 'orientación médica profesional.\n';
  report += '═══════════════════════════════\n';

  return report;
}

function ExportButton({ periods, symptoms, cycleLength, periodLength }: {
  periods: CyclePeriod[];
  symptoms: Record<string, string[]>;
  cycleLength: number;
  periodLength: number;
}) {
  const [copied, setCopied] = useState(false);

  const handleExport = () => {
    const report = generateReport(periods, symptoms, cycleLength, periodLength);
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <button
      onClick={handleExport}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all border-2 border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
    >
      {copied ? (
        <>
          <Check size={16} className="text-green-500" />
          Copiado al portapapeles
        </>
      ) : (
        <>
          <Download size={16} />
          Copiar reporte para el doctor
        </>
      )}
    </button>
  );
}

// ── Tendencia de Ciclos ──────────────────────────────────────

function CycleTrendChart({ periods }: { periods: CyclePeriod[] }) {
  if (periods.length < 3) {
    return (
      <p className="text-gray-400 text-sm text-center py-4" style={{ fontSize: 'inherit' }}>
        Necesitas al menos 3 ciclos para ver la tendencia.
      </p>
    );
  }

  const sorted = [...periods].sort((a, b) => a.start.localeCompare(b.start));
  const lengths: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    lengths.push(daysBetween(sorted[i - 1].start, sorted[i].start));
  }

  const maxLen = Math.max(...lengths);
  const minLen = Math.min(...lengths);
  const range = maxLen - minLen || 1;
  const avg = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);

  // Trend direction
  const recent = lengths.slice(-3);
  const older = lengths.slice(0, Math.max(1, lengths.length - 3));
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
  const trend = recentAvg > olderAvg + 1 ? 'alargando' : recentAvg < olderAvg - 1 ? 'acortando' : 'estable';

  return (
    <div className="space-y-4">
      {/* Mini bar chart */}
      <div className="flex items-end gap-1.5 h-20">
        {lengths.map((len, i) => {
          const heightPct = ((len - minLen) / range) * 60 + 40;
          const isLast = i === lengths.length - 1;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-gray-500">{len}</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${heightPct}%` }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="w-full rounded-t-lg"
                style={{
                  backgroundColor: isLast ? 'var(--color-theme-primary)' : PHASE_COLORS.lutea.main,
                  opacity: isLast ? 1 : 0.5,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Trend label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={14} style={{ color: 'var(--color-theme-primary)' }} />
          <span className="text-[11px] font-bold text-gray-500">
            Tendencia: <span className="capitalize" style={{ color: 'var(--color-theme-primary)' }}>{trend}</span>
          </span>
        </div>
        <span className="text-[11px] text-gray-400">Promedio: {avg}d</span>
      </div>
    </div>
  );
}

// ── Vista Principal ──────────────────────────────────────────

const Ciclo: React.FC = () => {
  const { state, updateCycle, getHistory } = useJournal();
  const [showLogPeriod, setShowLogPeriod] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<CyclePeriod | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(dateStr(new Date()));

  const cycle = state.cycle || { periods: [], cycleLength: 28, periodLength: 5, symptoms: {} };
  const periods = Array.isArray(cycle.periods) ? cycle.periods : [];
  const symptoms = cycle.symptoms || {};

  const avgCycleLength = useMemo(() => getAverageCycleLength(periods), [periods]);
  const avgPeriodLength = useMemo(() => getAveragePeriodLength(periods), [periods]);

  const cycleInfo = useMemo(
    () => getCycleInfo(periods, avgCycleLength, avgPeriodLength),
    [periods, avgCycleLength, avgPeriodLength]
  );

  // ── Handlers ──

  const handleLogPeriod = (start: string, end: string) => {
    const newPeriod: CyclePeriod = { start, end };
    // Si estamos editando, eliminamos el período original por su start antiguo
    const oldStart = editingPeriod?.start;
    const filtered = oldStart
      ? periods.filter(p => p.start !== oldStart)
      : periods.filter(p => p.start !== start);
    const updated = [...filtered, newPeriod].sort((a, b) => a.start.localeCompare(b.start));
    const newAvgCycle = getAverageCycleLength(updated);
    const newAvgPeriod = getAveragePeriodLength(updated);
    updateCycle({ periods: updated, cycleLength: newAvgCycle, periodLength: newAvgPeriod });
    setEditingPeriod(null);
  };

  const handleEditPeriod = (period: CyclePeriod) => {
    setEditingPeriod(period);
    setShowLogPeriod(true);
  };

  const handleDeletePeriod = (startDate: string) => {
    const updated = periods.filter(p => p.start !== startDate);
    const newAvgCycle = getAverageCycleLength(updated);
    const newAvgPeriod = getAveragePeriodLength(updated);
    updateCycle({ periods: updated, cycleLength: newAvgCycle, periodLength: newAvgPeriod });
  };

  const handleToggleSymptom = (symptomId: string) => {
    if (!selectedDate) return;
    const current = symptoms[selectedDate] || [];
    const updated = current.includes(symptomId)
      ? current.filter(s => s !== symptomId)
      : [...current, symptomId];
    updateCycle({ symptoms: { ...symptoms, [selectedDate]: updated } });
  };

  const handleQuickStart = () => {
    const today = dateStr(new Date());
    const newPeriod: CyclePeriod = { start: today, end: addDays(today, avgPeriodLength - 1) };
    const updated = [...periods.filter(p => p.start !== today), newPeriod].sort((a, b) => a.start.localeCompare(b.start));
    updateCycle({ periods: updated, cycleLength: getAverageCycleLength(updated), periodLength: getAveragePeriodLength(updated) });
  };

  const handleQuickEnd = () => {
    if (periods.length === 0) return;
    const today = dateStr(new Date());
    const last = periods[periods.length - 1];
    if (today >= last.start) {
      const updated = periods.map(p => p.start === last.start ? { ...p, end: today } : p);
      updateCycle({ periods: updated, periodLength: getAveragePeriodLength(updated) });
    }
  };

  const handleDayClick = (date: string) => {
    setSelectedDate(date);
  };

  const habitsPhaseData = useMemo(
    () => analyzeHabitsByPhase(
      Array.isArray(state.habits) ? state.habits : [],
      getHistory(), state.today, periods, avgCycleLength, avgPeriodLength
    ),
    [state.habits, periods, avgCycleLength, avgPeriodLength]
  );

  // ── Render: Empty State ──

  if (periods.length === 0) {
    return (
      <div className="space-y-8 pb-20">
        <header className="space-y-3">
          <h2 className="text-3xl font-serif font-bold text-gray-800" style={{ color: 'var(--color-theme-primary)' }}>
            Mi Ciclo
          </h2>
          <p className="text-gray-500" style={{ fontSize: 'inherit' }}>
            Lleva un registro de tu ciclo menstrual
          </p>
        </header>

        <div className="card-premium">
          <div className="flex flex-col items-center text-center py-8">
            <div className="w-20 h-20 rounded-full bg-[#fce7f3] flex items-center justify-center mb-6">
              <Heart size={36} className="text-[#e11d74]" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Comienza a registrar</h3>
            <p className="text-gray-500 max-w-xs mb-8" style={{ fontSize: 'inherit' }}>
              Registra tu primer período para que pueda predecir tus ciclos futuros y mostrarte información personalizada.
            </p>
            <button
              onClick={() => setShowLogPeriod(true)}
              className="flex items-center gap-2 py-3 px-8 rounded-2xl text-white font-bold text-sm transition-all hover:shadow-lg active:scale-[0.98]"
              style={{ backgroundColor: 'var(--color-theme-primary)' }}
            >
              <Plus size={18} />
              Registrar mi primer período
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showLogPeriod && (
            <PeriodLogPanel
              onLog={handleLogPeriod}
              onClose={() => { setShowLogPeriod(false); setEditingPeriod(null); }}
              initialStart={editingPeriod?.start}
              initialEnd={editingPeriod?.end}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── Render: Full View ──

  return (
    <div className="space-y-8 lg:space-y-12 pb-20">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif font-bold text-gray-800" style={{ color: 'var(--color-theme-primary)' }}>
            Mi Ciclo
          </h2>
          <p className="text-gray-500 text-sm">
            Día {cycleInfo?.dayInCycle || '—'} de {avgCycleLength}
          </p>
        </div>
        <button
          onClick={() => setShowLogPeriod(true)}
          className="flex items-center gap-2 py-2.5 px-5 rounded-2xl text-white font-bold text-sm transition-all hover:shadow-lg active:scale-[0.98]"
          style={{ backgroundColor: 'var(--color-theme-primary)' }}
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Registrar</span>
        </button>
      </header>

      {/* Botones rápidos */}
      <QuickActionButtons
        periods={periods}
        onStartPeriod={handleQuickStart}
        onEndPeriod={handleQuickEnd}
        cycleInfo={cycleInfo}
      />

      {/* Banner de alerta: retraso o próximo período */}
      {cycleInfo && (
        <PeriodAlertBanner cycleInfo={cycleInfo} onQuickLog={() => setShowLogPeriod(true)} />
      )}

      {/* Alerta de ventana fértil */}
      {cycleInfo && <FertileAlert cycleInfo={cycleInfo} />}

      <AnimatePresence>
        {showLogPeriod && (
          <PeriodLogPanel
              onLog={handleLogPeriod}
              onClose={() => { setShowLogPeriod(false); setEditingPeriod(null); }}
              initialStart={editingPeriod?.start}
              initialEnd={editingPeriod?.end}
            />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left column */}
        <div className="lg:col-span-7 space-y-8">
          {/* Dial Card */}
          {cycleInfo && (
            <section className="card-premium">
              <CycleDial cycleInfo={cycleInfo} periodLength={avgPeriodLength} />
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-6">
                {(Object.keys(PHASE_COLORS) as PhaseKey[]).map(key => (
                  <div key={key} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PHASE_COLORS[key].main, opacity: cycleInfo.phase === key ? 1 : 0.4 }} />
                    <span className="text-[10px] font-semibold text-gray-500">{PHASE_COLORS[key].label}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Phase Info */}
          {cycleInfo && (
            <section className="card-premium">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <TrendingUp size={18} style={{ color: 'var(--color-theme-primary)' }} />
                Tu fase actual
              </h3>
              <PhaseInfoCard cycleInfo={cycleInfo} />
            </section>
          )}

          {/* Symptom Log */}
          {selectedDate && (
            <section className="card-premium">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Heart size={18} style={{ color: 'var(--color-theme-primary)' }} />
                Síntomas
              </h3>
              <SymptomLog
                date={selectedDate}
                currentSymptoms={symptoms[selectedDate] || []}
                onToggle={handleToggleSymptom}
              />
            </section>
          )}

          {/* Self-care suggestions */}
          {cycleInfo && (
            <section className="card-premium">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Sparkles size={18} style={{ color: 'var(--color-theme-primary)' }} />
                Hoy es bueno para...
              </h3>
              <SelfCareCard phase={cycleInfo.phase} />
            </section>
          )}

          {/* Mood + Cycle Correlation */}
          <section className="card-premium">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <BarChart3 size={18} style={{ color: 'var(--color-theme-primary)' }} />
              Mood por Fase
            </h3>
            <p className="text-[11px] text-gray-400 mb-4">Cómo te has sentido en cada fase de tu ciclo</p>
            <MoodCycleInsights
              history={getHistory()}
              todayData={state.today}
              periods={periods}
              cycleLength={avgCycleLength}
              periodLength={avgPeriodLength}
            />
          </section>

          {/* Habits by Phase */}
          <section className="card-premium">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Dumbbell size={18} style={{ color: 'var(--color-theme-primary)' }} />
              Hábitos por Fase
            </h3>
            <p className="text-[11px] text-gray-400 mb-4">Tu constancia en cada momento del ciclo</p>
            <HabitsPhaseInsights data={habitsPhaseData} />
          </section>
        </div>

        {/* Right column */}
        <div className="lg:col-span-5 space-y-8">
          {/* Calendar */}
          <section className="card-premium lg:sticky lg:top-28">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Calendar size={18} style={{ color: 'var(--color-theme-primary)' }} />
              Calendario
            </h3>
            <MiniCalendar
              periods={periods}
              symptoms={symptoms}
              cycleLength={avgCycleLength}
              periodLength={avgPeriodLength}
              onDayClick={handleDayClick}
              selectedDate={selectedDate}
            />
          </section>

          {/* Phase Devotional */}
          {cycleInfo && (
            <section className="card-premium">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <BookOpen size={18} style={{ color: 'var(--color-theme-primary)' }} />
                Palabra para tu fase
              </h3>
              <PhaseDevotional phase={cycleInfo.phase} />
            </section>
          )}

          {/* Summary */}
          <section className="card-premium">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Activity size={18} style={{ color: 'var(--color-theme-primary)' }} />
              Resumen
            </h3>
            <CycleSummary
              periods={periods}
              symptoms={symptoms}
              cycleLength={avgCycleLength}
              periodLength={avgPeriodLength}
              history={getHistory()}
              todayData={state.today}
            />
          </section>

          {/* Cycle Trend */}
          {periods.length >= 3 && (
            <section className="card-premium">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <TrendingUp size={18} style={{ color: 'var(--color-theme-primary)' }} />
                Tendencia de Ciclos
              </h3>
              <CycleTrendChart periods={periods} />
            </section>
          )}

          {/* History */}
          {periods.length > 0 && (
            <section className="card-premium">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Droplets size={18} style={{ color: 'var(--color-theme-primary)' }} />
                Historial
              </h3>
              <CycleHistory periods={periods} onDelete={handleDeletePeriod} onEdit={handleEditPeriod} />
            </section>
          )}

          {/* Export Report */}
          {periods.length > 0 && (
            <section className="card-premium">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Download size={18} style={{ color: 'var(--color-theme-primary)' }} />
                Reporte Médico
              </h3>
              <p className="text-[11px] text-gray-400 mb-4">Copia un resumen para llevar a tu ginecólogo</p>
              <ExportButton
                periods={periods}
                symptoms={symptoms}
                cycleLength={avgCycleLength}
                periodLength={avgPeriodLength}
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ciclo;
