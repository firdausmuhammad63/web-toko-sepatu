// Tunggu semua DOM siap
document.addEventListener("DOMContentLoaded", () => {
  // ========== NAVBAR SCROLL SHADOW ==========
  const navbar = document.querySelector("nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("shadow-xl");
    } else {
      navbar.classList.remove("shadow-xl");
    }
  });

  // ========== FILTER PRODUK ==========
  const filterButtons = document.querySelectorAll("section button");
  const products = document.querySelectorAll("section .bg-white.rounded-lg");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.textContent.trim().toLowerCase();

      products.forEach((product) => {
        const name = product.querySelector("h3").textContent.toLowerCase();

        if (
          category === "semua produk" ||
          (category === "boots" && name.includes("boot")) ||
          (category === "formal" && name.includes("formal")) ||
          (category === "sandal" && name.includes("sandal"))
        ) {
          product.classList.remove("hidden");
        } else {
          product.classList.add("hidden");
        }
      });
    });
  });

  // ========== TOMBOL BELI ==========
  const buyButtons = document.querySelectorAll("button.bg-red-600");
  buyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productName = btn.closest("div").querySelector("h3").textContent;
      alert(`✅ ${productName} berhasil dimasukkan ke keranjang!`);
    });
  });

  // ========== BACK TO TOP ==========
  const backToTop = document.createElement("button");
  backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
  backToTop.className =
    "fixed bottom-6 right-6 w-12 h-12 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 opacity-0 invisible";
  document.body.appendChild(backToTop);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      backToTop.classList.remove("opacity-0", "invisible");
      backToTop.classList.add("opacity-100", "visible");
    } else {
      backToTop.classList.add("opacity-0", "invisible");
      backToTop.classList.remove("opacity-100", "visible");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// Script untuk fitur keranjang belanja sederhana
document.addEventListener("DOMContentLoaded", () => {
  let cart = []; // array untuk menyimpan produk
  const buttons = document.querySelectorAll(".btn-buy");

  // Tambah event listener di semua tombol beli
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productCard = btn.closest("div.bg-white");
      const name = productCard.querySelector("h3").innerText;
      const price = productCard.querySelector("span").innerText;

      // Simpan ke cart
      cart.push({ name, price });

      // Tampilkan notifikasi
      showToast(`✅ ${name} berhasil ditambahkan ke keranjang!`);
      console.log(cart); // untuk debug
    });
  });

  // Fungsi notifikasi sederhana (toast)
  function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className =
      "fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn";
    document.body.appendChild(toast);

    // hilangkan otomatis
    setTimeout(() => {
      toast.remove();
    }, 2500);
  }
});