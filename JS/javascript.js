// ==========================================================================
// 1. EFECTO SCROLL EN EL HEADER (CAMBIA DE ESTILO AL BAJAR)
// ==========================================================================
const header = document.getElementById('main-header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ==========================================================================
// 2. EFECTO PARALLAX 3D EN LA IMAGEN DEL PASTEL (HERO)
// ==========================================================================
const cake = document.querySelector(".cake");
if (cake) {
    document.addEventListener("mousemove", (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 45;
        const y = (window.innerHeight / 2 - e.pageY) / 45;
        cake.style.transform = `rotateY(${x}deg) rotateX(${-y}deg) translateY(-10px)`;
    });
}

// ==========================================================================
// 3. ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER)
// ==========================================================================
// Animación específica de la cuadrícula de pasteles (Aparecen uno por uno)
const cards = document.querySelectorAll(".cake-card");
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: 0.15 });

cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(40px)";
    card.style.transition = `all 0.7s ease ${index * 0.08}s`;
    observer.observe(card);
});

// Animación general de tarjetas secundarias (Procesos, Detalles, Valores, etc.)
const animatedElements = document.querySelectorAll(".process-card, .detail-card, .value-card, .testimonial-card");
const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            entry.target.classList.add("show-element");
        }
    });
}, { threshold: 0.15 });

animatedElements.forEach((el) => {
    el.classList.add("hidden-element");
    reveal.observe(el);
});

// ==========================================================================
// 4. LOGICA DEL BOTÓN "VOLVER ARRIBA"
// ==========================================================================
const backToTopBtn = document.getElementById("btn-back-to-top");

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        backToTopBtn.classList.add("show-btn");
    } else {
        backToTopBtn.classList.remove("show-btn");
    }
});

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// ==========================================================================
// 5. INICIALIZACIÓN DE CLIENTE SUPABASE
// ==========================================================================
// CORRECCIÓN: URL base corregida sin el '/rest/v1/'
const SUPABASE_URL = "https://fnzqwcoktqfibyuckgis.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_rOkK8jQgfjqM4GHpwuhYAQ_mMDWdeRz"; 
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY); 

// ==========================================================================
// 6. CONTROL DEL FORMULARIO INTEGRADO (SUPABASE + MENSAJE DETALLADO WHATSAPP)
// ==========================================================================
// CORRECCIÓN: Única declaración de formulario admitida
const form = 
    document.getElementById("cakeForm");

// CORRECCIÓN: Unificado en un único evento Submit con guardado + redirección externa
form.addEventListener("submit", async function(e){

  e.preventDefault();

  /* CAPTURAR DATOS */
  const nombre_completo = document.getElementById("nombre_completo").value;
  const telefono = document.getElementById("telefono").value;
  const direccion_entrega = document.getElementById("direccion_entrega").value;
  const tipo_evento = document.getElementById("tipo_evento").value;
  const tematica_pastel = document.getElementById("tematica_pastel").value;
  const sabor = document.getElementById("sabor").value;
  const peso = document.getElementById("peso").value;
  const fecha_evento = document.getElementById("fecha_evento").value;
  const descripcion = document.getElementById("descripcion").value;

  /* INSERTAR EN SUPABASE */
  const { error } = await client
    .from("pedidos")
    .insert([
      {
        nombre_completo,
        telefono,
        direccion_entrega,
        tipo_evento,
        tematica_pastel,
        sabor,
        peso,
        fecha_evento,
        descripcion
      }
    ]);

  if(error){
    console.error(error);
    alert("Error al guardar pedido");
    return;
  }

  /* CONSTRUIR MENSAJE DETALLADO PARA WHATSAPP */
  const mensaje = `Hola Dulce Detalle ✨

Mi nombre es ${nombre_completo}

Quiero información para un pastel personalizado 🎂

📞 Teléfono: ${telefono}
🎉 Evento: ${tipo_evento}
🎂 Sabor: ${sabor}
⚖️ Peso: ${peso}

📝 Descripción:
${descripcion}`;

  const phone = "50586442219";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(mensaje)}`;

  // Redirección y limpieza
  window.open(url, "_blank");
  form.reset();

});

// ==========================================================================
// 7. CRUD - LEER PEDIDOS
// ==========================================================================
async function obtenerPedidos() {
    const { data, error } = await client
        .from("pedidos")
        .select("*");

    if (error) {
        console.error("Error al obtener los pedidos:", error);
        return;
    }

    console.log("Lista de pedidos recibida:", data);
    return data;
}

// ==========================================================================
// 8. CRUD - ACTUALIZAR PEDIDO
// ==========================================================================
async function actualizarSaborPedido(idPedido, nuevoSabor) {
    const { data, error } = await client
        .from("pedidos")
        .update({ sabor: nuevoSabor })
        .eq("id", idPedido);

    if (error) {
        alert("No se pudo actualizar el pedido");
        console.error(error);
        return;
    }

    alert("¡Pedido actualizado con éxito! 🎂");
    obtenerPedidos();
}

// ==========================================================================
// 9. CRUD - BORRAR PEDIDO
// ==========================================================================
async function eliminarPedido(idPedido) {
    if (!confirm("¿Seguro que deseas eliminar este pedido?")) return;

    const { error } = await client
        .from("pedidos")
        .delete()
        .eq("id", idPedido);

    if (error) {
        alert("Error al eliminar el pedido");
        console.error(error);
        return;
    }

    alert("Pedido eliminado correctamente.");
    obtenerPedidos();
}
