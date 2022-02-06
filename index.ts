import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL;
if (!API_BASE_URL) {
  throw Error("API_BASE_URL not set!");
}

const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  throw Error("SECRET_KEY not set!");
}

async function getPending() {
  const resp = await axios({
    method: 'get',
    url: API_BASE_URL + "/update/status/pending",
    headers: {
      'x-update-secret-key': SECRET_KEY
    }
  });
  console.log(resp);
}

getPending();