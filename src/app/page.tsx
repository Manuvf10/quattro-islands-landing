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
  { id: "A", parcela: 326.63, util: 123.90, construida: 143.41, img: "/quattro/quattro-12.jpeg" },
  { id: "B", parcela: 317.47, util: 123.90, construida: 143.41, img: "/quattro/quattro-07.jpeg" },
  { id: "C", parcela: 312.92, util: 121.56, construida: 141.14, img: "/quattro/quattro-11.jpeg" },
  { id: "D", parcela: 319.64, util: 121.56, construida: 141.14, img: "/quattro/quattro-09.jpeg" },
];

const GALLERY = [
  "/quattro/quattro-15.jpeg",
  "/quattro/quattro-17.jpeg",
  "/quattro/quattro-14.jpeg",
  "/quattro/quattro-13.jpeg",
  "/quattro/quattro-12.jpeg",
  "/quattro/quattro-11.jpeg",
  "/quattro/quattro-07.jpeg",
  "/quattro/quattro-09.jpeg",
  "/quattro/quattro-02.jpeg",
  "/quattro/quattro-06.jpeg",
  "/quattro/quattro-04.jpeg",
  "/quattro/quattro-16.jpeg",
  "/quattro/quattro-03.jpeg",
  "/quattro/quattro-18.jpeg",
  "/quattro/quattro-19.jpeg",
  "/quattro/quattro-20.jpeg",
  "/quattro/quattro-21.jpeg",
  "/quattro/quattro-22.jpeg",
];


const fmt = (n:number)=>n.toLocaleString("es-ES",{minimumFractionDigits:2, maximumFractionDigits:2});
function ContactFormFS() {
  const [state, setState] = useState<"idle"|"loading"|"ok"|"err">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading"); setMsg("");
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot (si está relleno => bot)
    if ((data.get("_gotcha") as string)?.trim()) {
      setState("ok"); form.reset(); return;
    }

    const endpoint = "https://formspree.io/f/movkoeqp"; 

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("No se pudo enviar");
      setState("ok"); setMsg("¡Gracias! Te contactaremos en breve."); form.reset();
    } catch {
      setState("err"); setMsg("Ha ocurrido un error. Inténtalo más tarde.");
    }
  }

  return (
    <div className="container pad max-w-4xl">
      <div className="text-center mb-8">
        <div className="eyebrow">Contacto</div>
        <h2 className="h2">Solicita información</h2>
        <p className="lead">
          También puedes escribir a{" "}
          <a href="mailto:quattroislands@gmail.com" className="underline">
            quattroislands@gmail.com
          </a>{" "}
          o llamar al{" "}
          <a href="tel:+34620407957" className="underline">
            +34 620 40 79 57
          </a>.
        </p>
      </div>

      {state === "ok" ? (
        <div className="bg-white rounded-2xl border border-[color:var(--line)] shadow p-8 text-center">
          <div className="h3">¡Mensaje enviado! 👌</div>
          <p className="lead mt-2">{msg}</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-6 bg-white rounded-2xl border border-[color:var(--line)] shadow p-6 md:p-8">
          {/* Honeypot anti-spam */}
          <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

          <div>
            <label className="label">Nombre *</label>
            <input name="name" required className="input" />
          </div>
          <div>
            <label className="label">Teléfono</label>
            <input name="phone" className="input" inputMode="tel" />
          </div>
          <div className="md:col-span-2">
            <label className="label">Email *</label>
            <input type="email" name="email" required className="input" />
          </div>
          <div>
            <label className="label">Interés</label>
            <select name="interest" className="input">
              <option value="">Información general</option>
              <option>Visita personalizada</option>
              <option>Financiación</option>
              <option>Planos y memoria</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label">Mensaje *</label>
            <textarea name="message" rows={5} required className="input" />
          </div>

          <label className="md:col-span-2" style={{ display:"flex", gap:8, alignItems:"flex-start", fontSize:14, color:"#373737" }}>
            <input type="checkbox" required style={{ marginTop:4 }} /> He leído y acepto la{" "}
            <a href="/privacidad" className="underline">Política de Privacidad</a>.
          </label>

          {/* Extras para que el email te llegue con buen asunto y reply */}
          <input type="hidden" name="_subject" value="Nueva solicitud · Quattro Islands" />
          <input type="hidden" name="_replyto" value="" />

          <div className="md:col-span-2">
            <button className="btn btn-primary w-full" disabled={state==="loading"}>
              {state === "loading" ? "Enviando..." : "Enviar"}
            </button>
            {state === "err" && <p className="muted mt-2 text-center">⚠️ {msg}</p>}
          </div>
        </form>
      )}
    </div>
  );
}




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
          src="/quattro/quattro-13.jpeg"
          alt="Piscina y jardín — Quattro Islands"
          fill priority sizes="100vw"
          style={{objectFit:"cover", objectPosition:"center 78%"}}
        />
        <div className="hero__fade"/>
        <div className="hero__center">
          <div className="h1">Quattro Islands</div>
          <p className="h2">tu villa en el Mediterráneo</p>
        </div>
      </section>

            {/* ===== QUIÉNES SOMOS (limpio, 1 imagen) ===== */}
<section id="quienes" className="section bg-ivory">
  <div className="container pad grid lg:grid-cols-2 gap-12 items-center">
    {/* Texto */}
    <div>
      <div className="eyebrow">Quiénes somos</div>
      <h2 className="h2">Quattro Islands</h2>
      <div className="sep" />
      <div className="lead" style={{marginTop:12}}>
        Descubre Quattro Islands, un exclusivo conjunto de cuatro villas concebidas como islas privadas, donde la privacidad y la calma mediterránea se combinan con un diseño contemporáneo y elegante. Cada villa ha sido cuidadosamente diseñada para ofrecer espacios amplios, luminosos y conectados con el entorno, creando un equilibrio perfecto entre naturaleza, arquitectura y confort.
      </div>
      <p style={{marginTop:14}}>
        Ubicadas en calle La Sequía 24, Sant Joan d’Alacant, en la zona de La Font (El Campello), a tan solo 10 minutos de la playa de Muchavista y 15 minutos del centro de Alicante, estas villas ofrecen un entorno privilegiado con tranquilidad, independencia y cercanía a todos los servicios.
      </p>
      <p style={{marginTop:10}}>
        Vive el Mediterráneo más exclusivo en Quattro Islands, donde cada detalle está pensado para disfrutar de una experiencia residencial única.
      </p>
    </div>
    
    {/* Imagen única */}
    <div className="about-image">
      <div className="about-frame">
        <img
          src="/quattro/quattro-17.jpeg"    // cambia por la que prefieras
          alt="Quattro Islands — arquitectura y entorno"
          className="about-img"
        />
      </div>
    </div>
  </div>
</section>  
{/* ===== DOSSIER (debajo de Quiénes somos) ===== */}
<section className="section bg-ivory" aria-labelledby="dossier-title">
  <div className="container pad">
    <div className="doc-card">

      {/* Texto + acciones */}
      <div className="doc-body">
        <div className="eyebrow">Documento</div>
        <h3 id="dossier-title" className="h3">Dossier Quattro Islands</h3>
        <p className="muted" style={{marginTop:6}}>
          Toda la información del proyecto en un único documento: ubicación, concepto,
          distribución y calidades.
        </p>
        <div className="doc-actions">
          <a
            href="/docs/quattro-islands-dossier.pdf"
            className="btn btn-primary"
            target="_blank"
            rel="noopener"
          >
            Descargar PDF
          </a>
          <a
            href="/docs/quattro-islands-dossier.pdf"
            className="btn btn-outline"
            target="_blank"
            rel="noopener"
          >
            Ver online
          </a>
        </div>
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

          {/* Highlights modernos */}
          <div className="villa-highlights" role="list" aria-label="Características destacadas">
            <span className="vh-item" role="listitem">Piscina privada</span>
            <span className="vh-sep" aria-hidden="true" />
            <span className="vh-item" role="listitem">2 plazas de aparcamiento</span>
            <span className="vh-sep" aria-hidden="true" />
            <span className="vh-item" role="listitem">Zonas comunes</span>
          </div>
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
                    <tr><th>Exterior</th><td>Terraza, jardín y piscina privada 3×5 m; toldo incluido u opción pérgola de madera.</td></tr>
                    <tr><th>Fachada</th><td>Monocapa blanco; parte inferior en piedra y superior tono “café con leche”.</td></tr>
                    <tr><th>Dormitorio</th><td>3 dormitorios, una con baño en suite.</td></tr>
                    <tr><th>Parking</th><td>Dos plazas de garaje</td></tr>
                  </tbody>
                </table>
                <p className="muted" style={{fontSize:12}}>* Las viviendas están adaptadas para tus necesidades de hoy y mañana, tendrás las posibilidades de elegir diferentes personalizaciones de vivienda.</p>
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
      <h2 className="h2">La Font — Carrer la Séquia 24</h2>
      <p className="lead">Entorno exclusivo y tranquilo; a 10’ de Muchavista y 15’ del centro de Alicante.</p>
      <div className="chips" style={{marginTop:10}}>
        {["Colegios", "Centros comerciales", "Restaurantes", "Ocio y deporte", "Conexión autovía"].map(t=>(
          <span key={t} className="chip">✓ {t}</span>
        ))}
      </div>
      <p className="muted" style={{marginTop:10}}>
        Dirección exacta: <strong>Carrer la Séquia 24, Sant Joan d’Alacant</strong>.
      </p>
    </div>

    <div className="bg-white overflow-hidden rounded-2xl border border-[color:var(--line)] shadow">
      <iframe
        title="Mapa — Carrer la Séquia 24"
        className="w-full h-[340px]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps?q=Carrer%20la%20S%C3%A9quia%2024,%20Sant%20Joan%20d%E2%80%99Alacant&output=embed"
      />
    </div>
  </div>
</section>

      {/* ===== CONTACTO ===== */}
      <section id="contacto" className="section bg-ivory">
        <ContactFormFS />
        </section>

                               {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="container pad footer__top">
          <div className="footer__grid">
            {/* IZQUIERDA: MENÚ */}
          <div className="footer__col footer__col--left">
            <div className="title">Menú</div>
            <ul className="footer__list">
              {NAV.map(n => (
                <li key={n.href}><a href={n.href}>{n.label}</a></li>
              ))}
             
            </ul>
          </div>

            {/* CENTRO: TARJETA CON LOGOS */}
            <div className="footer__center">
              <div className="badge-olive">
                <div className="badge-logos">
                  <img src="/logos/vela.png" alt="Vela Inmobiliaria" />
                  <span className="sep" aria-hidden="true" />
                  <img src="/logos/zimco.png" alt="ZIMCO Proyectos y Diseños" />
                </div>
                <div className="badge-caption">Promueven &amp; construyen</div>
                <p className="badge-desc">
                  Viviendas de obra nueva con un cuidado diseño y calidades,
                  construidas con atención al detalle y soluciones “llave en mano”.
                </p>
              </div>
            </div>

            {/* DERECHA: CONTACTO */}
            <div className="footer__col footer__contact">
              <div className="title">Contacto</div>
              <ul className="footer__list">
                <li>La Font · Sant Joan (Alicante)</li>
                <li><a href="mailto:quattroislands@gmail.com">quattroislands@gmail.com</a></li>
                <li><a href="tel:+34620407957">+34 620 40 79 57</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__copy">
          <div className="container pad footer__copy__row">
            <span>© {new Date().getFullYear()} Quattro Islands</span>
            <span className="muted">Imágenes orientativas · Superficies aproximadas · CEE en trámite</span>
          </div>
        </div>
      </footer>


    </main>
  );
}
