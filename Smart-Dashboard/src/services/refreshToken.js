// src/services/authRefreshService.js
import axios from "axios";

export async function refreshToken() {
  const refresh_token = localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token");
  const client_id = localStorage.getItem("kc_client_id") || sessionStorage.getItem("kc_client_id");

  if (!refresh_token || !client_id) throw new Error("Missing refresh token or client ID");

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("client_id", client_id);
  params.append("refresh_token", refresh_token);
  params.append("scope", "openid email profile");

  const { data } = await axios.post(
    "https://snap4.rhodes.gr/auth/realms/master/protocol/openid-connect/token/",
    params,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  // Αποθηκεύουμε τα νέα tokens
  localStorage.setItem("access_token", data.access_token);
  if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);

  return data.access_token;
}
