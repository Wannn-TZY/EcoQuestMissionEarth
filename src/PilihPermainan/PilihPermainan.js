document.addEventListener("DOMContentLoaded", function () {
    // Tombol
    const btnVolume = document.getElementById("btn-volume");
    const btnKembali = document.getElementById("btn-kembali");
    const btnBersihkanSungai = document.getElementById("btn-bersihkansungai");
    const btnTangkapSampah = document.getElementById("btn-tangkapsampah");
    const btnPilahSampah = document.getElementById("btn-pilahsampah");

    // 🔊 Backsound
    let volumeAktif = true;
    const audio = new Audio("../../backsound/backsound-pilihan.mp3");
    audio.loop = true;

    const playAudio = () => {
        audio.play().catch(() => {
            document.addEventListener("click", () => {
                audio.play();
            }, { once: true });
        });
    };
    playAudio();

    btnVolume.addEventListener("click", function () {
        volumeAktif = !volumeAktif;
        if (volumeAktif) {
            audio.play();
            btnVolume.src = "../../Asset/VolumeAktif.jpg";
        } else {
            audio.pause();
            btnVolume.src = "../../Asset/VolumeNonAktif.jpg";
        }
    });

    // Tombol kembali
    btnKembali.addEventListener("click", function () {
        window.location.href = "../TampilanUtama/TampilanUtama.html";
    });

    // Navigasi game
    btnBersihkanSungai.addEventListener("click", function () {
        window.location.href = "../BersihkanSungai/cutscene.html";
    });

    btnTangkapSampah.addEventListener("click", function () {
        window.location.href = "../MenangkapSampah/cutscene.html";
    });

    btnPilahSampah.addEventListener("click", function () {
        window.location.href = "../PilahSampah/cutscene.html";
    });
});
