const supabase = window.supabase.createClient(
  "https://ithiomhjbakdqhpqdnus.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0aGlvbWhqYmFrZHFocHFkbnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODU2MDEsImV4cCI6MjA4MDg2MTYwMX0.H2cIypWgF5D6swr0WVKQ99GZE5WzBQ3C-hcHqN6x5LM"
);

const foodDiv = document.getElementById("food");
const propDiv = document.getElementById("properties");
const itemsDiv = document.getElementById("items");
const searchInput = document.getElementById("searchInput");

let allProducts = [];

/* ---------- HELPERS ---------- */
function card(title, desc, img) {
  return `
    <div class="card">
      <img src="${img || 'https://via.placeholder.com/300'}">
      <h4>${title}</h4>
      <p>${desc || ''}</p>
    </div>
  `;
}

/* ---------- LOAD DATA ---------- */
async function loadHome() {
  const foodRes = await supabase
    .from("food")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const propRes = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const itemsRes = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const food = foodRes.data || [];
  const properties = propRes.data || [];
  const items = itemsRes.data || [];

  // Store for global search
  allProducts = [
    ...food.map(f => ({ ...f, type: "food" })),
    ...properties.map(p => ({ ...p, type: "property" })),
    ...items.map(i => ({ ...i, type: "item" }))
  ];

  /* ---------- RENDER ---------- */
  foodDiv.innerHTML = food.length
    ? food.map(f => card(f.title, f.short_desc, f.image)).join("")
    : "<p>No food yet</p>";

  propDiv.innerHTML = properties.length
    ? properties.map(p =>
        card(p.title, p.short_desc, p.images?.[0])
      ).join("")
    : "<p>No properties yet</p>";

  itemsDiv.innerHTML = items.length
    ? items.map(i =>
        card(i.title, i.short_desc, i.images?.[0])
      ).join("")
    : "<p>No items yet</p>";
}

/* ---------- SEARCH ---------- */
searchInput.addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  if (!q) return loadHome();

  const filtered = allProducts.filter(p =>
    p.title?.toLowerCase().includes(q) ||
    p.short_desc?.toLowerCase().includes(q)
  );

  foodDiv.innerHTML = "";
  propDiv.innerHTML = "";
  itemsDiv.innerHTML = "";

  filtered.forEach(p => {
    const html = card(
      p.title,
      p.short_desc,
      p.image || p.images?.[0]
    );

    if (p.type === "food") foodDiv.innerHTML += html;
    if (p.type === "property") propDiv.innerHTML += html;
    if (p.type === "item") itemsDiv.innerHTML += html;
  });
});

loadHome();
