const GITHUB_USERNAME = "Muhammad-davoudi";

// ============================================
// فقط ریپوهایی که اینجا بنویسی نمایش داده می‌شوند
// هر وقت پروژه جدید خواستی اضافه کنی، اسمش را اینجا بنویس
// ============================================
const ALLOWED_REPOS = [
  "qwen2vl-persian-ocr-lora",
  "bank-chatbot",
  "ProductInsight — AI-Powered Product Analytics Platform"
];

// ============================================

async function loadProjects() {
  const container = document.getElementById("projects-container");

  try {
    const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30&type=owner`;
    const response = await fetch(url, {
      headers: { "Accept": "application/vnd.github.v3+json" }
    });

    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

    const repos = await response.json();

    // فقط ریپوهایی که در لیست ALLOWED_REPOS هستند
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

      return `
        <a href="${repo.html_url}" target="_blank" class="project-card">
          <div class="project-img ${theme}">
            <i class="fas ${icon}"></i>
          </div>
          <div class="project-body">
            <h3>${repo.name}</h3>
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