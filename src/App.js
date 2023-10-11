import './App.css';
import {useEffect, useRef, useState} from "react";

function App() {
    const [inputValue, setInputValue] = useState('')
    const [photos, setPhotos] = useState([])

    const inputFolder = useRef(null)

    const handleSendButton = (e) => {
        e.preventDefault()

        const data = {
            chunk_id: 0,
            paths: [ // Убери у этого объекта массив, указать можно только 1 файл
                inputValue
            ],
            // files: inputFolder.current.files <-- Добавь это поле для загрузки локальных файлов
            // Можешь посмотреть что это за объект, пропиши в области видимости handleSendButton
            // console.log(inputFolder.current.files)
        }

        // setPhotos([
        //     {
        //         "uid": 0,
        //         "file_path": "https://media.cnn.com/api/v1/images/stellar/prod/231003151938-phone-users-stock.jpg?c=16x9&q=h_720,w_1280,c_fill/f_webp",
        //         "tags": [
        //             "string"
        //         ],
        //         "text": [
        //             "string"
        //         ],
        //         "bboxes": [
        //             [
        //                 0
        //             ]
        //         ],
        //         isSelected: false
        //     },
        //     {
        //         "uid": 1,
        //         "file_path": "https://media.cnn.com/api/v1/images/stellar/prod/231003151938-phone-users-stock.jpg?c=16x9&q=h_720,w_1280,c_fill/f_webp",
        //         "tags": [
        //             "string"
        //         ],
        //         "text": [
        //             "string"
        //         ],
        //         "bboxes": [
        //             [
        //                 0
        //             ]
        //         ],
        //         isSelected: false
        //     }
        // ])

        fetch('http://127.0.0.1:8000/api/process-image', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                console.log(data)
                setPhotos(data.results)
            })
    };

    const clickPhoto = (e, uid) => {
        setPhotos(prevState => prevState.map(photo => (
                photo.uid === uid
                    ? {...photo, isSelected: !photo.isSelected}
                    : {...photo}
            )
        ))
    }

    const sendDuplicate = (e) => {
        e.preventDefault()
        const data = photos.filter(photo => photo.isSelected)
        fetch('http://127.0.0.1:8000/api/', { // напиши название метода для отправки фото с дубликатами
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                console.log('Дубликаты отправлены')
            })
    };

    return (
        <div className="App">
            <div>
                <input type="text"
                       onChange={(e) => setInputValue(e.target.value)}
                />
                <input type="file" ref={(node) => {
                    inputFolder.current = node;
                    if (node) {
                        ['webkitdirectory', 'directory', 'mozdirectory'].forEach((attr) => {
                            node.setAttribute(attr, '');
                        });
                    }
                }}/>
                <button onClick={handleSendButton}>Отправить</button>
            </div>
            <div>
                {photos.map(photo => (
                    photo.isSelected
                        ?
                            <img src={photo.file_path} alt="" key={photo.uid}
                                 style={{
                                     width: '300px',
                                     border: '2px solid red'
                                 }}
                                 onClick={(e) => clickPhoto(e, photo.uid)}
                            />
                        :
                            <img src={photo.file_path} alt="" key={photo.uid}
                                 style={{
                                     width: '300px',
                                 }}
                                 onClick={(e) => clickPhoto(e, photo.uid)}
                            />
                ))}
            </div>
            {photos &&
                <button onClick={sendDuplicate}>Отправить дубликаты</button>}
        </div>
    );
}

export default App;
