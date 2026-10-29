(() => {
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('solid', window.scrollY > 10);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // revelar ao rolar
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));

  // trilho horizontal fixado
  const rail = document.querySelector('.rail');
  const track = document.querySelector('.rail-track');
  const prog = document.querySelector('.rail-progress');
  const desk = matchMedia('(min-width: 761px)');
  function railMove() {
    if (!desk.matches) { track.style.transform = ''; return; }
    const r = rail.getBoundingClientRect();
    const total = rail.offsetHeight - innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / total));
    const max = track.scrollWidth - track.parentElement.clientWidth + track.offsetLeft;
    track.style.transform = `translate3d(${-p * Math.max(0, max)}px,0,0)`;
    prog.style.setProperty('--p', p.toFixed(3));
  }
  addEventListener('scroll', railMove, { passive: true });
  addEventListener('resize', railMove); railMove();

  // planejador
  const grau = document.getElementById('grau');
  const out = document.getElementById('grau-out');
  const img = document.getElementById('plan-img');
  const tag = document.getElementById('plan-tag');
  const clarear = document.getElementById('clarear');
  const meses = document.getElementById('out-meses');
  const visitas = document.getElementById('out-visitas');
  const troca = document.getElementById('out-troca');
  const bA = document.getElementById('bar-alin'), bC = document.getElementById('bar-cont'), bW = document.getElementById('bar-clar');
  const lc = document.querySelector('.plan-legend .lc');
  const nomes = ['Quase alinhados', 'Apinhamento leve', 'Apinhamento moderado', 'Dentes girados e espaços', 'Apinhamento severo'];
  const tempo = {
    alinhador: [[4, 6], [8, 12], [12, 16], [16, 22], [20, 28]],
    fixo: [[6, 9], [10, 14], [14, 18], [18, 24], [22, 30]]
  };
  const media = {
    alinhador: { src: 'assets/alinhador-wide-700.webp', set: 'assets/alinhador-wide-700.webp 700w, assets/alinhador-wide.webp 1264w', alt: 'Alinhadores transparentes sobre cerâmica marfim', tag: 'Alinhador transparente' },
    fixo: { src: 'assets/aparelho-fixo-600.webp', set: 'assets/aparelho-fixo-600.webp 600w, assets/aparelho-fixo.webp 1100w', alt: 'Sorriso de perto com aparelho autoligado de braquetes claros', tag: 'Aparelho autoligado' }
  };
  let atual = 'alinhador';
  function render() {
    const tipo = document.querySelector('input[name=tipo]:checked').value;
    const g = +grau.value;
    grau.style.setProperty('--fill', ((g - 1) / 4 * 100) + '%');
    out.textContent = nomes[g - 1];
    const [a, b] = tempo[tipo][g - 1];
    meses.textContent = `${a} a ${b} meses`;
    visitas.textContent = tipo === 'alinhador' ? 'a cada 8 semanas' : 'a cada 4 semanas';
    troca.textContent = tipo === 'alinhador' ? 'a cada 14 dias' : 'sem placas';
    const cont = 12, clar = clarear.checked ? 1.5 : 0;
    const tot = b + cont + clar;
    bA.style.flexBasis = (b / tot * 100) + '%';
    bC.style.flexBasis = (cont / tot * 100) + '%';
    bW.style.flexBasis = (clar / tot * 100) + '%';
    lc.classList.toggle('on', clarear.checked);
    if (tipo !== atual) {
      atual = tipo;
      img.classList.add('swap');
      setTimeout(() => {
        const m = media[tipo];
        img.srcset = m.set; img.src = m.src; img.alt = m.alt; tag.textContent = m.tag;
        img.onload = () => img.classList.remove('swap');
        setTimeout(() => img.classList.remove('swap'), 500);
      }, 260);
    }
  }
  document.querySelectorAll('input[name=tipo]').forEach(r => r.addEventListener('change', render));
  grau.addEventListener('input', render);
  clarear.addEventListener('change', render);
  render();
})();
