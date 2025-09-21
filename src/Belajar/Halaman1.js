document.addEventListener("DOMContentLoaded", function() {
    const btnKembali = document.getElementById("btn-kembali");
    const btnSelanjutnya = document.getElementById("btn-SelanjutnyaBelajar");
    const chalkText = document.getElementById("chalk-text");
    const kapur = document.getElementById("kapur");

    // Navigasi tombol
    btnKembali.addEventListener("click", function() {
        window.location.href = "../TampilanUtama/TampilanUtama.html"; 
    });

    btnSelanjutnya.addEventListener("click", function() {
        window.location.href = "Halaman2.html"; 
    });

    // Efek menulis kapur
    const text = "Sampah elektronik adalah perangkat listrik atau elektronik yang sudah rusak, \n tidak dipakai, atau dibuang, termasuk komponen kecilnya. \n Sampah jenis ini berbahaya karena mengandung logam berat \n (seperti merkuri, timbal, kadmium) yang bisa meracuni tanah dan air. \n Contoh Sampah Elektronik \n - Monitor / layar pecah \n - Baterai & aki bekas \n - Kabel putus, charger rusak \n - CD/DVD lama \n -Komponen kecil: chip, motherboard, resistor, kapasitor";
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
