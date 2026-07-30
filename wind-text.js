/* Adapted from the supplied GSAP wind-blown text effect. */
(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  function makeWindText(element) {
    const text = element.textContent.replace(/\s+/g, ' ').trim();
    const settings = {
      angle: Number(element.dataset.windAngle || 25),
      strength: Number(element.dataset.windStrength || 320),
      scatter: Number(element.dataset.scatter || 80),
      rotation: Number(element.dataset.maxRotation || 280),
      stagger: Number(element.dataset.stagger || .5)
    };

    element.textContent = '';
    const accessibleText = document.createElement('span');
    accessibleText.className = 'screen-reader-text';
    accessibleText.textContent = text;
    const measuringText = document.createElement('span');
    measuringText.setAttribute('aria-hidden', 'true');
    measuringText.style.visibility = 'hidden';
    measuringText.textContent = text;
    const layer = document.createElement('span');
    layer.setAttribute('aria-hidden', 'true');
    layer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:visible;';
    element.append(accessibleText, measuringText, layer);

    let trigger;
    let timeline;
    const rebuild = () => {
      trigger?.kill();
      timeline?.kill();
      layer.innerHTML = '';
      const bounds = element.getBoundingClientRect();
      const node = measuringText.firstChild;
      const characters = [];

      [...text].forEach((character, index) => {
        if (character === ' ') return;
        const range = document.createRange();
        range.setStart(node, index);
        range.setEnd(node, index + 1);
        const box = range.getBoundingClientRect();
        const letter = document.createElement('span');
        letter.className = 'wind-char';
        letter.textContent = character;
        letter.style.cssText += `left:${box.left - bounds.left}px;top:${box.top - bounds.top}px;width:${box.width}px;height:${box.height}px;`;
        layer.appendChild(letter);
        characters.push(letter);
      });

      const radians = settings.angle * Math.PI / 180;
      timeline = gsap.timeline({ paused:true });
      characters.forEach((letter, index) => {
        const spread = (index / Math.max(1, characters.length - 1)) * settings.stagger;
        const sideWind = (Math.random() - .5) * settings.scatter;
        timeline.to(letter, {
          x: Math.cos(radians) * settings.strength + sideWind,
          y: -Math.sin(radians) * settings.strength + (Math.random() - .5) * settings.scatter,
          z: (Math.random() - .5) * 140,
          rotationX: (Math.random() - .5) * settings.rotation,
          rotationY: (Math.random() - .5) * settings.rotation,
          rotationZ: (Math.random() - .5) * 100,
          opacity: 0,
          duration: 1,
          ease: 'power3.in'
        }, spread);
      });
      trigger = ScrollTrigger.create({ trigger:element, start:'top 52%', end:'bottom top', scrub:1, animation:timeline });
    };
    rebuild();
    new ResizeObserver(() => { clearTimeout(element._windResize); element._windResize = setTimeout(rebuild, 200); }).observe(element);
  }

  document.fonts.ready.then(() => document.querySelectorAll('.wind-text').forEach(makeWindText));
})();
