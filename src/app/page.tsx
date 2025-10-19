"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* -------- Navegación y datos -------- */
const NAV = [
  { label: "Inicio", href: "#inicio" },
  { label: "Quiénes somos", href: "#quienes" },
  { label: "Villas", href: "#villas" },
  { label: "Galería", href: "#galeria" },
  { label: "Ubicación", href: "#ubicacion" },
  { label: "Contacto", href: "#contacto" },
];

type VillaId = "A" | "B" | "C" | "D";
type Villa = { id: VillaId; parcela?: number|null; util: number; construida: number; img: string };

const VILLAS: Villa[] = [
  { id: "A", parcela: 269.61, util: 123.90, construida: 143.41, img: "/quattro/quattro-02.jpeg" },
  { id: "B", parcela: 260.33, util: 123.90, construida: 143.41, img: "/quattro/quattro-07.jpeg" },
  { id: "C", parcela: 257.47, util: 121.56, construida: 141.14, img: "/quattro/quattro-06.jpeg" },
  { id: "D", parcela: 263.88, util: 121.56, construida: 141.14, img: "/quattro/quattro-09.jpeg" },
];

const GALLERY = [
  "/quattro/quattro-08.jpeg",
  "/quattro/quattro-07.jpeg",
  "/quattro/quattro-10.jpeg",
  "/quattro/quattro-09.jpeg",
  "/quattro/quattro-02.jpeg",
  "/quattro/quattro-06.jpeg",
  "/quattro/quattro-04.jpeg",
  "/quattro/quattro-03.jpeg",
];

const fmt = (n:number)=>n.toLocaleString("es-ES",{minimumFractionDigits:2, maximumFractionDigits:2});

export default function Page(){
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sent, setSent] = useState(false);

  // Villas tabs (se mantiene)
  const [tab, setTab] = useState<VillaId>("A");
  const current = VILLAS.find(v => v.id === tab)!;

  // Sticky header
  useEffect(()=>{
    const onS = ()=>setScrolled(window.scrollY>6);
    onS(); window.addEventListener("scroll", onS, {passive:true});
    return ()=>window.removeEventListener("scroll", onS);
  },[]);

  // Lock scroll cuando menú está abierto
  useEffect(()=>{
    if(menu) document.documentElement.classList.add("nav-open");
    else document.documentElement.classList.remove("nav-open");
    return ()=>document.documentElement.classList.remove("nav-open");
  },[menu]);

  // Galería
  const trackRef = useRef<HTMLDivElement>(null);
  const [dot,setDot] = useState(0);
  const onScroll = ()=>{
    const el = trackRef.current; if(!el) return;
    const w = el.clientWidth*.85; const i = Math.round(el.scrollLeft / w);
    setDot(Math.max(0,Math.min(GALLERY.length-1,i)));
  };
  const move = (dir:"prev"|"next")=>{
    const el = trackRef.current; if(!el) return;
    const w = el.clientWidth*.85; el.scrollBy({left: dir==="next"? w : -w, behavior:"smooth"});
  };

  return (
    <main>
      {/* ===== NAV ===== */}
      <header className={`topbar ${scrolled?"is-scrolled":""}`}>
        <div className="container pad h-full flex items-center justify-between">
          <a href="#inicio" className="brand" aria-label="Inicio">
            <span className="brand__mark">QI</span>
            <span className="brand__name">Quattro Islands</span>
          </a>

          <nav className="nav-desktop">
            {NAV.map(n=>(
              <a key={n.href} href={n.href} className="nav-link">{n.label}</a>
            ))}
          </nav>

          <button className={`burger ${menu?"is-active":""}`} aria-label="Menú" onClick={()=>setMenu(v=>!v)}>
            <span/><span/><span/>
          </button>
        </div>

        {/* Menú móvil: pantalla completa opaca */}
        <div className={`nav-overlay ${menu?"open":""}`} onClick={()=>setMenu(false)}>
          <nav className="nav-menu" onClick={(e)=>e.stopPropagation()}>
            {NAV.map(n=>(
              <a key={n.href} href={n.href} onClick={()=>setMenu(false)}>{n.label}</a>
            ))}
          </nav>
        </div>
      </header>

      {/* ===== HERO (solo título + subtítulo script) ===== */}
      <section id="inicio" className="hero">
        <Image
          src="/quattro/quattro-08.jpeg"
          alt="Piscina y jardín — Quattro Islands"
          fill priority sizes="100vw"
          style={{objectFit:"cover", objectPosition:"center 78%"}}
        />
        <div className="hero__fade"/>
        <div className="hero__center">
          <div className="h1">Quattro Islands</div>
          <p className="hero__subtitle script">Tu villa en el Mediterráneo</p>
        </div>
      </section>

                        {/* ===== QUIÉNES SOMOS — doble arco con tarjetas flotantes ===== */}
      <section id="quienes" className="section bg-ivory">

        {/* ARCO SUPERIOR (alineado a la izquierda) */}
        <div className="container pad">
          <div className="arch-wrap align-left">
            <div className="arch-clip arch-top">
              <Image
                src="/quattro/quattro-03.jpeg"
                alt="Interior — Quattro Islands"
                fill
                sizes="100vw"
                className="object-cover"
                priority={false}
              />
            </div>

            {/* Tarjeta FLOTANTE (no se corta) */}
            <div className="overlay-card overlay-card--float float-tl">
              <div className="eyebrow">¿Por qué Quattro Islands?</div>
              <h2 className="h2">Cuatro islas privadas en La Font</h2>
              <div className="rule rule--short" />
              <p className="lead">
                <strong>Quattro Islands</strong> son cuatro villas concebidas como
                <em> islas privadas</em>, exclusivas y singulares. Privacidad y calma mediterránea con
                un diseño contemporáneo muy cuidado.
              </p>
              <p className="lead">
                En <strong>La Font</strong> (El Campello), a <strong>10’</strong> de Muchavista y
                <strong> 15’</strong> del centro de Alicante.
              </p>
              <div className="chips" style={{ marginTop: 10 }}>
                {["Piscina 3×5 m", "2 plazas en parcela", "Fachada piedra + monocapa"].map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ARCO INFERIOR (alineado a la derecha) */}
        <div className="container pad">
          <div className="arch-wrap align-right">
            <div className="arch-clip arch-bottom">
              <Image
                src="/quattro/quattro-06.jpeg"   // cambia si quieres otra
                alt="Exterior — Quattro Islands"
                fill
                sizes="100vw"
                className="object-cover"
                priority={false}
              />
            </div>

            {/* Tarjeta FLOTANTE (no se corta) */}
            <div className="overlay-card overlay-card--float float-br">
              <div className="eyebrow">Constructora del proyecto</div>
              <h3 className="h3">¿Quién construye tu casa?</h3>
              <div className="rule rule--short" />
              <p className="lead">
                <strong>ZIMCO Proyectos y Diseños SL</strong>, empresa de Alicante especializada en
                obra nueva, reformas integrales y diseño de interiores. Desde 2018, viviendas “llave en mano”
                con calidad, detalle y atención personalizada.
              </p>
              <blockquote className="quote script">
                Hogares mediterráneos, atemporales y pensados para vivir mejor.
              </blockquote>
            </div>
          </div>
        </div>
      </section>


      {/* ===== VILLAS — MANTENEMOS TABS ===== */}
      <section id="villas" className="section bg-white">
        <div className="container pad">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="eyebrow">Unidades</div>
            <h2 className="h2">Las 4 villas</h2>
            <p className="muted">Piscina privada 3×5 m y 2 plazas de aparcamiento en parcela.</p>
          </div>

          {/* Tabs */}
          <div className="tabs">
            {(["A","B","C","D"] as VillaId[]).map(id=>(
              <button
                key={id}
                className="tab"
                role="tab"
                aria-selected={tab===id}
                onClick={()=>setTab(id)}
              >
                Villa {id}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="v-panel mt-4" role="tabpanel" aria-labelledby={`Tab Villa ${tab}`}>
            <div className="v-grid">
              <div className="v-hero">
                <Image src={current.img} alt={`Villa ${current.id}`} fill sizes="(min-width:980px) 52vw, 100vw" style={{objectFit:"cover"}}/>
              </div>
              <div className="v-info">
                <div className="eyebrow">Ficha — Villa {current.id}</div>
                <div className="chips" style={{marginTop:8}}>
                  <span className="chip">Útil <b>{fmt(current.util)} m²</b></span>
                  <span className="chip">Construida <b>{fmt(current.construida)} m²</b></span>
                  <span className="chip">Parcela <b>{current.parcela ? `${fmt(current.parcela)} m²` : "pendiente"}</b></span>
                  <span className="chip">Piscina 3×5 m</span>
                  <span className="chip">2 plazas</span>
                </div>

                <table className="spec">
                  <tbody>
                    <tr><th>Distribución</th><td>Salón–comedor con salida al jardín; cocina abierta (<em>opción cerrada</em> con corredera o vidrio); 3 dormitorios; 2 baños + aseo.</td></tr>
                    <tr><th>Exterior</th><td>Terraza, jardín y <strong>piscina privada 3×5 m</strong>; toldo incluido u opción pérgola de madera.</td></tr>
                    <tr><th>Fachada</th><td>Monocapa blanco; parte inferior en piedra y superior tono “café con leche” (opción porcelánico según presupuesto).</td></tr>
                    <tr><th>Dormitorio</th><td>Plano con cama doble y <strong>armario empotrado grande</strong>.</td></tr>
                    <tr><th>Parking</th><td>Dos plazas dentro de la parcela, junto a la piscina.</td></tr>
                  </tbody>
                </table>

                <p className="muted" style={{fontSize:12}}>* Superficies aproximadas. Imágenes orientativas. CEE en trámite.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GALERÍA ===== */}
      <section id="galeria" className="section bg-ivory">
        <div className="container pad">
          <div className="flex items-end justify-between">
            <div>
              <div className="eyebrow">Imágenes</div>
              <h2 className="h2">Galería</h2>
            </div>
            <div className="hidden sm:flex gap-2">
              <button className="btn btn-outline" onClick={()=>move("prev")} aria-label="Anterior">‹</button>
              <button className="btn btn-outline" onClick={()=>move("next")} aria-label="Siguiente">›</button>
            </div>
          </div>

          <div ref={trackRef} onScroll={onScroll} className="gallery mt-4" aria-roledescription="carousel">
            {GALLERY.map((src,i)=>(
              <figure key={i}>
                <Image src={src} alt={`Imagen ${i+1}`} width={1800} height={1200} />
              </figure>
            ))}
          </div>
          <div className="dots">
            {GALLERY.map((_,i)=> <span key={i} className={i===dot? "active": ""} /> )}
          </div>
        </div>
      </section>

      {/* ===== UBICACIÓN ===== */}
      <section id="ubicacion" className="section bg-white">
        <div className="container pad grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="eyebrow">Ubicación</div>
            <h2 className="h2">La Font, El Campello</h2>
            <p className="lead">Entorno exclusivo y tranquilo; a 10’ de Muchavista y 15’ del centro de Alicante.</p>
            <div className="chips" style={{marginTop:10}}>
              {["Colegios", "Centros comerciales", "Restaurantes", "Ocio y deporte", "Conexión autovía"].map(t=>(
                <span key={t} className="chip">✓ {t}</span>
              ))}
            </div>
          </div>
          <div className="bg-white overflow-hidden rounded-2xl border border-[color:var(--line)] shadow">
            <iframe
              title="Mapa La Font"
              className="w-full h-[340px]"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-0.461%2C38.374%2C-0.398%2C38.419&layer=mapnik&marker=38.397%2C-0.429"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ===== CONTACTO ===== */}
      <section id="contacto" className="section bg-ivory">
        <div className="container pad max-w-4xl">
          <div className="text-center mb-8">
            <div className="eyebrow">Contacto</div>
            <h2 className="h2">Solicita información</h2>
          </div>

          {sent ? (
            <div className="bg-white rounded-2xl border border-[color:var(--line)] shadow p-10 text-center">
              <div className="h3">¡Gracias!</div>
              <p className="lead mt-2">Hemos recibido tu mensaje y te contactaremos muy pronto.</p>
            </div>
          ) : (
            <form onSubmit={(e)=>{ e.preventDefault(); setSent(true); }} className="grid md:grid-cols-2 gap-6">
              <div><label className="label">Nombre *</label><input className="input" required/></div>
              <div><label className="label">Teléfono</label><input className="input" inputMode="tel"/></div>
              <div className="md:col-span-2"><label className="label">Email *</label><input type="email" className="input" required/></div>
              <div className="md:col-span-2"><label className="label">Mensaje</label><textarea rows={5} className="input"/></div>
              <label className="md:col-span-2" style={{display:"flex",gap:8,alignItems:"flex-start",fontSize:14,color:"#373737"}}>
                <input type="checkbox" required style={{marginTop:4}}/> He leído y acepto la <a href="/privacidad" className="underline">Política de Privacidad</a>.
              </label>
              <div className="md:col-span-2"><button className="btn btn-primary w-full">Enviar</button></div>
            </form>
          )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="container pad py-12 grid md:grid-cols-3 gap-8">
          <div>
            <div className="h3"><span style={{color:"var(--accent)",fontWeight:900}}>QI</span> · Quattro Islands</div>
            <p className="muted mt-3">Cuatro villas con piscina privada en La Font (Alicante).</p>
          </div>
          <div>
            <div className="eyebrow">Menú</div>
            <ul className="grid gap-2 mt-2">
              {NAV.map(n=>(<li key={n.href}><a href={n.href}>{n.label}</a></li>))}
              <li><a href="/aviso-legal">Aviso legal</a></li>
              <li><a href="/privacidad">Privacidad</a></li>
              <li><a href="/cookies">Cookies</a></li>
            </ul>
          </div>
          <div>
            <div className="eyebrow">Contacto</div>
            <ul className="grid gap-1.5 mt-2">
              <li>La Font · El Campello (Alicante)</li>
              <li><a href="mailto:info@quattroislands.es">info@quattroislands.es</a></li>
              <li><a href="tel:+34000000000">+34 000 000 000</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__copy">© {new Date().getFullYear()} Quattro Islands</div>
      </footer>
    </main>
  );
}
