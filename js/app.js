// Simple app state
const state = { experiences: [], education: [], projects: [] };

// DOM refs
const $ = (id) => document.getElementById(id);

function applyChanges() {
  $("cv-name").textContent = $("input-name").value || "Nombre Apellido";
  $("cv-role").textContent = $("input-role").value || "Cargo / Título";
  const photo = $("input-photo").value.trim();
  if (photo) {
    $("cv-photo").innerHTML = "";
    const img = document.createElement("img");
    img.src = photo;
    img.style.width = "90px";
    img.style.height = "90px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "8px";
    $("cv-photo").appendChild(img);
  } else {
    $("cv-photo").textContent = "Foto";
  }

  $("cv-contact").textContent =
    $("input-contact").value || "contacto • email • ciudad";
  $("cv-summary-text").textContent =
    $("input-summary").value || "Breve resumen profesional.";

  // skills
  const skills = $("input-skills")
    .value.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const skillsWrap = $("cv-skills");
  skillsWrap.innerHTML = "";
  skills.forEach((s) => {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = s;
    skillsWrap.appendChild(span);
  });

  // langs
  const langs = $("input-langs")
    .value.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  $("cv-langs").innerHTML = langs
    .map((l) => `<div class="item">${l}</div>`)
    .join("");

  renderLists();
}

function renderLists() {
  // experiences
  const expList = $("cv-experience-list");
  expList.innerHTML = "";
  state.experiences.forEach((e, i) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<strong>${e.title}</strong> — <span class="muted">${e.company} • ${e.period}</span><div>${e.desc}</div>`;
    expList.appendChild(div);
  });

  // education
  const eduList = $("cv-education-list");
  eduList.innerHTML = "";
  state.education.forEach((e) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<strong>${e.degree}</strong><div class="muted">${e.school} • ${e.period}</div>`;
    eduList.appendChild(div);
  });

  // projects
  const projList = $("cv-projects-list");
  projList.innerHTML = "";
  state.projects.forEach((p) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<strong>${p.name}</strong><div class="muted">${
      p.link || ""
    }</div><div>${p.desc}</div>`;
    projList.appendChild(div);
  });

  // lists area
  const lists = $("lists");
  lists.innerHTML = "";
  if (state.experiences.length) {
    const h = document.createElement("div");
    h.innerHTML = "<strong>Experiencias:</strong>";
    lists.appendChild(h);
    state.experiences.forEach((e, i) => {
      const el = document.createElement("div");
      el.className = "muted";
      el.textContent = `${e.title} — ${e.company} (${e.period})`;
      lists.appendChild(el);
    });
  }
  if (state.education.length) {
    const h = document.createElement("div");
    h.innerHTML = "<strong>Educación:</strong>";
    lists.appendChild(h);
    state.education.forEach((e) => {
      const el = document.createElement("div");
      el.className = "muted";
      el.textContent = `${e.degree} — ${e.school} (${e.period})`;
      lists.appendChild(el);
    });
  }
  if (state.projects.length) {
    const h = document.createElement("div");
    h.innerHTML = "<strong>Proyectos:</strong>";
    lists.appendChild(h);
    state.projects.forEach((p) => {
      const el = document.createElement("div");
      el.className = "muted";
      el.textContent = `${p.name} — ${p.link || ""}`;
      lists.appendChild(el);
    });
  }
}

// Add experience modal (simple prompt-based add)
function addExperience() {
  const title = prompt("Título / Puesto (Ej. Ingeniero de Software)");
  if (!title) return;
  const company = prompt("Empresa / Organización") || "";
  const period = prompt("Periodo (Ej. 2021 — Presente)") || "";
  const desc = prompt("Descripción breve (responsabilidades y logros)") || "";
  state.experiences.push({ title, company, period, desc });
  applyChanges();
}

function addEducation() {
  const degree = prompt("Título / Grado (Ej. Ingeniería de Sistemas)");
  if (!degree) return;
  const school = prompt("Institución") || "";
  const period = prompt("Periodo (Ej. 2016 — 2020)") || "";
  state.education.push({ degree, school, period });
  applyChanges();
}

// PDF / print
// ============================
// Función para descargar el PDF
// ============================
function descargarPDF() {
  const element = document.querySelector(".cv");

  // Ocultar el botón durante la conversión
  const downloadBtn = document.getElementById("downloadBtn");
  if (downloadBtn) downloadBtn.style.display = "none";

  const opt = {
    margin: [0, 0, 0, 0],
    filename: "Hoja_de_Vida_Nicolas_Gutierrez.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollY: 0,
      windowWidth: document.body.scrollWidth, // para evitar recortes horizontales
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] }, // 🔥 evita cortes bruscos
  };

  html2pdf()
    .set(opt)
    .from(element)
    .save()
    .then(() => {
      // Mostrar el botón nuevamente
      if (downloadBtn) downloadBtn.style.display = "inline-block";
    })
    .catch((err) => {
      console.error("Error generando el PDF:", err);
      if (downloadBtn) downloadBtn.style.display = "inline-block";
    });
}

// ============================
// Evento de descarga
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("downloadBtn");
  if (btn) {
    btn.addEventListener("click", descargarPDF);
  }
});
