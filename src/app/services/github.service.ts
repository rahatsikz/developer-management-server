import axios from "axios";
import { Octokit } from "@octokit/rest";
import config from "../../config";

const GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";

const getGithubAuthUrl = (state: string) => {
  const params = new URLSearchParams({
    client_id: config.github.client_id!,
    redirect_uri: config.github.callback_url!,
    scope: "repo",
    state,
  });
  return `${GITHUB_OAUTH_URL}?${params.toString()}`;
};

const exchangeCodeForToken = async (code: string) => {
  const response = await axios.post(
    GITHUB_TOKEN_URL,
    {
      client_id: config.github.client_id!,
      client_secret: config.github.client_secret!,
      code,
    },
    { headers: { Accept: "application/json" } }
  );
  return response.data.access_token as string;
};

const createGithubRepo = async (
  accessToken: string,
  name: string,
  description?: string,
  isPrivate = false
) => {
  const octokit = new Octokit({ auth: accessToken });
  const { data } = await octokit.rest.repos.createForAuthenticatedUser({
    name,
    description,
    private: isPrivate,
  });
  return data;
};

export { getGithubAuthUrl, exchangeCodeForToken, createGithubRepo };
