alert("RSVP JS LOADED")
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const rsvpForm = document.getElementById("rsvpForm");
    const rsvpSubmit = document.getElementById("rsvpSubmit");
    const rsvpStatus = document.getElementById("rsvpStatus");

    const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbx_ap25pjy9whKOxY7LoL9TasW8YpXLijy88Dztnss_dTDUaI4SVNwSivJicSAeceAcDA/exec";

    if (!rsvpForm || !rsvpSubmit || !rsvpStatus) {
        console.error(
            "RSVP setup error: rsvpForm, rsvpSubmit, or rsvpStatus was not found in index.html."
        );
        return;
    }

    rsvpForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!rsvpForm.checkValidity()) {
            rsvpForm.reportValidity();
            return;
        }

        rsvpSubmit.disabled = true;
        rsvpSubmit.textContent = "Sending...";
        rsvpStatus.textContent = "";
        rsvpStatus.className = "rsvp-status";

        try {
            const formData = new FormData(rsvpForm);

            await fetch(RSVP_ENDPOINT, {
                method: "POST",
                mode: "no-cors",
                body: formData
            });

            const guestName = String(formData.get("name") || "Guest").trim();

            rsvpForm.reset();
            rsvpStatus.textContent = `Thank you, ${guestName}. Your RSVP has been sent.`;
            rsvpStatus.classList.add("success");
        } catch (error) {
            console.error("RSVP submission failed:", error);
            rsvpStatus.textContent =
                "We could not send your RSVP. Please check your connection and try again.";
            rsvpStatus.classList.add("error");
        } finally {
            rsvpSubmit.disabled = false;
            rsvpSubmit.textContent = "Send RSVP";
        }
    });
});
