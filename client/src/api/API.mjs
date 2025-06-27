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

/** ------------------- Teacher APIs ------------------------ */

// Ottiene la lista completa degli studenti
async function getAllStudents() {
  const res = await fetch(baseURL + 'students', {
    credentials: 'include'
  });

  if (res.ok) {
    return await res.json(); // array di { id, name }
  } else {
    const errDetail = await res.json().catch(() => ({}));
    throw errDetail?.error || errDetail?.message || "Errore nel recupero degli studenti";
  }
}

// Verifica se un gruppo è valido (nessuna coppia con ≥2 compiti in comune)
async function validaGruppo(studentIds) {
  const res = await fetch(baseURL + 'tasks/check-group', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ studentIds })
  });

  if (res.ok) {
    return await res.json(); // { valido: true/false }
  } else {
    const errDetail = await res.json().catch(() => ({}));
    throw errDetail?.error || errDetail?.message || "Errore nella validazione del gruppo";
  }
}

async function creaCompito({ domanda, studenti }) {
  const res = await fetch(baseURL + 'tasks', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    
    body: JSON.stringify({ domanda, studenti })  // usa la stessa chiave attesa dal backend
  });
 
  if (!res.ok) {
    const errDetail = await res.json().catch(() => ({}));
    throw errDetail?.error || errDetail?.message || "Errore nella creazione del compito";
  }
}

async function inviaValutazione(taskID, score) {
  const res = await fetch(baseURL + `teacher/tasks/${taskID}/score`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ score })
  });

  if (!res.ok) {
    const errDetail = await res.json().catch(() => ({}));
    throw errDetail?.error || errDetail?.message || 'Errore durante la valutazione del compito';
  }

  return true;
}

async function getCompitiCreati() {
  const res = await fetch(baseURL + 'teacher/tasks', {
    credentials: 'include'
  });
  if (!res.ok) throw new Error("Errore nel caricamento");
  return await res.json();
}

async function getStatoClasse() {
  const res = await fetch(baseURL + 'teacher/stato-classe', {
    credentials: 'include'
  });

  if (res.ok) {
    return await res.json();  // Array di { id, name, aperti, chiusi, media }
  } else {
    const errDetail = await res.json().catch(() => ({}));
    throw errDetail?.error || errDetail?.message || "Errore nel recupero dello stato della classe";
  }
}


/** ------------------- Student APIs ------------------------ */
async function getCompitiAssegnati() {
  const res = await fetch(baseURL + 'student/tasks', {
    credentials: 'include'
  });

  if (res.ok) {
    return await res.json();  // [{ taskID, question, risposta }]
  } else {
    const errDetail = await res.json().catch(() => ({}));
    throw errDetail?.error || errDetail?.message || "Errore nel recupero dei compiti";
  }
}

async function inviaRisposta(taskID, answerText) {
  const res = await fetch(baseURL + `student/answers/${taskID}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ risposta: answerText })
  });

  if (!res.ok) {
    const errDetail = await res.json().catch(() => ({}));
    throw errDetail?.error || errDetail?.message || "Errore nell'invio della risposta";
  }
}

// Ottiene tutti i punteggi ricevuti dallo studente e la media
async function getPunteggiStudent() {
  const res = await fetch(baseURL + 'student/grades', {
    credentials: 'include'
  });

  if (res.ok) {
    return await res.json(); // { compiti: [{ taskID, question, score }], media: number }
  } else {
    const errDetail = await res.json().catch(() => ({}));
    throw errDetail?.error || errDetail?.message || "Errore nel recupero dei punteggi";
  }
}



export default { login, logOut, getUserInfo, getAllStudents, 
                 validaGruppo, creaCompito, getCompitiAssegnati, inviaRisposta, 
                 inviaValutazione, getCompitiCreati, getStatoClasse, getPunteggiStudent };
