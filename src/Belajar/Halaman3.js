document.addEventListener("DOMContentLoaded", function() {
    const btnBelajarKembali = document.getElementById("btn-KembaliBelajar");
    const btnKembali = document.getElementById("btn-kembali");
    const chalkText = document.getElementById("chalk-text");
    const kapur = document.getElementById("kapur");

    // Navigasi tombol
    btnKembali.addEventListener("click", function() {
        window.location.href = "../TampilanUtama/TampilanUtama.html"; 
    });

    btnBelajarKembali.addEventListener("click", function() {
        window.location.href = "Halaman2.html"; 
    });



    // Efek menulis kapur
    const text = "Sampah bangunan adalah limbah yang berasal dari pekerjaan konstruksi,\n renovasi, atau pembongkaran.\n Jumlahnya biasanya sangat banyak dan \n sering kali tidak bisa langsung dibuang ke tempat sampah biasa \n  karena bisa mencemari lingkungan atau menyumbat aliran air. \n Contoh Sampah Bangunan : \n - Batu bata pecah. \n - Kayu bekas dari bekisting atau rangka. \n - Paku, besi beton, kawat. \n - Gypsum, keramik, ubin pecah. \n - Kaleng cat, thinner, lem (termasuk B3 karena bahan kimia).";
    let index = 0;
    let writingTimeout;

    // === Tambah tombol Skip ===
    const btnSkip = document.createElement("button");
    btnSkip.id = "btn-skip";
    btnSkip.textContent = "⏩ Skip";

    // Styling tombol skip (posisi kiri bawah)
    btnSkip.style.position = "fixed";
    btnSkip.style.bottom = "20px";
    btnSkip.style.left = "20px";
    btnSkip.style.zIndex = "999";
    btnSkip.style.padding = "10px 18px";
    btnSkip.style.cursor = "pointer";
    btnSkip.style.border = "none";
    btnSkip.style.borderRadius = "10px";
    btnSkip.style.background = "linear-gradient(135deg, #ff6a00, #ffcc00)";
    btnSkip.style.color = "white";
    btnSkip.style.fontWeight = "bold";
    btnSkip.style.fontSize = "25px";
    btnSkip.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
    btnSkip.style.transition = "all 0.3s ease";

    // Hover efek
    btnSkip.addEventListener("mouseover", function() {
        btnSkip.style.transform = "scale(1.1)";
        btnSkip.style.boxShadow = "0 6px 12px rgba(0,0,0,0.35)";
    });
    btnSkip.addEventListener("mouseout", function() {
        btnSkip.style.transform = "scale(1)";
        btnSkip.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
    });

    // Masukkan tombol skip ke body (karena fixed)
    document.body.appendChild(btnSkip);

    function writeChalk() {
        if (index < text.length) {
            chalkText.textContent += text[index];
            kapur.style.display = "block";

            try {
                const range = document.createRange();
                range.setStart(chalkText.firstChild, index);
                range.setEnd(chalkText.firstChild, index + 1);
                const rects = range.getBoundingClientRect();
                kapur.style.top = rects.top + window.scrollY - 20 + "px";
                kapur.style.left = rects.right + window.scrollX + "px";
            } catch (e) {
                kapur.style.top = chalkText.offsetTop + "px";
                kapur.style.left = chalkText.offsetLeft + "px";
            }

            index++;
            writingTimeout = setTimeout(writeChalk, 80);
        } else {
            kapur.style.display = "none";
            btnSkip.style.display = "none"; // sembunyikan tombol skip setelah selesai
        }
    }

    // Fungsi skip
    btnSkip.addEventListener("click", function() {
        clearTimeout(writingTimeout);
        chalkText.textContent = text; // tampilkan semua teks sekaligus
        kapur.style.display = "none";
        index = text.length;
        btnSkip.style.display = "none"; // sembunyikan tombol skip setelah dipakai
    });

    writeChalk();
});
