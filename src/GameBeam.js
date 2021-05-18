function connectStream() {

    const { desktopCapturer, ipcRenderer, ipcMain } = require('electron')

    const robot = require('robotjs')

    let stream

    const peer = new Peer('peer1', {
        host: 'localhost',
        port: 9000,
        path: '/myapp'
    })

    desktopCapturer.getSources({ fetchWindowIcons: true, types: ['window', 'screen'], thumbnailSize: {
        height: 400,
        width: 400
    } }).then(async sources => {

        const appName = 'Groove Music'

        console.log('Here are your options. Edit the appName variable and reload.')

        for (const source of sources) {

            console.log(source.name)

           if (source.name.includes(appName)) {
                const dataURL = source.appIcon.toDataURL()
                document.querySelectorAll('title')[0].innerText = `${source.name} - GameCast`
                console.log(document.querySelectorAll('title')[0].innerText)
                try {
                    if (stream) return
                    stream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            mandatory: {
                                chromeMediaSource: 'desktop'
                            }
                        },
                        video: {
                            mandatory: {
                                chromeMediaSource: 'desktop',
                                chromeMediaSourceId: source.id,
                                minWidth: 1366+1600,
                                maxWidth: 4000,//1280
                                minHeight: 768+1600,
                                maxHeight: 3000,//720
                                maxFrameRate: 80
                            }
                        }
                    })

                    // Send app icon to client
                    const conn = peer.connect('peer2');

                    console.log('URL: ', dataURL)

                    conn.on('open', () => {
                        conn.send(dataURL);
                    })

                    conn.on('data', (chunk) => {

                        if (chunk['type'] === 'mouse') {

                            robot.moveMouse(chunk['x'], chunk['y'])

                        }

                        if (chunk['type'] === 'key') {

                            robot.keyTap(chunk.data)
                            
                        }

                        if (chunk['type'] === 'click') {

                            robot.mouseClick(data.btn, data.dbl)
                        }
                    })
                    // Make A/V Stream
                    const call = peer.call('peer2', stream);

                    call.on('stream', (remoteStream) => {
                        //document.getElementById('video').src = null
                        //document.getElementById('video').srcObject = remoteStream
                    })
                } catch (err) {
                    console.log(err)
                }
                return
            }
        }
    })
}

onload = () => {

    connectStream()

}