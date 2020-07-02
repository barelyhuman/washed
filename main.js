(function () {
  const APIURL = 'https://washed-server.herokuapp.com/api';
  const fileInput = document.querySelector('#file-input')
  const submitFile = document.querySelector('#submit-file-button')
  const errorText = document.querySelector('#error-text')
  const fileNameContainer = document.querySelector('#file-name')
  let serverFileName = ''
  let toSendFile

  fileInput.addEventListener('change', (event) => {
    toSendFile = event.target.files[0]
    fileNameContainer.innerHTML = toSendFile.name
    submitFile.disabled = false
  })

  submitFile.disabled = true

  submitFile.addEventListener('click', (event) => {
    if (event.target.disabled) {
      return
    }

    if (!toSendFile) {
      return
    }

    const fd = new FormData()
    fd.append('imageFile', toSendFile)

    startLoading()
    axios({
      method: 'post',
      url: APIURL + '/uploadfile',
      data: fd,
      config: { headers: { 'Content-Type': 'multipart/form-data' } }
    })
      .then(response => {
        serverFileName = response.data.fileName
        getFile()
      })
      .catch(err => {
        stopLoading()
        setErrorText(err)
        console.log({ err })
      })
  })

  function getFile () {
    axios.get(APIURL + `/getfile?filename=${serverFileName}`)
      .then(response => {
        if (response.data.status === 1) {
          stopLoading();
          return initiateDownload(response.data)
        }
        return setTimeout(() => {
          getFile()
        }, 2500)
      }).catch(err => {
        stopLoading()
        setErrorText(err)
        console.log({ err })
      })
  }

  function initiateDownload (fileData) {
    blob = dataURIToBlob(fileData.dataURL)
    var url = URL.createObjectURL(blob)
    var a = document.createElement('A')
    a.href = url
    a.download = fileData.fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  function startLoading () {
    submitFile.innerHTML = 'Loading...'
    submitFile.classList.add('button-loading')
    submitFile.disabled = true
  }

  function stopLoading () {
    submitFile.innerHTML = 'Wash It'
    submitFile.classList.remove('button-loading')
    submitFile.disabled = false
  }

  function setErrorText (text) {
    errorText.innerHTML = text
    setTimeout(() => setErrorText(''), 5000)
  }

  function dataURIToBlob (dataURI) {
    var binStr = atob(dataURI.split(',')[1])
    var len = binStr.length
    var arr = new Uint8Array(len)
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    for (var i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i)
    }

    return new Blob([arr], {
      type: mimeString
    })
  }
})()
