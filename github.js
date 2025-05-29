let searchResults = [];
let currentSearchTerm = "";
let hasSearched = false;

function initGitHubApp() {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const clearBtn = document.getElementById("clear-btn");
  const backBtn = document.getElementById("back-btn");

  searchForm.addEventListener("submit", handleSearch);
  clearBtn.addEventListener("click", handleClear);
  backBtn.addEventListener("click", handleBack);

  showNoResults();
}

async function handleSearch(e) {
  e.preventDefault();

  const searchTerm = document.getElementById("search-input").value.trim();
  if (!searchTerm) return;

  currentSearchTerm = searchTerm;
  hasSearched = true;

  showLoading();

  try {
    const response = await fetch(
      `https://api.github.com/search/users?q=${encodeURIComponent(searchTerm)}`
    );

    if (!response.ok) {
      throw new Error("Search failed");
    }

    const data = await response.json();
    searchResults = data.items;

    hideLoading();

    if (searchResults.length === 0) {
      showNoResults("No users found for this search term");
    } else {
      showUsers(searchResults);
    }
  } catch (error) {
    console.error("Search error:", error);
    hideLoading();
    showNoResults("Failed to search users. Please try again.");
  }
}

function handleClear() {
  document.getElementById("search-input").value = "";
  searchResults = [];
  currentSearchTerm = "";
  hasSearched = false;
  showNoResults();
}

function handleBack() {
  document.getElementById("github-details-page").classList.remove("active");
  document.getElementById("github-page").classList.add("active");

  document
    .querySelectorAll(".nav-link")
    .forEach((nav) => nav.classList.remove("active"));
  document
    .querySelector('.nav-link[data-page="github"]')
    .classList.add("active");

  if (hasSearched && searchResults.length > 0) {
    showUsers(searchResults);
  } else {
    showNoResults();
  }

  document.getElementById("search-input").value = currentSearchTerm;
}

function showLoading() {
  hide(["users-grid", "no-results"]);
  show(["loading"]);
}

function hideLoading() {
  hide(["loading"]);
}

function showUsers(users) {
  hide(["loading", "no-results"]);

  const usersGrid = document.getElementById("users-grid");
  usersGrid.innerHTML = "";

  users.forEach((user) => {
    const userCard = createUserCard(user);
    usersGrid.appendChild(userCard);
  });

  show(["users-grid"]);
}

function showNoResults(message = null) {
  hide(["loading", "users-grid"]);

  const noResults = document.getElementById("no-results");
  if (message) {
    noResults.innerHTML = `
            <p>${message}</p>
            <p class="sub-text">Try searching for a different username</p>
        `;
  } else {
    noResults.innerHTML = `
            <p>Start by searching for a GitHub username</p>
            <p class="sub-text">Enter a username like "octocat" or "john" to get started</p>
        `;
  }

  show(["no-results"]);
}

function createUserCard(user) {
  const card = document.createElement("div");
  card.className = "user-card";

  card.innerHTML = `
        <img src="${user.avatar_url}" alt="${user.login}'s avatar" class="user-avatar">
        <h3 class="user-name">${user.login}</h3>
        <span class="user-type">${user.type}</span>
        <button class="btn btn-primary user-more-btn" onclick="showUserDetails('${user.login}')">
            <i data-lucide="user"></i>
            <span>More</span>
        </button>
    `;

  setTimeout(() => lucide.createIcons(), 0);

  return card;
}

async function showUserDetails(username) {
  document.getElementById("github-page").classList.remove("active");
  document.getElementById("github-details-page").classList.add("active");

  show(["user-details-loading"]);
  hide(["user-details-content"]);

  try {
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(
        `https://api.github.com/users/${username}/repos?per_page=6&sort=created&direction=asc`
      ),
    ]);

    if (!userResponse.ok || !reposResponse.ok) {
      throw new Error("Failed to fetch user details");
    }

    const user = await userResponse.json();
    const repos = await reposResponse.json();

    hide(["user-details-loading"]);
    displayUserDetails(user, repos);
  } catch (error) {
    console.error("Error fetching user details:", error);
    hide(["user-details-loading"]);
    show(["user-details-content"]);
    document.getElementById("user-details-content").innerHTML = `
            <div class="user-profile">
                <p style="text-align: center; color: #ef4444; padding: 2rem;">Failed to load user details. Please try again.</p>
            </div>
        `;
  }
}

function displayUserDetails(user, repos) {
  const hireableStatusTop = document.getElementById("hireable-status-top");
  let hireableContent = "";

  if (user.hireable === null) {
    hireableContent = `
            <span class="hireable-label">Hireable:</span>
            <span class="hireable-value hireable-null">Not specified</span>
        `;
  } else if (user.hireable) {
    hireableContent = `
            <span class="hireable-label">Hireable:</span>
            <span class="hireable-value hireable-yes">
                <i data-lucide="check"></i>
                <span>Yes</span>
            </span>
        `;
  } else {
    hireableContent = `
            <span class="hireable-label">Hireable:</span>
            <span class="hireable-value hireable-no">
                <i data-lucide="x"></i>
                <span>No</span>
            </span>
        `;
  }

  hireableStatusTop.innerHTML = hireableContent;

  const userDetailsContent = document.getElementById("user-details-content");

  const profileMeta = [];
  if (user.company) {
    profileMeta.push(`
            <div class="profile-meta-item">
                <i data-lucide="building"></i>
                <span>${user.company}</span>
            </div>
        `);
  }
  if (user.location) {
    profileMeta.push(`
            <div class="profile-meta-item">
                <i data-lucide="map-pin"></i>
                <span>${user.location}</span>
            </div>
        `);
  }

  userDetailsContent.innerHTML = `
        <div class="user-profile">
            <div class="profile-header">
                <img src="${user.avatar_url}" alt="${
    user.login
  }'s avatar" class="profile-avatar">
                <div class="profile-info">
                    <h2>${user.name || user.login}</h2>
                    <p class="username">@${user.login}</p>
                    ${user.bio ? `<p>${user.bio}</p>` : ""}
                    ${
                      profileMeta.length > 0
                        ? `<div class="profile-meta">${profileMeta.join(
                            ""
                          )}</div>`
                        : ""
                    }
                    <a href="${
                      user.html_url
                    }" target="_blank" class="btn btn-primary">
                        <i data-lucide="external-link"></i>
                        View GitHub Profile
                    </a>
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card followers">
                    <div class="stat-header">
                        <i data-lucide="users"></i>
                        <span class="stat-label">Followers</span>
                    </div>
                    <div class="stat-number">${user.followers.toLocaleString()}</div>
                </div>
                <div class="stat-card following">
                    <div class="stat-header">
                        <i data-lucide="users"></i>
                        <span class="stat-label">Following</span>
                    </div>
                    <div class="stat-number">${user.following.toLocaleString()}</div>
                </div>
                <div class="stat-card repos">
                    <div class="stat-header">
                        <i data-lucide="git-fork"></i>
                        <span class="stat-label">Public Repos</span>
                    </div>
                    <div class="stat-number">${user.public_repos.toLocaleString()}</div>
                </div>
                <div class="stat-card gists">
                    <div class="stat-header">
                        <i data-lucide="star"></i>
                        <span class="stat-label">Public Gists</span>
                    </div>
                    <div class="stat-number">${user.public_gists.toLocaleString()}</div>
                </div>
            </div>
            
            <div class="repos-section">
                <h3>Earliest Repositories</h3>
                <div class="repos-grid">
                    ${repos
                      .map(
                        (repo) => `
                        <div class="repo-card">
                            <div class="repo-header">
                                <h3 class="repo-name">${repo.name}</h3>
                                <a href="${
                                  repo.html_url
                                }" target="_blank" class="repo-link">
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <p class="repo-description">${
                              repo.description || "No description available"
                            }</p>
                            <div class="repo-stats">
                                <div class="repo-stats-left">
                                    <div class="repo-stat">
                                        <i data-lucide="star"></i>
                                        <span>${repo.stargazers_count}</span>
                                    </div>
                                    <div class="repo-stat">
                                        <i data-lucide="eye"></i>
                                        <span>${repo.watchers_count}</span>
                                    </div>
                                    <div class="repo-stat">
                                        <i data-lucide="git-fork"></i>
                                        <span>${repo.forks_count}</span>
                                    </div>
                                </div>
                                ${
                                  repo.language
                                    ? `<span class="repo-language">${repo.language}</span>`
                                    : ""
                                }
                            </div>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
        </div>
    `;

  show(["user-details-content"]);

  setTimeout(() => lucide.createIcons(), 0);
}

function show(elementIds) {
  elementIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.remove("hidden");
    }
  });
}

function hide(elementIds) {
  elementIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.add("hidden");
    }
  });
}
