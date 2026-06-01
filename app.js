import { createClient } from "https://esm.sh/@supabase/supabase-js@2";


const SUPABASE_URL = "https://nufkabcwgaqlxnkpyyoq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_bSyMGv9IOiq-HSJhf84HUw_fIe1qs5i";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("signupForm");
const emailInput = document.getElementById("email");
const submitBtn = document.getElementById("submitBtn");
const messageEl = document.getElementById("message");

function setMessage(text, type = "") {
  messageEl.textContent = text;
  messageEl.className = `message ${type}`.trim();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim().toLowerCase();

  setMessage("");
  if (!isValidEmail(email)) {
    setMessage("Please enter a valid email address.", "err");
    emailInput.focus();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Saving...";

  try {
    const { error } = await supabase
      .from("subscribers")
      .insert([{ email }]);

    if (error) {
      const msg =
        error.code === "23505"
          ? "That email is already subscribed."
          : `Couldn’t subscribe: ${error.message}`;
      setMessage(msg, "err");
      return;
    }

    setMessage("Subscribed! 🎉", "ok");
    form.reset();
  } catch (err) {
    setMessage("Something went wrong. Please try again.", "err");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Subscribe";
  }
});
