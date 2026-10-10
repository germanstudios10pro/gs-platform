/* =========================================================
   GS PLATFORM — MAIN JAVASCRIPT
   Authentication and interface foundation
   ========================================================= */

"use strict";

/* ---------------------------------------------------------
   1. SUPABASE CONFIGURATION
   --------------------------------------------------------- */

const SUPABASE_URL =
  "https://xykhrjrsfrcxdmvtwsww.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_WLZRphYc4uvp7wEsH_j4tw_u4zw5wSU";

let gsSupabase = null;

if (window.supabase && window.supabase.createClient) {
  gsSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );
} else {
  console.error(
    "GS Platform: Supabase library was not loaded."
  );
}

/* ---------------------------------------------------------
   2. PAGE HELPERS
   --------------------------------------------------------- */

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

function getPageURL(filename) {
  return new URL(filename, window.location.href).href;
}

function setMessage(message, type = "error") {
  const messageBox = $("#authMessage");

  if (!messageBox) {
    console.log(message);
    return;
  }

  messageBox.textContent = message;
  messageBox.hidden = false;
  messageBox.dataset.type = type;
  messageBox.setAttribute("role", "status");
}

function clearMessage() {
  const messageBox = $("#authMessage");

  if (!messageBox) return;

  messageBox.textContent = "";
  messageBox.hidden = true;
  delete messageBox.dataset.type;
}

function setButtonLoading(button, loading, loadingText = "Please wait...") {
  if (!button) return;

  if (loading) {
    button.dataset.originalText =
      button.textContent.trim();

    button.textContent = loadingText;
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
  } else {
    button.textContent =
      button.dataset.originalText ||
      button.textContent;

    button.disabled = false;
    button.removeAttribute("aria-busy");
    delete button.dataset.originalText;
  }
}

/* ---------------------------------------------------------
   3. AUTHENTICATION MODAL
   --------------------------------------------------------- */

const authOverlay = $("#authOverlay");

function openAuth(mode = "login") {
  if (!authOverlay) return;

  authOverlay.hidden = false;
  authOverlay.classList.add("is-open");
  authOverlay.setAttribute("aria-hidden", "false");

  document.body.classList.add("modal-open");

  setAuthMode(mode);
}

function closeAuth() {
  if (!authOverlay) return;

  authOverlay.classList.remove("is-open");
  authOverlay.hidden = true;
  authOverlay.setAttribute("aria-hidden", "true");

  document.body.classList.remove("modal-open");

  clearMessage();
}

function setAuthMode(mode = "login") {
  const isSignup = mode === "signup";

  const title = $("#authTitle");
  const subtitle = $("#authSubtitle");
  const displayNameField = $("#displayNameField");
  const usernameField = $("#usernameField");
  const confirmPasswordField = $("#confirmPasswordField");
  const termsField = $("#termsField");
  const submitButton = $("#emailSubmitButton");
  const switchText = $("#authSwitchText");
  const switchButton = $("#authSwitchButton");
  const passwordHelp = $("#passwordHelp");

  if (title) {
    title.textContent = isSignup
      ? "Create your GS Platform account"
      : "Welcome back";
  }

  if (subtitle) {
    subtitle.textContent = isSignup
      ? "Create your account to get started."
      : "Sign in to continue to GS Platform.";
  }

  if (displayNameField) {
    displayNameField.hidden = !isSignup;
  }

  if (usernameField) {
    usernameField.hidden = !isSignup;
  }

  if (confirmPasswordField) {
    confirmPasswordField.hidden = !isSignup;
  }

  if (termsField) {
    termsField.hidden = !isSignup;
  }

  if (submitButton) {
    submitButton.textContent = isSignup
      ? "Create account"
      : "Sign in";
  }

  if (switchText) {
    switchText.textContent = isSignup
      ? "Already have an account?"
      : "New to GS Platform?";
  }

  if (switchButton) {
    switchButton.textContent = isSignup
      ? "Sign in"
      : "Create account";
  }

  if (passwordHelp) {
    passwordHelp.hidden = !isSignup;
  }

  const passwordInput = $("#password");

  if (passwordInput) {
    passwordInput.autocomplete = isSignup
      ? "new-password"
      : "current-password";
  }

  const confirmPassword = $("#confirmPassword");

  if (confirmPassword) {
    confirmPassword.required = isSignup;
  }

  const displayName = $("#displayName");

  if (displayName) {
    displayName.required = isSignup;
  }

  const username = $("#username");

  if (username) {
    username.required = isSignup;
  }

  const acceptTerms = $("#acceptTerms");

  if (acceptTerms) {
    acceptTerms.required = isSignup;
  }

  const form = $("#emailAuthForm");

  if (form) {
    form.dataset.mode = mode;
    form.reset();
  }

  const passwordField = $("#password");

  if (passwordField) {
    passwordField.type = "password";
  }

  const togglePassword = $("#togglePassword");

  if (togglePassword) {
    togglePassword.setAttribute(
      "aria-pressed",
      "false"
    );
  }

  clearMessage();
}

/* Open the authentication modal from buttons and links. */

$$("[data-open-auth]").forEach((element) => {
  element.addEventListener("click", (event) => {
    event.preventDefault();

    const mode =
      element.dataset.openAuth || "login";

    openAuth(mode);
  });
});

/* Close button. */

const closeAuthButton = $("#closeAuth");

if (closeAuthButton) {
  closeAuthButton.addEventListener(
    "click",
    closeAuth
  );
}

/* Close by clicking outside the modal content. */

if (authOverlay) {
  authOverlay.addEventListener("click", (event) => {
    if (event.target === authOverlay) {
      closeAuth();
    }
  });
}

/* Close the modal with Escape. */

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    authOverlay &&
    !authOverlay.hidden
  ) {
    closeAuth();
  }
});

/* Switch between signup and login. */

const authSwitchButton = $("#authSwitchButton");

if (authSwitchButton) {
  authSwitchButton.addEventListener("click", () => {
    const form = $("#emailAuthForm");

    const currentMode =
      form?.dataset.mode || "login";

    setAuthMode(
      currentMode === "login"
        ? "signup"
        : "login"
    );
  });
}

/* ---------------------------------------------------------
   4. SHOW AND HIDE PASSWORD
   --------------------------------------------------------- */

const togglePasswordButton = $("#togglePassword");

if (togglePasswordButton) {
  togglePasswordButton.addEventListener(
    "click",
    () => {
      const passwordInput = $("#password");

      if (!passwordInput) return;

      const currentlyHidden =
        passwordInput.type === "password";

      passwordInput.type = currentlyHidden
        ? "text"
        : "password";

      togglePasswordButton.setAttribute(
        "aria-pressed",
        String(currentlyHidden)
      );

      togglePasswordButton.setAttribute(
        "aria-label",
        currentlyHidden
          ? "Hide password"
          : "Show password"
      );
    }
  );
}

/* ---------------------------------------------------------
   5. PASSWORD VALIDATION
   --------------------------------------------------------- */

function validatePassword(password) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };

  const passed = Object.values(checks).every(Boolean);

  return {
    valid: passed,
    checks
  };
}

function validateUsername(username) {
  /*
   * Usernames must be 5–15 characters.
   * Letters, numbers and underscores are permitted.
   */

  return /^[A-Za-z0-9_]{5,15}$/.test(username);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ---------------------------------------------------------
   6. EMAIL SIGNUP AND LOGIN
   --------------------------------------------------------- */

const emailAuthForm = $("#emailAuthForm");

if (emailAuthForm) {
  emailAuthForm.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      clearMessage();

      if (!gsSupabase) {
        setMessage(
          "Authentication is unavailable because the Supabase library did not load."
        );
        return;
      }

      const mode =
        emailAuthForm.dataset.mode || "login";

      const email =
        $("#email")?.value.trim() || "";

      const password =
        $("#password")?.value || "";

      const submitButton =
        $("#emailSubmitButton");

      if (!validateEmail(email)) {
        setMessage(
          "Please enter a valid email address."
        );
        return;
      }

      if (mode === "signup") {
        const displayName =
          $("#displayName")?.value.trim() || "";

        const username =
          $("#username")?.value.trim() || "";

        const confirmPassword =
          $("#confirmPassword")?.value || "";

        const acceptTerms =
          $("#acceptTerms")?.checked || false;

        if (!displayName) {
          setMessage(
            "Please enter your display name."
          );
          return;
        }

        if (!validateUsername(username)) {
          setMessage(
            "Your username must be 5–15 characters and contain only letters, numbers, or underscores."
          );
          return;
        }

        const passwordResult =
          validatePassword(password);

        if (!passwordResult.valid) {
          setMessage(
            "Use at least 8 characters, including uppercase and lowercase letters, a number, and a special character."
          );
          return;
        }

        if (password !== confirmPassword) {
          setMessage(
            "Your passwords do not match."
          );
          return;
        }

        if (!acceptTerms) {
          setMessage(
            "Please accept the Terms and Privacy Policy to continue."
          );
          return;
        }
      }

      setButtonLoading(
        submitButton,
        true,
        mode === "signup"
          ? "Creating account..."
          : "Signing in..."
      );

      try {
        if (mode === "signup") {
          const displayName =
            $("#displayName").value.trim();

          const username =
            $("#username").value.trim();

          const { data, error } =
            await gsSupabase.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo:
                  getPageURL("role.html"),

                data: {
                  display_name: displayName,
                  username: username
                }
              }
            });

          if (error) throw error;

          if (
            data.user &&
            data.user.identities &&
            data.user.identities.length === 0
          ) {
            setMessage(
              "An account may already exist with this email. Try signing in or resetting your password."
            );
            return;
          }

          if (data.session) {
            setMessage(
              "Your account was created successfully.",
              "success"
            );

            window.location.assign(
              getPageURL("role.html")
            );

            return;
          }

          setMessage(
            "Account created. Check your email for the verification link before continuing.",
            "success"
          );

        } else {
          const { data, error } =
            await gsSupabase.auth.signInWithPassword({
              email,
              password
            });

          if (error) throw error;

          if (data.session) {
            setMessage(
              "Sign-in successful.",
              "success"
            );

            window.location.assign(
              getPageURL("role.html")
            );
          }
        }

      } catch (error) {
        console.error(
          "GS Platform authentication error:",
          error
        );

        setMessage(
          getFriendlyAuthError(error)
        );

      } finally {
        setButtonLoading(
          submitButton,
          false
        );
      }
    }
  );
}

/* ---------------------------------------------------------
   7. GOOGLE SIGN-IN
   --------------------------------------------------------- */

const googleButton = $("#googleButton");

if (googleButton) {
  googleButton.addEventListener(
    "click",
    async () => {
      clearMessage();

      if (!gsSupabase) {
        setMessage(
          "Authentication is unavailable because the Supabase library did not load."
        );
        return;
      }

      setButtonLoading(
        googleButton,
        true,
        "Connecting to Google..."
      );

      try {
        const { error } =
          await gsSupabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: getPageURL("role.html")
            }
          });

        if (error) throw error;

      } catch (error) {
        console.error(
          "Google sign-in error:",
          error
        );

        setMessage(
          getFriendlyAuthError(error)
        );

        setButtonLoading(
          googleButton,
          false
        );
      }
    }
  );
}

/* ---------------------------------------------------------
   8. PASSWORD RESET
   --------------------------------------------------------- */

const forgotPasswordButton =
  $("#forgotPasswordButton");

if (forgotPasswordButton) {
  forgotPasswordButton.addEventListener(
    "click",
    async () => {
      clearMessage();

      if (!gsSupabase) {
        setMessage(
          "Authentication is currently unavailable."
        );
        return;
      }

      const email =
        $("#email")?.value.trim() || "";

      if (!validateEmail(email)) {
        setMessage(
          "Enter your email address first, then select Forgot password."
        );
        return;
      }

      setButtonLoading(
        forgotPasswordButton,
        true,
        "Sending reset link..."
      );

      try {
        const { error } =
          await gsSupabase.auth.resetPasswordForEmail(
            email,
            {
              redirectTo: getPageURL("index.html")
            }
          );

        if (error) throw error;

        setMessage(
          "If an account exists for that email, a password reset link will be sent.",
          "success"
        );

      } catch (error) {
        console.error(
          "Password reset error:",
          error
        );

        setMessage(
          getFriendlyAuthError(error)
        );

      } finally {
        setButtonLoading(
          forgotPasswordButton,
          false
        );
      }
    }
  );
}

/* ---------------------------------------------------------
   9. FRIENDLY AUTHENTICATION ERRORS
   --------------------------------------------------------- */

function getFriendlyAuthError(error) {
  const message =
    String(error?.message || "").toLowerCase();

  if (
    message.includes("invalid login credentials")
  ) {
    return "Your email or password is incorrect. Please check your details and try again.";
  }

  if (
    message.includes("email not confirmed")
  ) {
    return "Please verify your email address before signing in.";
  }

  if (
    message.includes("user already registered")
  ) {
    return "An account may already exist with this email. Try signing in instead.";
  }

  if (
    message.includes("password")
  ) {
    return "Please check your password and try again.";
  }

  if (
    message.includes("network") ||
    message.includes("fetch")
  ) {
    return "We couldn't connect. Check your internet connection and try again.";
  }

  return (
    error?.message ||
    "Something went wrong. Please try again."
  );
}

/* ---------------------------------------------------------
   10. RESTORE AUTHENTICATED SESSION
   --------------------------------------------------------- */

async function checkExistingSession() {
  if (!gsSupabase) return;

  try {
    const { data, error } =
      await gsSupabase.auth.getSession();

    if (error) throw error;

    if (data.session) {
      /*
       * Keep the current page open.
       * The role and dashboard routing will be connected
       * when the next pages are implemented.
       */
      document.documentElement.dataset.authenticated =
        "true";
    }

  } catch (error) {
    console.error(
      "Could not restore session:",
      error
    );
  }
}

/* ---------------------------------------------------------
   11. BASIC NAVIGATION MENU SUPPORT
   --------------------------------------------------------- */

const menuButton = $("[data-menu-toggle]");
const navigationMenu = $("[data-navigation-menu]");

if (menuButton && navigationMenu) {
  menuButton.addEventListener("click", () => {
    const isOpen =
      menuButton.getAttribute("aria-expanded") ===
      "true";

    menuButton.setAttribute(
      "aria-expanded",
      String(!isOpen)
    );

    navigationMenu.classList.toggle(
      "is-open",
      !isOpen
    );
  });
}

/* ---------------------------------------------------------
   12. START GS PLATFORM
   --------------------------------------------------------- */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    checkExistingSession();
  }
);
