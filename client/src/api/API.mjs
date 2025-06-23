const baseURL = "http://localhost:3001/api/";  // aggiunto /api/ e slash finale

/** ------------------- Access APIs ------------------------ */

async function login(email, password) {
  const response = await fetch(baseURL + "sessions", {
    method: 'POST',
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });

  if (response.ok) {
    return await response.json();
  } else {
    const errDetail = await response.json();
    if (errDetail?.error) throw errDetail.error;
    if (errDetail?.message) throw errDetail.message;
    throw new Error("Errore durante il login");
  }
}

async function logOut() {
  const res = await fetch(baseURL + 'sessions/current', {
    method: 'DELETE',
    credentials: "include"
  });

  if (!res.ok) {
    const errDetail = await res.json().catch(() => ({}));
    throw errDetail?.error || errDetail?.message || "Errore durante il logout";
  }
}

async function getUserInfo() {
  const response = await fetch(baseURL + 'sessions/current', {
    credentials: "include"
  });

  if (response.ok) {
    return await response.json();
  } else {
    const errDetail = await response.json().catch(() => ({}));
    throw errDetail?.error || errDetail?.message || "Errore durante il recupero dell'utente";
  }
}

export default { login, logOut, getUserInfo };
