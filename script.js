const music = document.getElementById("bgMusic");
const startBtn = document.getElementById("startBtn");
const musicToggle = document.getElementById("musicToggle");

let isPlaying = false;

startBtn.addEventListener("click", async () => {

    try {

        await music.play();

        isPlaying = true;

        musicToggle.innerHTML = "🔊";

        startBtn.innerHTML = "Welcome ❤️";

        document.querySelector(".section")
            .scrollIntoView({
                behavior: "smooth"
            });

    } catch (err) {

        console.log(err);

    }

});

musicToggle.addEventListener("click", async () => {

    try {

        if (isPlaying) {

            music.pause();
            musicToggle.innerHTML = "🔇";

        } else {

            await music.play();
            musicToggle.innerHTML = "🔊";

        }

        isPlaying = !isPlaying;

    } catch (err) {

        console.log(err);

    }

});"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const music = document.getElementById("bgMusic");
    const startBtn = document.getElementById("startBtn");
    const musicToggle = document.getElementById("musicToggle");
    const eventsSection = document.getElementById("events");
    const gallerySlider = document.querySelector(".gallery-slider");
    const galleryImages = gallerySlider
        ? Array.from(gallerySlider.querySelectorAll("img"))
        : [];
    const galleryDots = Array.from(
        document.querySelectorAll(".gallery-dots span")
    );

    function updateMusicButton(isPlaying) {
        if (!musicToggle) return;

        musicToggle.textContent = isPlaying ? "🔊" : "🔇";
        musicToggle.setAttribute(
            "aria-label",
            isPlaying ? "Pause background music" : "Play background music"
        );
        musicToggle.setAttribute("aria-pressed", String(isPlaying));
    }

    async function playMusic() {
        if (!music) return false;

        try {
            await music.play();
            updateMusicButton(true);
            return true;
        } catch (error) {
            updateMusicButton(false);
            console.error("Music could not be played:", error);
            return false;
        }
    }

    if (startBtn) {
        startBtn.addEventListener("click", async () => {
            const musicStarted = await playMusic();

            startBtn.textContent = musicStarted
                ? "Welcome ❤️"
                : "Welcome ❤️ Music unavailable";
            startBtn.disabled = true;

            if (eventsSection) {
                window.setTimeout(() => {
                    eventsSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }, 250);
            }
        });
    }

    if (musicToggle && music) {
        musicToggle.addEventListener("click", async () => {
            if (music.paused) {
                await playMusic();
            } else {
                music.pause();
                updateMusicButton(false);
            }
        });

        music.addEventListener("play", () => updateMusicButton(true));
        music.addEventListener("pause", () => updateMusicButton(false));
        music.addEventListener("ended", () => updateMusicButton(false));
        music.addEventListener("error", () => {
            updateMusicButton(false);
            console.error(
                "The audio file could not be loaded. Check music/wedding-song.mp3."
            );
        });
    }

    updateMusicButton(Boolean(music && !music.paused));

    function setActiveGalleryDot(activeIndex) {
        galleryDots.forEach((dot, index) => {
            const isActive = index === activeIndex;
            dot.classList.toggle("active", isActive);
            dot.setAttribute("aria-current", isActive ? "true" : "false");
        });
    }

    if (gallerySlider && galleryImages.length > 0) {
        setActiveGalleryDot(0);

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    const visibleEntry = entries
                        .filter((entry) => entry.isIntersecting)
                        .sort(
                            (first, second) =>
                                second.intersectionRatio - first.intersectionRatio
                        )[0];

                    if (!visibleEntry) return;

                    const activeIndex = galleryImages.indexOf(
                        visibleEntry.target
                    );

                    if (activeIndex >= 0) {
                        setActiveGalleryDot(activeIndex);
                    }
                },
                {
                    root: gallerySlider,
                    threshold: [0.5, 0.65, 0.8]
                }
            );

            galleryImages.forEach((image) => observer.observe(image));
        }

        galleryDots.forEach((dot, index) => {
            dot.setAttribute("role", "button");
            dot.setAttribute("tabindex", "0");
            dot.setAttribute("aria-label", `Show gallery photo ${index + 1}`);

            const showImage = () => {
                galleryImages[index]?.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center"
                });
            };

            dot.addEventListener("click", showImage);
            dot.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    showImage();
                }
            });
        });
    }
});
