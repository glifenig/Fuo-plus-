const supabaseUrl = "https://nhopxxebahavtziafmnd.supabase.co";
const supabaseKey = "YOUR_ANON_KEY";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");

let allProducts = [];

/* =============================
   LOAD LATEST PRODUCTS
============================= */
async function loadLatestProducts() {
  const [properties, food, items] = await Promise.all([
    supabase.from("properties").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("food").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("items").select("*").order("created_at", { ascending: false }).limit(5)
  ]);

  allProducts = [
    ...properties.data.map(p => ({ ...p, type: "property" })),
    ...food.data.map(f => ({ ...f, type: "food" })),
    ...items.data.map(i => ({ ...i, type: "item" }))
  ];

  allProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  renderProducts(allProducts.slice(0, 5));
}

/* =============================
   RENDER PRODUCTS
============================= */
function renderProducts(products) {
  grid.innerHTML = "";

  if (!products.length) {
    grid.innerHTML = "<p>No products found</p>";
    return;
  }

  products.forEach(p => {
    const image =
      Array.isArray(p.images) ? p.images[0] : p.image;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${image}">
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
    p.title.toLowerCase().includes(q) ||
    p.short_description?.toLowerCase().includes(q)
  );

  renderProducts(filtered);
});

/* INIT */
loadLatestProducts();
