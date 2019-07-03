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
    var a = document.createElement('A');
    a.href = fileData.dataURL;
    a.download = fileData.fileName
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


})()
