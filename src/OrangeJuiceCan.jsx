import { useEffect, useRef } from 'react';
import './OrangeJuiceCan.css';

/**
 * OrangeJuiceCan
 *
 * A tilted, spinnable soda-can illustration that sits at the top of the
 * page in normal document flow. A separate viewport-fixed canvas layer renders 
 * a continuous pouring stream and a rising puddle at the bottom of the screen.
 *
 * Props:
 *   fillProgress  number    default null    Controlled fill amount 0–1. If omitted, fill tracks window scroll.
 *   maxPoolHeight number    default 95      Max puddle height in px once fully filled.
 *   showHint      boolean   default true    Show the "scroll to fill" hint text.
 *   hintText      string    default '...'   Text for the hint.
 *   style         object    default {}      Extra inline styles on the root wrapper.
 */
export default function OrangeJuiceCan({
  fillProgress = null,
  maxPoolHeight = 160,
  showHint = true,
  hintText = 'scroll down to fill the glass · drag can to spin',
  className = '',
  style = {},
}) {
  const rootRef = useRef(null);
  const dragAreaRef = useRef(null);
  const canRef = useRef(null);
  const spoutRef = useRef(null);
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
    const can = canRef.current;
    const dragArea = dragAreaRef.current;
    const spout = spoutRef.current;
    const hintEl = hintRef.current;
    if (!canvasFluid || !canvasDetail || !can || !dragArea || !spout) return;

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
    // (previously the canvas colors were hardcoded orange and never looked at
    // these variables at all; now changing the CSS vars actually changes the pour)
    function hexToRgbTriplet(hex, fallback) {
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec((hex || '').trim());
      if (!m) return fallback;
      return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
    }
    const rootStyles = getComputedStyle(document.documentElement);
    const baseRgb = hexToRgbTriplet(rootStyles.getPropertyValue('--ojc-liquid-color'), [122, 19, 48]);
    const darkRgb = hexToRgbTriplet(rootStyles.getPropertyValue('--ojc-liquid-color-dark'), [61, 9, 22]);
    const hiRgb = hexToRgbTriplet(rootStyles.getPropertyValue('--ojc-liquid-color-highlight'), [194, 67, 97]);
    const lightRgb = hexToRgbTriplet(rootStyles.getPropertyValue('--ojc-liquid-color-light'), [176, 51, 90]);
    const rgba = (rgb, a) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;

    const LIQUID = {
      base: baseRgb,
      dark: darkRgb,
      hi: hiRgb,
      light: lightRgb,
      // pale rose/foam tones derived from the highlight, used for fizz + foam
      foamA: rgba([Math.min(255, hiRgb[0] + 22), Math.min(255, hiRgb[1] + 60), Math.min(255, hiRgb[2] + 60)], 0.85),
      foamB: rgba([Math.min(255, hiRgb[0] + 45), Math.min(255, hiRgb[1] + 90), Math.min(255, hiRgb[2] + 90)], 0.85),
      fizzStroke: rgba([Math.min(255, hiRgb[0] + 30), Math.min(255, hiRgb[1] + 70), Math.min(255, hiRgb[2] + 70)], 0.75),
      rippleStroke: rgba([Math.min(255, hiRgb[0] + 30), Math.min(255, hiRgb[1] + 80), Math.min(255, hiRgb[2] + 75)], 0.85),
      surfaceStroke: rgba([Math.min(255, hiRgb[0] + 20), Math.min(255, hiRgb[1] + 60), Math.min(255, hiRgb[2] + 65)], 0.35),
    };

    // --- Spin controls (drag left/right to spin the label around the can) ---
    let isDragging = false;
    let startX = 0;
    let bgPosX = 0;
    let velocity = 0;
    const spinSensitivity = 1.5;
    const friction = 0.93;

    const startDrag = (x) => { isDragging = true; startX = x; velocity = 0; };
    const moveDrag = (x) => {
      if (!isDragging) return;
      const deltaX = x - startX;
      startX = x;
      velocity = deltaX * spinSensitivity;
      bgPosX += velocity;
      can.style.backgroundPosition = `0 0, 0 0, ${bgPosX}px 0`;
    };
    const onMouseDown = (e) => { startDrag(e.clientX); e.preventDefault(); };
    const onMouseMove = (e) => moveDrag(e.clientX);
    const onMouseUp = () => { isDragging = false; };
    const onTouchStart = (e) => startDrag(e.touches[0].clientX);
    const onTouchMove = (e) => moveDrag(e.touches[0].clientX);
    const onTouchEnd = () => { isDragging = false; };

    dragArea.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dragArea.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

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

    // --- Physics: juice stream + splashes + pulp froth ---
    let dropStreams = [];
    let splashDrops = [];
    let fizzBubbles = [];
    let foamBits = [];
    let ripples = [];
    let poolHeight = 0;
    let waveTime = 0;

    class StreamDrop {
      constructor(x, y, radius, vy) {
        this.x = x + (Math.random() - 0.5) * 6;
        this.y = y;
        this.radius = radius;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = vy;
        this.gravity = 0.62;
        this.stretch = 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.radius += 0.38;
        this.stretch = Math.min(7, 1 + this.vy * 0.16);
      }
      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(1, this.stretch);
        ctx.beginPath();
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
        g.addColorStop(0, rgba(LIQUID.hi, 0.97));
        g.addColorStop(0.55, rgba(LIQUID.base, 0.93));
        g.addColorStop(1, rgba(LIQUID.dark, 0));
        ctx.fillStyle = g;
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.arc(-this.radius * 0.3, -this.radius * 0.3, this.radius * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class SplashDrop {
      constructor(x, y, angle = -Math.PI / 2, speed = 6) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 3.5 + 1.8;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.gravity = 0.62;
      }
      update() { this.x += this.vx; this.y += this.vy; this.vy += this.gravity; this.radius *= 0.945; }
      draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = rgba(LIQUID.light, 0.92);
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Ripple {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 3;
        this.alpha = 0.55;
      }
      update() { this.radius += 2.1; this.alpha *= 0.92; }
      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.radius, this.radius * 0.26, 0, 0, Math.PI * 2);
        ctx.strokeStyle = LIQUID.rippleStroke;
        ctx.lineWidth = 1.3;
        ctx.stroke();
        ctx.restore();
      }
    }

    class FizzBubble {
      constructor(x, y) {
        this.x = x + (Math.random() - 0.5) * 170;
        this.y = y + Math.random() * 20;
        this.radius = Math.random() * 1.6 + 0.5;
        this.vy = -(Math.random() * 1.4 + 0.5);
        this.wobble = Math.random() * Math.PI * 2;
        this.life = 1;
      }
      update() {
        this.y += this.vy;
        this.wobble += 0.15;
        this.x += Math.sin(this.wobble) * 0.3;
        this.life -= 0.006;
      }
      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life * 0.7);
        ctx.beginPath();
        ctx.strokeStyle = LIQUID.fizzStroke;
        ctx.lineWidth = 0.6;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    class FoamBit {
      constructor(x, y, isStatic = false) {
        this.x = x + (Math.random() - 0.5) * 190;
        this.y = y + (Math.random() - 0.5) * (isStatic ? maxPoolHeight : 24);
        this.radius = Math.random() * 3 + 0.8;
        this.alpha = Math.random() * 0.6 + 0.25;
        this.life = 1;
        this.isStatic = isStatic;
      }
      update() { this.life -= this.isStatic ? 0.004 : 0.018; }
      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life * this.alpha);
        ctx.beginPath();
        ctx.fillStyle = Math.random() > 0.5 ? LIQUID.foamA : LIQUID.foamB;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    let pourOriginX = window.innerWidth * 0.88;
    let pourOriginY = window.innerHeight * 0.07;

    let rafId;
    function animLoop() {
      ctxF.clearRect(0, 0, canvasFluid.width, canvasFluid.height);
      ctxD.clearRect(0, 0, canvasDetail.width, canvasDetail.height);
      waveTime += 0.055;
      poolHeight += (targetPoolHeight - poolHeight) * 0.06;

      if (!isDragging && Math.abs(velocity) > 0.08) {
        bgPosX += velocity;
        velocity *= friction;
        can.style.backgroundPosition = `0 0, 0 0, ${bgPosX}px 0`;
      }

      const surfaceY = canvasFluid.height - poolHeight;

      const spoutRect = spout.getBoundingClientRect();
      const canVisible = spoutRect.bottom > 10 && spoutRect.top < window.innerHeight;
      if (canVisible) {
        pourOriginX = spoutRect.left + spoutRect.width / 2;
        pourOriginY = spoutRect.top + spoutRect.height / 2;
      }
      const originX = pourOriginX;
      const originY = canVisible ? pourOriginY : -12;

      // Stream goes straight down to the puddle height
      const collisionY = surfaceY;
      const streamBottomY = canvasFluid.height;
      const streamLen = Math.max(0, streamBottomY - originY);

      const topWidth = 15;
      const bottomWidth = 200 + Math.sin(waveTime * 0.4) * 4;
      const wobbleMid = Math.sin(waveTime * 3) * 14;
      const wobbleLow = Math.cos(waveTime * 4) * 22;

      // --- Glossy ribbon stream with natural necking/bulging ---
      const segs = 12;
      const leftPts = [];
      const rightPts = [];
      const centerPts = [];
      
      if (streamLen > 0) {
        for (let i = 0; i <= segs; i++) {
          const t = i / segs;
          const y = originY + streamLen * t;
          const neck = 1 + Math.sin(t * 9 - waveTime * 5) * 0.16 * t;
          const w = (topWidth + (bottomWidth - topWidth) * t) * neck;
          const bow = wobbleMid * Math.sin(t * Math.PI * 0.9) + wobbleLow * t * t;
          const x = originX + bow;
          leftPts.push([x - w / 2, y]);
          rightPts.push([x + w / 2, y]);
          centerPts.push([x - w * 0.16, y]);
        }

        ctxF.beginPath();
        ctxF.moveTo(leftPts[0][0], leftPts[0][1]);
        for (let i = 1; i < leftPts.length; i++) ctxF.lineTo(leftPts[i][0], leftPts[i][1]);
        for (let i = rightPts.length - 1; i >= 0; i--) ctxF.lineTo(rightPts[i][0], rightPts[i][1]);
        ctxF.closePath();
        const spineGrad = ctxF.createLinearGradient(originX, originY, originX, streamBottomY);
        spineGrad.addColorStop(0, rgba(LIQUID.light, 0.96));
        spineGrad.addColorStop(0.5, rgba(LIQUID.base, 0.93));
        spineGrad.addColorStop(1, rgba(LIQUID.dark, 0.9));
        ctxF.fillStyle = spineGrad;
        ctxF.fill();

        ctxF.save();
        ctxF.globalAlpha = 0.4;
        ctxF.beginPath();
        ctxF.moveTo(centerPts[0][0], centerPts[0][1]);
        for (let i = 1; i < centerPts.length; i++) ctxF.lineTo(centerPts[i][0], centerPts[i][1]);
        ctxF.strokeStyle = 'rgba(255,255,255,0.45)';
        ctxF.lineWidth = 2.4;
        ctxF.lineCap = 'round';
        ctxF.stroke();
        ctxF.restore();

        ctxF.save();
        ctxF.globalAlpha = 0.3;
        ctxF.beginPath();
        ctxF.moveTo(rightPts[0][0], rightPts[0][1]);
        for (let i = 1; i < rightPts.length; i++) ctxF.lineTo(rightPts[i][0], rightPts[i][1]);
        ctxF.strokeStyle = rgba(LIQUID.dark, 0.55);
        ctxF.lineWidth = 1.4;
        ctxF.stroke();
        ctxF.restore();
      }

      const impactX = leftPts.length
        ? (leftPts[leftPts.length - 1][0] + rightPts[rightPts.length - 1][0]) / 2
        : originX;

      for (let i = 0; i < 9; i++) {
        dropStreams.push(new StreamDrop(originX, originY, 7 + Math.random() * 3, 2 + i * 1.4));
      }

      for (let i = dropStreams.length - 1; i >= 0; i--) {
        const d = dropStreams[i];
        d.update();
        d.draw(ctxF);
        
        // Collide with the puddle
        if (d.y + d.radius * d.stretch >= collisionY) {
          dropStreams.splice(i, 1);
          if (Math.random() > 0.35) {
            const burstCount = 3 + Math.floor(Math.random() * 3);
            for (let k = 0; k < burstCount; k++) {
              const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.85;
              const speed = Math.random() * 6 + 3;
              splashDrops.push(new SplashDrop(d.x, collisionY, angle, speed));
            }
            ripples.push(new Ripple(d.x, collisionY));
          }
          if (Math.random() > 0.25) foamBits.push(new FoamBit(d.x, collisionY));
          if (Math.random() > 0.3) fizzBubbles.push(new FizzBubble(d.x, collisionY - 4));
        }
      }

      for (let i = splashDrops.length - 1; i >= 0; i--) {
        const s = splashDrops[i];
        s.update();
        s.draw(ctxF);
        if (s.radius < 0.6 || s.y > canvasFluid.height + 20) splashDrops.splice(i, 1);
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.update();
        r.draw(ctxD);
        if (r.alpha < 0.03) ripples.splice(i, 1);
      }

      if (poolHeight > 8 && Math.random() > 0.15) {
        foamBits.push(new FoamBit(impactX, canvasFluid.height, true));
      }
      if (poolHeight > 8 && Math.random() > 0.5) {
        fizzBubbles.push(new FizzBubble(impactX, canvasFluid.height - 4));
      }

      for (let i = foamBits.length - 1; i >= 0; i--) {
        const f = foamBits[i];
        f.update();
        f.draw(ctxD);
        if (f.life <= 0) foamBits.splice(i, 1);
      }
      for (let i = fizzBubbles.length - 1; i >= 0; i--) {
        const b = fizzBubbles[i];
        b.update();
        b.draw(ctxD);
        if (b.life <= 0 || b.y < surfaceY - 30) fizzBubbles.splice(i, 1);
      }

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
      dragArea.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dragArea.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [maxPoolHeight]);

  return (
    <div ref={rootRef} className={`ojc-root ${className}`} style={style}>
      <canvas ref={fluidCanvasRef} className="ojc-fluid-layer" />
      <canvas ref={detailCanvasRef} className="ojc-detail-canvas" />

      <div className="ojc-pin">
        <div className="ojc-stage">
          <div ref={dragAreaRef} className="ojc-scene">
            <div className="ojc-lid">
              <div className="ojc-lid-score" />
              <div className="ojc-pop-tab" />
              <div ref={spoutRef} className="ojc-spout" />
            </div>
            <div ref={canRef} className="ojc-can" />
            <div className="ojc-bottom" />
          </div>
        </div>
      </div>

      {showHint && (
        <div ref={hintRef} className="ojc-hint">
          {hintText}
        </div>
      )}
    </div>
  );
}