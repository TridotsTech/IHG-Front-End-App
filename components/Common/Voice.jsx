import { useState, useRef } from "react";

const Voice = () => {

    const microphoneRef = useRef(null);

    const [isListening, setIsListening] = useState(false);

    let [transcript, setTranscript] = useState('');
    var vSearch;

    const startListening = () => {

        if ('webkitSpeechRecognition' in window) {
            vSearch = new webkitSpeechRecognition();
            vSearch.continuous = true;
            // vSearch.interimResults = false;
            vSearch.lang = 'en-IN';
            let results;

            vSearch.onstart = function () {
                // console.log('Voice recognition started.');
                setIsListening(true);
                microphoneRef.current.classList.add("listening");
            };

            vSearch.onresult = function (e) {
                results = e.results[0][0].transcript;
                // console.log('e:', e);
                // Do something with the result
                // that.voiceEmit(results);
                handleSearch(results)
                vSearch.stop();
            };

            vSearch.onerror = function (e) {
                console.error('Voice recognition error:', e.error);
                vSearch.stop();
            };

            vSearch.onend = function () {
                //  that.close_btn()
                //   console.log('Voice recognition ended.');
                // You can restart recognition here if needed
                microphoneRef.current.classList.remove("listening");
            };

            vSearch.start();
        } else {
            console.log('Your browser does not support voice recognition!');
        }


    };

    const stopListening = () => {
        vSearch.stop();
        setIsListening(false);
        microphoneRef.current.classList.remove("listening");
    };

    const handleSearch = (query) => {
        // console.log('Search Query:', query);
        transcript = query
        setTranscript(transcript)
        // You can perform search-related operations here
    };

    return (
        <>
            <div className="microphone-wrapper">
                <div className="mircophone-container">
                    <div
                        className="microphone-icon-container"
                        ref={microphoneRef}
                        onClick={startListening}
                    >
                        <img src={'/microphone.svg'} className="microphone-icon" />

                    </div>
                    <div className="microphone-status">
                        {isListening ? "Listening........." : "Click to start Listening"}
                    </div>
                    {isListening && (
                        <button className="microphone-stop btn" onClick={stopListening}>
                            Stop
                        </button>
                    )}

                </div>
                {transcript && (
                    <div className="microphone-result-container">
                        <div className="microphone-result-text">{transcript}</div>
                        <button className="microphone-reset btn" onClick={stopListening}>
                            Reset
                        </button>
                    </div>
                )}
            </div>
            {/* <div className="flex items-center gap-[20px]">
                <button onClick={startListening}>Start Listening ...</button>
                <button onClick={stopListening}>Stop Listening</button>
            </div>
                <p>Transcript: {transcript}</p> */}
        </>
    )
}

export default Voice
