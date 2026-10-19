const GITHUB_USERNAME = "Muhammad-davoudi";

// فقط این پروژه‌ها نمایش داده می‌شوند
const ALLOWED_REPOS = [
  "qwen2vl-persian-ocr-lora",
  "bank-chatbot",
  "productiq"
];

// عنوان دلخواه برای نمایش (به‌جای اسم ریپو)
const PROJECT_TITLES = {
  "qwen2vl-persian-ocr-lora": "Persian OCR VLM",
  "bank-chatbot": "Bank Chatbot",
  "productiq": "ProductInsight — AI-Powered Product Analytics Platform"
};

async function loadProjects() {
  const container = document.getElementById("projects-container");

  try {
    const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30&type=owner`;
    const response = await fetch(url, {
      headers: { "Accept": "application/vnd.github.v3+json" }
    });

    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

    const repos = await response.json();

    const filtered = repos.filter(repo =>
      ALLOWED_REPOS.includes(repo.name)
    );

    if (filtered.length === 0) {
      container.innerHTML = `<div class="loading">No approved projects found.</div>`;
      return;
    }

    container.innerHTML = filtered.map(repo => {
      const topics = (repo.topics || []).slice(0, 4);
      const language = repo.language ? [repo.language] : [];
      const tags = [...new Set([...topics, ...language])].slice(0, 4);

      const nameLower = repo.name.toLowerCase();
      const descLower = (repo.description || "").toLowerCase();

      let icon = "fa-code";
      let theme = "theme-default";

      if (nameLower.includes("chat") || nameLower.includes("rag") ||
          nameLower.includes("bank") || descLower.includes("rag") ||
          descLower.includes("chatbot") || descLower.includes("banking")) {
        icon = "fa-comments";
        theme = "theme-chat";
      }
      else if (nameLower.includes("ocr") || nameLower.includes("vlm") ||
               descLower.includes("ocr") || descLower.includes("vlm") ||
               nameLower.includes("qwen")) {
        icon = "fa-book-open";
        theme = "theme-ocr";
      }
      else if (nameLower.includes("productiq") || descLower.includes("product") ||
               descLower.includes("analytics") || descLower.includes("insight")) {
        icon = "fa-chart-line";
        theme = "theme-default";
      }

      const displayTitle = PROJECT_TITLES[repo.name] || repo.name;

      return `
        <a href="${repo.html_url}" target="_blank" class="project-card">
          <div class="project-img ${theme}">
            <i class="fas ${icon}"></i>
          </div>
          <div class="project-body">
            <h3>${displayTitle}</h3>
            <p>${repo.description || "No description provided."}</p>
            <div class="project-tags">
              ${tags.map(t => `<span class="tag">${t}</span>`).join("")}
            </div>
          </div>
        </a>
      `;
    }).join("");
  } catch (error) {
    console.error(error);
    container.innerHTML = `
      <div class="loading">
        Could not load projects from GitHub.<br>
        <small>${error.message}</small><br><br>
        <button onclick="loadProjects()" style="background:#3b82f6;color:white;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;">
          Try again
        </button>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", loadProjects);