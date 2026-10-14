"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const music = document.getElementById("bgMusic");
    const startBtn = document.getElementById("startBtn");
    const musicToggle = document.getElementById("musicToggle");
    const eventsSection = document.getElementById("events");
    const siteNav = document.getElementById("siteNav");
    const gallerySlider = document.querySelector(".gallery-slider");
    const galleryImages = gallerySlider
        ? Array.from(gallerySlider.querySelectorAll("img"))
        : [];
    const galleryDots = Array.from(
        document.querySelectorAll(".gallery-dots button")
    );
    const galleryHint = document.querySelector(".gallery-hint");

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
        if (!music) {
            console.error('Audio element with id "bgMusic" was not found.');
            return false;
        }

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

    startBtn?.addEventListener("click", async () => {
        await playMusic();
        startBtn.textContent = "Welcome ❤️";
        startBtn.disabled = true;
        siteNav?.classList.add("visible");

        window.setTimeout(() => {
            eventsSection?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 250);
    });

    musicToggle?.addEventListener("click", async () => {
        if (!music) return;

        if (music.paused) {
            await playMusic();
        } else {
            music.pause();
        }
    });

    music?.addEventListener("play", () => updateMusicButton(true));
    music?.addEventListener("pause", () => updateMusicButton(false));
    music?.addEventListener("ended", () => updateMusicButton(false));
    music?.addEventListener("error", () => {
        updateMusicButton(false);
        console.error(
            "The audio file could not be loaded. Confirm music/wedding-song.mp3 exists."
        );
    });

    updateMusicButton(Boolean(music && !music.paused));

    function setActiveGalleryDot(activeIndex) {
        galleryDots.forEach((dot, index) => {
            const isActive = index === activeIndex;
            dot.classList.toggle("active", isActive);

            if (isActive) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });
    }

    let galleryHintHidden = false;

    function hideGalleryHint() {
        if (galleryHintHidden || !galleryHint) return;
        galleryHintHidden = true;
        galleryHint.classList.add("hidden");
    }

    if (gallerySlider && galleryImages.length > 0) {
        setActiveGalleryDot(0);

        gallerySlider.addEventListener("pointerdown", hideGalleryHint, {
            once: true
        });
        gallerySlider.addEventListener("scroll", hideGalleryHint, {
            once: true,
            passive: true
        });

        if ("IntersectionObserver" in window) {
            const galleryObserver = new IntersectionObserver(
                (entries) => {
                    const visibleEntry = entries
                        .filter((entry) => entry.isIntersecting)
                        .sort(
                            (first, second) =>
                                second.intersectionRatio -
                                first.intersectionRatio
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
                    threshold: [0.55, 0.75]
                }
            );

            galleryImages.forEach((image) => {
                galleryObserver.observe(image);
            });
        }

        galleryDots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                const image = galleryImages[index];
                if (!image) return;

                hideGalleryHint();
                setActiveGalleryDot(index);
                image.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center"
                });
            });
        });
    }

    const revealElements = Array.from(
        document.querySelectorAll(".reveal")
    );

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("revealed");
                    revealObserver.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("revealed");
        });
    }
});
