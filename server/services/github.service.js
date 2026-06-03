import axios from 'axios';

/**
 * Fetches user profile details and repository information from GitHub API
 * @param {string} githubUrl - Absolute GitHub Profile URL
 * @returns {Promise<object>} Extracted GitHub data
 */
export const fetchGitHubData = async (githubUrl) => {
  const username = githubUrl.trim().split('/').filter(Boolean).pop();
  
  if (!username) {
    throw new Error('Invalid GitHub username parsed from URL');
  }

  try {
    // Configure GitHub API request (with optional personal access token to prevent rate limits)
    const headers = {};
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    // 1. Fetch user general profile
    const profileRes = await axios.get(`https://api.github.com/users/${username}`, { headers });
    
    // 2. Fetch user repositories (up to 100 repositories, sorted by updated time)
    const reposRes = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });
    
    const repositories = reposRes.data.map(repo => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      url: repo.html_url,
      updatedAt: repo.updated_at
    }));

    return {
      username,
      name: profileRes.data.name || username,
      bio: profileRes.data.bio || '',
      publicRepos: profileRes.data.public_repos,
      followers: profileRes.data.followers,
      repositories
    };
  } catch (error) {
    console.error('[GitHub Service Error]:', error.response?.data || error.message);
    throw new Error(`Failed to fetch GitHub profile for "${username}": ${error.message}`);
  }
};
