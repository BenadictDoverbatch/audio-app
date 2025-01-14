let audioContext;
let input;
let output;
let stream;
let pitchShifter;
let audioElement = new Audio();

document.getElementById('start').addEventListener('click', async () => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const inputDeviceId = document.getElementById('inputDevice').value;
    stream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: inputDeviceId } });
    input = audioContext.createMediaStreamSource(stream);
    pitchShifter = audioContext.createGain();
    pitchShifter.gain.value = document.getElementById('pitch').value;
    input.connect(pitchShifter);
    output = audioContext.createMediaStreamDestination();
    pitchShifter.connect(output);
    audioElement.srcObject = output.stream;
    audioElement.play();
});

document.getElementById('stop').addEventListener('click', () => {
    stream.getTracks().forEach(track => track.stop());
    audioContext.close();
    audioElement.pause();
});

document.getElementById('pitch').addEventListener('input', () => {
    if (pitchShifter) {
        pitchShifter.gain.value = document.getElementById('pitch').value;
    }
});

document.getElementById('speak').addEventListener('click', () => {
    const text = document.getElementById('ttsInput').value;
    const language = document.getElementById('language').value;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    speechSynthesis.speak(utterance);
});

async function getAudioDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const inputSelect = document.getElementById('inputDevice');
    const outputSelect = document.getElementById('outputDevice');
    devices.forEach(device => {
        if (device.kind === 'audioinput') {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `Input ${inputSelect.length + 1}`;
            inputSelect.appendChild(option);
        } else if (device.kind === 'audiooutput') {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `Output ${outputSelect.length + 1}`;
            outputSelect.appendChild(option);
        }
    });
}

getAudioDevices();
