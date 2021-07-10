const sendRequestBtn = document.querySelector("#send");
const urlInput = document.querySelector("#url");
const methodType = document.querySelector("#method");
const showResponse = document.querySelector("#showResponse");
const addQueryBtn = document.querySelector("#addQuery");
const addingQuery = document.querySelector("#addingQuery");
const addHeaderBtn = document.querySelector("#addHeader");
const addingHeader = document.querySelector("#addingHeader");
const basicAuth = document.querySelector("#basic-auth");
const authRequest = document.querySelector("#authRequest");
const bearerTokenInput = document.querySelector("#token");
const bodyContentType = document.querySelector("#bodyContentType");
const responseStatusArea = document.querySelector("#responseStatus");
const responseSizeArea = document.querySelector("#responseSize");
const responseTimeArea = document.querySelector("#responseTime");
// const methodType = document.querySelector("#bodyContent");
// const methodType = document.querySelector("#bodyContent");
// const methodType = document.querySelector("#bodyContent");

//sending request of input url and method after send button is clicked

const sendRequest = async () => {
  // https://dog.ceo/api/breeds/image/random
  sendRequestBtn.setAttribute("disabled", true);
  const url = urlInput.value;
  const method = methodType.value;
  const queries = getQuery();
  const headers = getHeader();
  const body = getBody();

  // console.log('Sending request', { method, url, params, headers, body });
  const startTime = Date.now();
  try {
    const result = await fetch(url + "?" + queries, {
      method,
      headers,
      body,
    });
    const endTime = Date.now();
    // const responseTime = new Date(endTime - startTime);
    // const redableResponseTime = responseTime.getSeconds() * 1000 + responseTime.getMilliseconds() + "ms";
    const responseTime = endTime - startTime;
    responseTimeArea.innerText = responseTime + "ms";
    const response = await result.text();
    console.log("result", response);
    showResponse.innerText = response;
    responseStatusArea.innerText = result.status;
  } catch (e) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    responseTimeArea.innerText = responseTime + "ms";
  }
};

sendRequestBtn.addEventListener("click", sendRequest);

//adding query parameters using add query button

const addQueryTemplate = ` <div class="input-group-text">
<input
  class="form-check-input mt-0"
  type="checkbox"
  value=""
  aria-label="Checkbox for following text input"
/>
</div>
<input
type="text"
class="form-control"
placeholder="parameter"
/>
<input type="text" class="form-control" placeholder="value" />`;

addQueryBtn.addEventListener("click", () => {
  const queryList = document.createElement("li");
  queryList.className = "list-group-item d-flex";
  queryList.innerHTML = addQueryTemplate;
  addingQuery.append(queryList);
});

//adding header parameters using add header button

const addHeaderTemplate = ` <div class="input-group-text">
<input
  class="form-check-input mt-0"
  type="checkbox"
  value=""
  aria-label="Checkbox for following text input"
/>
</div>
<input
type="text"
class="form-control"
aria-label="Text input with checkbox"
placeholder="header"
/>
<input
type="text"
class="form-control"
aria-label="Text input with checkbox"
placeholder="value"
/>`;

addHeaderBtn.addEventListener("click", () => {
  const headerList = document.createElement("li");
  headerList.className = "list-group-item d-flex";
  headerList.innerHTML = addHeaderTemplate;
  addingHeader.append(headerList);
});

//storing all the query parameters from query list in map

const getQuery = () => {
  let queryPara = {};
  //why use for each and map difference
  addingQuery.querySelectorAll("li").forEach((elem) => {
    const inputs = elem.querySelectorAll("input");
    if (inputs.length === 0) return;
    if (!inputs[0].checked) return;
    const key = inputs[1].value;
    const value = inputs[2].value;
    queryPara[key] = value;
  });
  //return the query string using urlSeacrhParams
  const urlSearchParams = new URLSearchParams(queryPara);
  return urlSearchParams.toString();
};

//getting auth using basic and and bearer token

const getAuth = () => {
  if (authRequest.value === "Basic Auth") {
    const basicAuthInputs = basicAuth.querySelectorAll("input");
    const username = basicAuthInputs[0].values;
    const password = basicAuthInputs[1].values;

    return "Basic " + new buffer(username + ":" + password).toString("base64");
  } else if (authRequest.value === "Bearer Token") {
    return "Bearer " + bearerTokenInput.value;
  }
};

//get content from body weather it is txt or xml or json

const getContentType = () => {
  const bodyContentSelected = bodyContentType.querySelectorAll("button").value;
  if (bodyContentSelected === "Json") {
    return "application/json";
  } else if (bodyContentSelected === "Text") {
    return "text/plain";
  } else if (bodyContentSelected === "Xml") {
    return "application/xml";
  }
};

//getting header parameters which also uses auth and content type

const getHeader = () => {
  let headerParam = {};
  const authorization = getAuth();
  if (authorization) {
    headerParam["Authorization"] = authorization;
  }
  const contentType = getContentType();
  if (contentType) {
    headerParam["Content-Type"] = contentType;
  }

  addingHeader.querySelectorAll("li").forEach((elem) => {
    const inputs = elem.querySelectorAll("input");
    if (inputs.length === 0) return;
    if (!inputs[0].checked) return;
    const key = inputs[1].value;
    const value = inputs[2].value;
    headerParam[key] = value;
  });
  return headerParam;
};

// get the content of body after selecting its type

const getBody = () => {
  const bodyContentSelected = bodyContentType.querySelectorAll("button").value;
  if (bodyContentSelected === "none") {
    return null;
    //havent kept any such option
  } else {
    const id = bodyContentSelected;
    return document.querySelector(`#${id}`).value;
  }
};
