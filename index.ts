import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL;
if (!API_BASE_URL) {
  throw Error("API_BASE_URL not set!");
}

const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  throw Error("SECRET_KEY not set!");
}

const SYNC_PERIOD = parseInt(process.env.SYNC_PERIOD, 10);
if (!SYNC_PERIOD) {
  throw Error("SYNC_PERIOD not set!");
}

async function main() {
  const resp = await axios({
    method: 'get',
    url: API_BASE_URL + "/update/status/last",
    headers: {
      'x-update-secret-key': SECRET_KEY
    }
  });
  if (resp.status !== 200) {
    throw Error("got " + resp.status + " error when calling " + API_BASE_URL + "/update/status/last");
  }

  const lastUpdate = resp.data[0];
  if (!lastUpdate.finished) {
    console.log("last update at " + lastUpdate.startedAt + " did not finish, overwriting");
  }

  const updateInterval = Math.floor(Date.now() / 1000) - lastUpdate.before;
  if (updateInterval > SYNC_PERIOD + 60) {
    console.warn("api limit previously hit, possible sync issues");
  }

  const respUpdate = await axios({
    method: 'get',
    url: API_BASE_URL + "/update?interval=" + updateInterval,
    headers: {
      'x-update-secret-key': SECRET_KEY
    }
  });

  if (respUpdate.status !== 204) {
    throw Error("got " + respUpdate.status + " error when calling " + API_BASE_URL + "/update");
  }
} 

main();