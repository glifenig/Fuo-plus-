const supabaseUrl = "https://nhopxxebahavtziafmnd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0aGlvbWhqYmFrZHFocHFkbnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODU2MDEsImV4cCI6MjA4MDg2MTYwMX0.H2cIypWgF5D6swr0WVKQ99GZE5WzBQ3C-hcHqN6x5LM";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");

let allProducts = [];

/* =============================
   LOAD LATEST PRODUCTS
============================= */
async function loadLatestProducts() {
  try {
    const [{ data: properties }, { data: food }, { data: items }] =
      await Promise.all([
        supabase.from("properties").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("food").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("items").select("*").order("created_at", { ascending: false }).limit(5)
      ]);

    // ✅ SAFETY: default to empty arrays
    const safeProperties = properties || [];
    const safeFood = food || [];
    const safeItems = items || [];

    allProducts = [
      ...safeProperties.map(p => ({ ...p, type: "property" })),
      ...safeFood.map(f => ({ ...f, type: "food" })),
      ...safeItems.map(i => ({ ...i, type: "item" }))
    ];

    allProducts.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    renderProducts(allProducts.slice(0, 5));

  } catch (err) {
    console.error("Failed to load products:", err);
    grid.innerHTML = "<p>Failed to load products</p>";
  }
}

/* =============================
   RENDER PRODUCTS
============================= */
function renderProducts(products) {
  grid.innerHTML = "";

  if (!products.length) {
    grid.innerHTML = "<p>No products yet</p>";
    return;
  }

  products.forEach(p => {
    const image = Array.isArray(p.images)
      ? p.images[0]
      : p.image;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${image || 'https://via.placeholder.com/300'}">
      <div class="card-body">
        <h4>${p.title}</h4>
        <p>${p.type.toUpperCase()}</p>
      </div>
    `;

    card.onclick = () => {
      window.location.href = `details.html?type=${p.type}&id=${p.id}`;
    };

    grid.appendChild(card);
  });
}

/* =============================
   SEARCH
============================= */
searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase();

  const filtered = allProducts.filter(p =>
    p.title?.toLowerCase().includes(q) ||
    p.short_description?.toLowerCase().includes(q)
  );

  renderProducts(filtered);
});

/* INIT */
loadLatestProducts();
