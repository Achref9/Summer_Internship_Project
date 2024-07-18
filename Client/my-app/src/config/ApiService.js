import axios from 'axios';
import BASE_URL from './Config';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
    });

  }

  getRepos() {
    return this.client.get('/repos');
  }

  logout() {
    return this.client.get('/logout');
  }

  callback(code) {
    return this.client.post('/callback', { code });
  }

  getBranches(owner, repo) {
    return this.client.get(`/branches/${owner}/${repo}`);
  }

  renameBranch(owner, repo, branch, newName) {
    return this.client.post(`/repos/${owner}/${repo}/branches/${branch}/rename`, { newName });
  }

  getCommits(owner, repo) {
    return this.client.get(`/commits/${owner}/${repo}`);
  }


  commit(owner, repo, data) {
    return this.client.post(`/commit/${owner}/${repo}`, data);
  }
}

const apiServiceInstance = new ApiService();
export default apiServiceInstance;
