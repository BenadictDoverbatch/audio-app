let audioContext;
let input;
let output;
let stream;

document.getElementById('start').addEventListener('click', async () => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    input = audioContext.createMediaStreamSource(stream);
    output = audioContext.createMediaStreamDestination();
    input.connect(output);
    const audio = new Audio();
    audio.srcObject = output.stream;
    audio.play();
});

document.getElementById('stop').addEventListener('click', () => {
    stream.getTracks().forEach(track => track.stop());
    audioContext.close();
});
