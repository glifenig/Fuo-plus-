const supabase = window.supabase.createClient(
  "https://nhopxxebahavtziafmnd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0aGlvbWhqYmFrZHFocHFkbnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODU2MDEsImV4cCI6MjA4MDg2MTYwMX0.H2cIypWgF5D6swr0WVKQ99GZE5WzBQ3C-hcHqN6x5LM"
);

const productsDiv = document.getElementById("products");
const searchInput = document.getElementById("searchInput");

let allProducts = [];

/* ---------- IMAGE HELPER ---------- */
function getImage(p) {
  if (Array.isArray(p.images) && p.images.length) return p.images[0];
  if (p.image) return p.image;
  return "https://via.placeholder.com/300";
}

/* ---------- RENDER ---------- */
function render(products) {
  productsDiv.innerHTML = "";

  if (!products.length) {
    productsDiv.innerHTML = "<p>No products yet</p>";
    return;
  }

  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${getImage(p)}">
      <h4>${p.title}</h4>
      <p>${p.short_desc || ""}</p>
      <div class="type">${p.type.toUpperCase()}</div>
    `;
    productsDiv.appendChild(card);
  });
}

/* ---------- LOAD HOME ---------- */
async function loadHome() {
  try {
    const pRes = await supabase.from("properties").select("*");
    const fRes = await supabase.from("food").select("*");
    const iRes = await supabase.from("items").select("*");

    const properties = pRes.data || [];
    const food = fRes.data || [];
    const items = iRes.data || [];

    allProducts = [
      ...properties.map(p => ({ ...p, type: "property" })),
      ...food.map(f => ({ ...f, type: "food" })),
      ...items.map(i => ({ ...i, type: "item" }))
    ]
      .sort((a, b) =>
        new Date(b.created_at || 0) - new Date(a.created_at || 0)
      )
      .slice(0, 5);

    render(allProducts);
  } catch (err) {
    console.error(err);
    productsDiv.innerHTML = "<p>Failed to load products</p>";
  }
}

/* ---------- SEARCH ---------- */
searchInput.addEventListener("input", e => {
  const q = e.target.value.toLowerCase();

  const filtered = allProducts.filter(p =>
    p.title?.toLowerCase().includes(q) ||
    p.short_desc?.toLowerCase().includes(q)
  );

  render(filtered);
});

loadHome();
