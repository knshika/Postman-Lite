const queryAddBtn = document.querySelector("#addQuery");
const queryList = document.querySelector("#queryList");
const headerAddBtn = document.querySelector("#addHeader");
const headerList = document.querySelector("#headerList");
const authMethods = document.querySelector("#auth-methods");
const bodyTypes = document.querySelector("#body-types");
const requestMethod = document.querySelector("#requestMethod");
const requestURL = document.querySelector("#requestURL");
const sendBtn = document.querySelector("#sendBtn");
const responseText = document.querySelector("#responseText");
const basicAuth = document.querySelector("#basic-auth");
const bearerToken = document.querySelector("#bearer-token");
const statusTextArea = document.querySelector("#status-area");
const sizeTextArea = document.querySelector("#size-area");
const timeTextArea = document.querySelector("#time-area");
//const basic-auth = document.querySelector("#basic-auth");

//getting all the query parameters

const getQuery = () => {
  const queryParams = {};
  queryList.querySelectorAll("li").forEach((elem) => {
    const inputs = elem.querySelectorAll("input");
    if (inputs.length == 0) return;
    if (!inputs[0].checked) return;
    const key = inputs[1].value;
    const value = inputs[2].value;
    queryParams[key] = value;
  });
  const urlSearchPara = new URLSearchParams(queryParams);
  return urlSearchPara.toString();
};

//getting authentication types

const getAuth = () => {
  if (authMethods.value === "basic-auth") {
    const username = basicAuth.querySelector("#username").value;
    const password = basicAuth.querySelector("#password").value;
    return "Basic " + btoa(username + ":" + password);
  } else if (authMethods.value === "bearer-token") {
    return "Bearer " + bearerToken.querySelector("#token").value;
  }
};

//getting body content

const getBody = () => {
  const selectedType = bodyTypes.value;
  if (selectedType === "none") {
    return null;
  } else {
    return document.querySelector(`#${selectedType} >textarea`).value;
  }
};

const getContentType = () => {
  const selectedValue = bodyTypes.value;
  if (selectedValue === "body-json") {
    return "application/json";
  } else if (selectedValue === "body-text") {
    return "text/plain";
  } else if (selectedValue === "body-xml") {
    return "application/xml";
  }
};

//getting all the header parameters

const getHeaders = () => {
  const headerParams = {};
  const authorization = getAuth();
  if (authorization) {
    headerParams["Authorization"] = authorization;
  }
  const contentType = getContentType();
  if (contentType) {
    headerParams["content-type"] = contentType;
  }
  headerList.querySelectorAll("li").forEach((elem) => {
    const inputs = elem.querySelectorAll("input");
    if (inputs.length == 0) return;
    if (!inputs[0].checked) return;
    const key = inputs[1].value;
    const value = inputs[2].value;
    headerParams[key] = value;
  });

  return headerParams;
};

// handeling send button

const handleSend = async () => {
  const url = requestURL.value;
  const method = requestMethod.value;
  const query = getQuery();
  const headers = getHeaders();
  const body = getBody();

  const startTime = Date.now();
  try {
    const result = await fetch(url + "?" + query, { method, headers, body });

    const endTime = Date.now();
    const totalTime = endTime - startTime;
    timeTextArea.innerText = totalTime + "ms";

    const response = await result.text();
    responseText.innerText = response;
    statusTextArea.innerText = result.status;

    sizeTextArea.innerText =
      result.headers.get("Content-Length") || response.length;
  } catch (e) {
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    timeTextArea.innerText = totalTime + "ms";
    responseText.innerText = e.message;
    statusTextArea.innerText = " ";
  }
};

sendBtn.addEventListener("click", handleSend);

//adding query parameters

const queryTemplate = `<li class="list-group-item d-flex align-items-center">
<input
  class="border-light me-2"
  type="checkbox"
  value=""
  style="width: 40px; height: 40px"
  aria-label="..."
/>
<input
  type="text"
  class="form-control me-2"
  placeholder="parameter"
  aria-label="parameter"
/>
<input
  type="text"
  class="form-control"
  placeholder="value"
  aria-label="value"
/>
</li>`;

const addingQueryPara = () => {
  queryList.innerHTML += queryTemplate;
};

queryAddBtn.addEventListener("click", addingQueryPara);

//adding header parameters

const headerTemplate = `<li class="list-group-item d-flex align-items-center">
<input
  class="border-light me-2"
  type="checkbox"
  value=""
  style="width: 40px; height: 40px"
  aria-label="..."
/>
<input
  type="text"
  class="form-control me-2"
  placeholder="parameter"
  aria-label="parameter"
/>
<input
  type="text"
  class="form-control"
  placeholder="value"
  aria-label="value"
/>
</li>`;

const addingHeaderPara = () => {
  headerList.innerHTML += headerTemplate;
};

headerAddBtn.addEventListener("click", addingHeaderPara);

//changing auth tabs with select button

const changeAuthTab = () => {
  const currentTab = authMethods.value;
  document.querySelectorAll(".auth-tabs").forEach((tab) => {
    if (tab.id === currentTab) {
      tab.classList.remove("visually-hidden");
    } else {
      tab.classList.add("visually-hidden");
    }
  });
};

authMethods.addEventListener("change", changeAuthTab);

//changing auth tabs with select button

const changeBodyTab = () => {
  const currentTab = bodyTypes.value;
  document.querySelectorAll(".body-tabs").forEach((tab) => {
    if (tab.id === currentTab) {
      tab.classList.remove("visually-hidden");
    } else {
      tab.classList.add("visually-hidden");
    }
  });
};

bodyTypes.addEventListener("change", changeBodyTab);
