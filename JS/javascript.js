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
    // Si el usuario baja más de 400px en la página, se muestra el botón
    if (window.scrollY > 400) {
        backToTopBtn.classList.add("show-btn");
    } else {
        backToTopBtn.classList.remove("show-btn");
    }
});

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Desplazamiento suave y elegante
    });
});

// ==========================================================================
// 5. INICIALIZACIÓN DE CLIENTE SUPABASE
// ==========================================================================
const SUPABASE_URL = "https://fnzqwcoktqfibyuckgis.supabase.co/rest/v1/"; 
const SUPABASE_KEY = "sb_publishable_rOkK8jQgfjqM4GHpwuhYAQ_mMDWdeRz"; 
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY); 

// ==========================================================================
// 6. CONTROL DEL FORMULARIO INTEGRADO (SUPABASE + MENSAJE DETALLADO WHATSAPP)
// ==========================================================================
const form = document.getElementById("cakeForm");

form.addEventListener("submit", function(e){

  e.preventDefault();

  const message =
`Hola Dulce Detalle ✨

Quiero información para un pastel personalizado 🎂`;

  const phone = "50583750020";

  const url =
`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");

});

/* ================= FORMULARIO ================= */

const form =
  document.getElementById("cakeForm");

/* GUARDAR PEDIDO */

form.addEventListener("submit", async function(e){

  e.preventDefault();

  /* CAPTURAR DATOS */

  const nombre_completo =
    document.getElementById("nombre_completo").value;

  const telefono =
    document.getElementById("telefono").value;

  const direccion_entrega =
    document.getElementById("direccion_entrega").value;

  const tipo_evento =
    document.getElementById("tipo_evento").value;

  const tematica_pastel =
    document.getElementById("tematica_pastel").value;

  const sabor =
    document.getElementById("sabor").value;

  const peso =
    document.getElementById("peso").value;

  const fecha_evento =
    document.getElementById("fecha_evento").value;

  const descripcion =
    document.getElementById("descripcion").value;

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

    console.log(error);

    alert("Error al guardar pedido");

    return;
  }

  alert("Pedido guardado correctamente ✨");

  form.reset();

});

/* ================= WHATSAPP ================= */

const whatsappBtn =
  document.getElementById("whatsappBtn");

whatsappBtn.addEventListener("click", ()=>{

  const nombre =
    document.getElementById("nombre_completo").value;

  const mensaje =
`Hola Dulce Detalle ✨

Mi nombre es ${nombre}

Quiero información para un pastel personalizado 🎂`;

  const phone = "50583750020";

  const url =
`https://wa.me/${phone}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");

});

// ==========================================================================
// 7. CRUD - LEER PEDIDOS
// ==========================================================================
async function obtenerPedidos() {
    const { data, error } = await client
        .from("pedidos")
        .select("*"); // Selecciona todas las columnas

    if (error) {
        console.error("Error al obtener los pedidos:", error);
        return;
    }

    console.log("Lista de pedidos recibida:", data);
    // Aquí puedes usar un 'forEach' para pintar los pedidos en tu HTML
    return data;
}

// ==========================================================================
// 8. CRUD - ACTUALIZAR PEDIDO
// ==========================================================================
async function actualizarSaborPedido(idPedido, nuevoSabor) {
    const { data, error } = await client
        .from("pedidos")
        .update({ sabor: nuevoSabor }) // Objeto con los campos que quieres cambiar
        .eq("id", idPedido);           // .eq significa "equal" (Donde id sea igual a idPedido)

    if (error) {
        alert("No se pudo actualizar el pedido");
        console.error(error);
        return;
    }

    alert("¡Pedido actualizado con éxito! 🎂");
    obtenerPedidos(); // Refrescas la lista visual
}

// ==========================================================================
// 9. CRUD - BORRAR PEDIDO
// ==========================================================================
async function eliminarPedido(idPedido) {
    // Es buena práctica pedir confirmación antes de borrar
    if (!confirm("¿Seguro que deseas eliminar este pedido?")) return;

    const { error } = await client
        .from("pedidos")
        .delete()
        .eq("id", idPedido); // Asegúrate siempre de poner el .eq para no borrar toda la tabla

    if (error) {
        alert("Error al eliminar el pedido");
        console.error(error);
        return;
    }

    alert("Pedido eliminado correctamente.");
    obtenerPedidos(); // Refrescas la lista visual para que desaparezca
}
