const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const animatedItems = document.querySelectorAll(".hero-copy, .hero-card, .info-card, .step-card, .disease-card, .closing-card");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}

animatedItems.forEach((item) => item.classList.add("fade-in"));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

animatedItems.forEach((item) => observer.observe(item));

const diagnosisTree = {
  question: "Apakah daun menguning dengan garis putih?",
  yes: {
    question: "Apakah tanaman kerdil?",
    yes: {
      question: "Apakah daun pucat?",
      yes: { result: "P1 - Bulai" },
      no: {
        question: "Apakah daun mengering?",
        yes: { result: "P2 - Kekurangan Nitrogen" },
        no: { result: "P3 - Kekurangan Kalium" }
      }
    },
    no: {
      question: "Apakah ada bercak pada daun?",
      yes: {
        question: "Apakah bercak berwarna coklat?",
        yes: { result: "P4 - Karat Daun" },
        no: { result: "P5 - Hawar Daun" }
      },
      no: { result: "Tanaman Normal" }
    }
  },
  no: {
    question: "Apakah daun berlubang?",
    yes: {
      question: "Apakah ada ulat?",
      yes: { result: "P7 - Ulat Grayak" },
      no: {
        question: "Apakah batang berlubang?",
        yes: { result: "P8 - Penggerek Batang" },
        no: { result: "Tanaman Normal" }
      }
    },
    no: {
      question: "Apakah tongkol membusuk?",
      yes: { result: "P9 - Busuk Tongkol" },
      no: {
        question: "Apakah batang mudah patah?",
        yes: { result: "P10 - Busuk Batang" },
        no: { result: "Tanaman Normal" }
      }
    }
  }
};

const chatbot = document.querySelector(".chatbot");
const chatbotToggle = document.querySelector(".chatbot-toggle");
const chatbotClose = document.querySelector(".chatbot-close");
const chatbotMessages = document.querySelector(".chatbot-messages");
const chatbotAnswers = document.querySelectorAll(".chatbot-answer");
const chatbotReset = document.querySelector(".chatbot-reset");

let currentNode = diagnosisTree;
let diagnosisFinished = false;

function addMessage(text, type = "bot", isResult = false) {
  if (!chatbotMessages) {
    return;
  }

  const message = document.createElement("div");
  message.className = `chatbot-message ${type}${isResult ? " result" : ""}`;
  message.textContent = text;
  chatbotMessages.appendChild(message);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function setAnswerButtonsDisabled(disabled) {
  chatbotAnswers.forEach((button) => {
    button.disabled = disabled;
  });
}

function askQuestion() {
  if (currentNode.question) {
    addMessage(currentNode.question);
    setAnswerButtonsDisabled(false);
  }
}

function showDiagnosis(result) {
  addMessage(`Diagnosa: ${result}`, "bot", true);
  addMessage("Tekan tombol Ulangi Diagnosa jika ingin mencoba lagi.");
  diagnosisFinished = true;
  setAnswerButtonsDisabled(true);
}

function resetDiagnosis() {
  if (!chatbotMessages) {
    return;
  }

  chatbotMessages.innerHTML = "";
  currentNode = diagnosisTree;
  diagnosisFinished = false;
  addMessage("Halo, saya siap membantu mendiagnosa gejala pada tanaman jagung.");
  addMessage("Jawab pertanyaan berikut dengan memilih tombol Ya atau Tidak.");
  askQuestion();
}

chatbotAnswers.forEach((button) => {
  button.addEventListener("click", () => {
    if (diagnosisFinished || !currentNode) {
      return;
    }

    const isYes = button.dataset.answer === "ya";
    addMessage(isYes ? "Ya" : "Tidak", "user");

    currentNode = isYes ? currentNode.yes : currentNode.no;

    if (!currentNode) {
      showDiagnosis("Data diagnosa tidak ditemukan");
      return;
    }

    if (currentNode.result) {
      showDiagnosis(currentNode.result);
      return;
    }

    askQuestion();
  });
});

if (chatbotToggle && chatbot) {
  chatbotToggle.addEventListener("click", () => {
    chatbot.classList.add("open");

    if (!chatbotMessages || chatbotMessages.children.length === 0) {
      resetDiagnosis();
    }
  });
}

if (chatbotClose && chatbot) {
  chatbotClose.addEventListener("click", () => {
    chatbot.classList.remove("open");
  });
}

if (chatbotReset) {
  chatbotReset.addEventListener("click", resetDiagnosis);
}
