(function () {
  // const APIURL = 'http://localhost:3000';
  const APIURL = 'https://washed-server.herokuapp.com';
  const fileInput = document.querySelector('#file-input');
  const submitFile = document.querySelector('#submit-file-button');
  const iFrame = document.querySelector('#iframe-holder');
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

    axios({
      method: 'post',
      url: APIURL + '/uploadfile',
      data: fd,
      config: { headers: { 'Content-Type': 'multipart/form-data' } }
    })
      .then(response => {
        if (response.data.success) {
          initiateDownload(response.data.file);
        }
      })
      .catch(err => {
        console.log({ err });
      });
  })

  function initiateDownload(fileName) {
    const url = APIURL + '/download?';
    const params = new URLSearchParams();
    params.append('filename', fileName);
    const urlWithParams = url + params.toString();
    var a = document.createElement('A');
    a.href = urlWithParams;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }





})()
