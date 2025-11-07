// spectre-sites.js
// Adds local site storage: save, select, delete, export

$(() => {
  const STORAGE_KEY = "spectre_sites";
  const siteNameInput = $("#siteName input");
  const siteNameLabel = $("#siteName");

  // === Create UI elements ===
  const wrapper = $('<div class="mt-2 d-flex flex-wrap align-items-center gap-2"></div>');
  const dropdown = $('<select id="sitePicker" class="form-select flex-grow-1" style="min-width:180px;">');
  const saveBtn = $('<button type="button" class="btn btn-sm btn-outline-secondary"><i class="fa-solid fa-bookmark"></i> Save</button>');
  const delBtn = $('<button type="button" class="btn btn-sm btn-outline-danger"><i class="fa-solid fa-trash"></i> Delete</button>');
  const exportBtn = $('<button type="button" class="btn btn-sm btn-outline-primary"><i class="fa-solid fa-file-export"></i> Export</button>');

  wrapper.append(dropdown, saveBtn, delBtn, exportBtn);
  siteNameLabel.append(wrapper);

  // === Functions ===
  function loadSites() {
    const sites = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    dropdown.empty().append('<option value="">— Select a saved site —</option>');
    for (const site of sites) {
      dropdown.append(`<option value="${site}">${site}</option>`);
    }
  }

  function saveSites(sites) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
  }

  // === Load existing ===
  loadSites();

  // === Select ===
  dropdown.on("change", e => {
    const val = e.target.value;
    if (val) siteNameInput.val(val).trigger("input");
  });

  // === Save ===
  saveBtn.on("click", () => {
    const val = siteNameInput.val().trim();
    if (!val) return;
    const sites = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!sites.includes(val)) {
      sites.push(val);
      saveSites(sites);
      loadSites();
    }
    dropdown.val(val);
  });

  // === Delete ===
  delBtn.on("click", () => {
    const selected = dropdown.val();
    if (!selected) return alert("Select a site to delete.");
    const sites = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const updated = sites.filter(s => s !== selected);
    saveSites(updated);
    loadSites();
    dropdown.val("");
    siteNameInput.val("");
  });

  // === Export ===
  exportBtn.on("click", () => {
    const sites = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!sites.length) return alert("No saved sites to export.");

    const blob = new Blob([JSON.stringify(sites, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spectre_sites.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // === Auto-save on blur (optional convenience) ===
  siteNameInput.on("blur", () => {
    const val = siteNameInput.val().trim();
    if (!val) return;
    const sites = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!sites.includes(val)) {
      sites.push(val);
      saveSites(sites);
      loadSites();
      dropdown.val(val);
    }
  });
});
