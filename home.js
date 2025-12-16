const supabase = window.supabase.createClient(
  "https://ithiomhjbakdqhpqdnus.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0aGlvbWhqYmFrZHFocHFkbnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODU2MDEsImV4cCI6MjA4MDg2MTYwMX0.H2cIypWgF5D6swr0WVKQ99GZE5WzBQ3C-hcHqN6x5LM"
);

const foodDiv = document.getElementById("food");
const propDiv = document.getElementById("properties");
const itemsDiv = document.getElementById("items");
const searchInput = document.getElementById("searchInput");

let allProducts = [];

/* ---------- CARD ---------- */
function card(product, type) {
  const img =
    product.image ||
    product.images?.[0] ||
    "https://via.placeholder.com/300";

  return `
    <a href="product.html?type=${type}&id=${product.id}" style="text-decoration:none;color:inherit">
      <div class="card" style="cursor:pointer">
        <img src="${img}">
        <h4>${product.title}</h4>
        <p>${product.short_desc || ""}</p>
      </div>
    </a>
  `;
}

/* ---------- LOAD HOME ---------- */
async function loadHome() {
  const [foodRes, propRes, itemsRes] = await Promise.all([
    supabase.from("food").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("properties").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("items").select("*").order("created_at", { ascending: false }).limit(5)
  ]);

  const food = foodRes.data || [];
  const properties = propRes.data || [];
  const items = itemsRes.data || [];

  allProducts = [
    ...food.map(f => ({ ...f, type: "food" })),
    ...properties.map(p => ({ ...p, type: "property" })),
    ...items.map(i => ({ ...i, type: "item" }))
  ];

  foodDiv.innerHTML = food.length
    ? food.map(f => card(f, "food")).join("")
    : "<p>No food yet</p>";

  propDiv.innerHTML = properties.length
    ? properties.map(p => card(p, "property")).join("")
    : "<p>No properties yet</p>";

  itemsDiv.innerHTML = items.length
    ? items.map(i => card(i, "item")).join("")
    : "<p>No items yet</p>";
}

/* ---------- SEARCH ---------- */
searchInput.addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  if (!q) return loadHome();

  foodDiv.innerHTML = "";
  propDiv.innerHTML = "";
  itemsDiv.innerHTML = "";

  allProducts
    .filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.short_desc?.toLowerCase().includes(q)
    )
    .forEach(p => {
      const html = card(p, p.type);
      if (p.type === "food") foodDiv.innerHTML += html;
      if (p.type === "property") propDiv.innerHTML += html;
      if (p.type === "item") itemsDiv.innerHTML += html;
    });
});

loadHome();
