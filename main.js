(function () {

  const APIURL = 'http://localhost:3000';
  // const APIURL = 'https://washed-server.herokuapp.com';
  const fileInput = document.querySelector('#file-input');
  const submitFile = document.querySelector('#submit-file-button');
  const loadingText = document.querySelector('#loading-text');
  const errorText = document.querySelector('#error-text');
  let toSendFile;

  fileInput.addEventListener('change', (event) => {
    toSendFile = event.target.files[0];
  })

  submitFile.addEventListener('click', (event) => {
    if (!toSendFile) {
      return;
    }

    const fd = new FormData();
    fd.append('imageFile', toSendFile);

    startLoading();
    axios({
      method: 'post',
      url: APIURL + '/uploadfile',
      data: fd,
      config: { headers: { 'Content-Type': 'multipart/form-data' } }
    })
      .then(response => {
        if (response.data.success) {
          initiateDownload(response.data);
        }
        stopLoading();
      })
      .catch(err => {
        stopLoading();
        setErrorText(err);
        console.log({ err });
      });
  })

  function initiateDownload(fileData) {
    blob = dataURIToBlob(fileData.dataURL);
    var url = URL.createObjectURL(blob);
    var a = document.createElement('A');
    a.href = url;
    a.download = fileData.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function startLoading() {
    loadingText.innerHTML = "Loading...";
  }

  function stopLoading() {
    loadingText.innerHTML = "";
  }

  function setErrorText(text) {
    errorText.innerHTML = text;
    setTimeout(() => setErrorText(''), 5000);
  }

  function dataURIToBlob(dataURI) {

    var binStr = atob(dataURI.split(',')[1]),
      len = binStr.length,
      arr = new Uint8Array(len),
      mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    for (var i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }

    return new Blob([arr], {
      type: mimeString
    });

  }


})()
