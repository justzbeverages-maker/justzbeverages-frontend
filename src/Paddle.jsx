import { useEffect, useRef } from 'react';
import './Paddle.css';

/**
 * OrangeJuiceCan
 *
 * A viewport-fixed canvas layer that renders a rising liquid puddle at the
 * bottom of the screen, driven by scroll progress. The can illustration and
 * pouring/stream animation have been removed — only the puddle remains.
 *
 * Props:
 *   fillProgress  number    default null    Controlled fill amount 0–1. If omitted, fill tracks window scroll.
 *   maxPoolHeight number    default 160     Max puddle height in px once fully filled.
 *   showHint      boolean   default true    Show the "scroll to fill" hint text.
 *   hintText      string    default '...'   Text for the hint.
 *   style         object    default {}      Extra inline styles on the root wrapper.
 */
export default function Paddle({
  fillProgress = null,
  maxPoolHeight = 160,
  showHint = true,
  hintText = 'scroll down to fill the glass',
  className = '',
  style = {},
}) {
  const rootRef = useRef(null);
  const hintRef = useRef(null);
  const fluidCanvasRef = useRef(null);
  const detailCanvasRef = useRef(null);

  // Keep the latest controlled fillProgress available inside the RAF loop
  const fillProgressRef = useRef(fillProgress);
  useEffect(() => {
    fillProgressRef.current = fillProgress;
  }, [fillProgress]);

  useEffect(() => {
    const canvasFluid = fluidCanvasRef.current;
    const canvasDetail = detailCanvasRef.current;
    const hintEl = hintRef.current;
    if (!canvasFluid || !canvasDetail) return;

    const ctxF = canvasFluid.getContext('2d');
    const ctxD = canvasDetail.getContext('2d');

    function resizeCanvas() {
      canvasFluid.width = window.innerWidth;
      canvasFluid.height = window.innerHeight;
      canvasDetail.width = window.innerWidth;
      canvasDetail.height = window.innerHeight;
    }
    resizeCanvas();

    // --- Liquid palette, read live from the CSS custom properties on :root ---
    function hexToRgbTriplet(hex, fallback) {
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec((hex || '').trim());
      if (!m) return fallback;
      return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
    }
    const rootStyles = getComputedStyle(document.documentElement);
    const baseRgb = hexToRgbTriplet(rootStyles.getPropertyValue('--ojc-liquid-color'), [122, 19, 48]);
    const hiRgb = hexToRgbTriplet(rootStyles.getPropertyValue('--ojc-liquid-color-highlight'), [194, 67, 97]);
    const rgba = (rgb, a) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;

    const LIQUID = {
      base: baseRgb,
      surfaceStroke: rgba([Math.min(255, hiRgb[0] + 20), Math.min(255, hiRgb[1] + 60), Math.min(255, hiRgb[2] + 65)], 0.35),
    };

    // --- Scroll-driven (or manually controlled) fill level ---
    let scrollProgress = 0;
    let targetPoolHeight = 0;

    function updateFillTarget() {
      if (fillProgressRef.current !== null && fillProgressRef.current !== undefined) {
        scrollProgress = Math.min(1, Math.max(0, fillProgressRef.current));
      } else {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      }
      targetPoolHeight = scrollProgress * maxPoolHeight;
      if (hintEl) hintEl.style.opacity = scrollProgress > 0.03 ? '0' : '1';
    }
    updateFillTarget();

    const onScroll = () => updateFillTarget();
    const onResize = () => { resizeCanvas(); updateFillTarget(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    let poolHeight = 0;
    let waveTime = 0;

    let rafId;
    function animLoop() {
      ctxF.clearRect(0, 0, canvasFluid.width, canvasFluid.height);
      ctxD.clearRect(0, 0, canvasDetail.width, canvasDetail.height);
      waveTime += 0.055;
      poolHeight += (targetPoolHeight - poolHeight) * 0.06;

      if (poolHeight > 0) {
        ctxF.fillStyle = rgba(LIQUID.base, 0.95);
        ctxF.beginPath();
        ctxF.moveTo(0, canvasFluid.height);
        ctxF.lineTo(0, canvasFluid.height - poolHeight);
        for (let x = 0; x <= canvasFluid.width; x += 28) {
          const wave = Math.sin(x * 0.02 + waveTime) * 9 + Math.cos(x * 0.015 - waveTime) * 5;
          ctxF.lineTo(x, (canvasFluid.height - poolHeight) + wave);
        }
        ctxF.lineTo(canvasFluid.width, canvasFluid.height - poolHeight);
        ctxF.lineTo(canvasFluid.width, canvasFluid.height);
        ctxF.fill();

        ctxD.beginPath();
        for (let x = 0; x <= canvasDetail.width; x += 28) {
          const wave = Math.sin(x * 0.02 + waveTime) * 9 + Math.cos(x * 0.015 - waveTime) * 5;
          const y = (canvasDetail.height - poolHeight) + wave;
          if (x === 0) ctxD.moveTo(x, y); else ctxD.lineTo(x, y);
        }
        ctxD.strokeStyle = LIQUID.surfaceStroke;
        ctxD.lineWidth = 1.6;
        ctxD.stroke();
      }

      rafId = requestAnimationFrame(animLoop);
    }
    rafId = requestAnimationFrame(animLoop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [maxPoolHeight]);

  return (
    <div ref={rootRef} className={`ojc-root ${className}`} style={style}>
      <canvas ref={fluidCanvasRef} className="ojc-fluid-layer" />
      <canvas ref={detailCanvasRef} className="ojc-detail-canvas" />

      {showHint && (
        <div ref={hintRef} className="ojc-hint">
          {hintText}
        </div>
      )}
    </div>
  );
}