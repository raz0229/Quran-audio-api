let global_index=0

function showSurah(data) {
    let ListOfSurah = document.getElementById('ListOfSurah')
    let HTML = ''
    data.forEach(element => {
        HTML += `
        <button  id='${element.number}' class=" surah list-group-item list-group-item-action bg-light text-dark ">
        <div class="d-flex w-100 justify-content-between">
          
          <small class="text-muted"> <span class="badge bg-success badge-pill ">${element.number}</span> Number Of Ayahs ${element.numberOfAyahs}</small>
          <h5 class="mb-1 Quran-surha">${element.name}</h5>
        </div>
        <p class="mb-1 surhaEnglishName">${element.englishName}</p>
        <small class="text-muted">${element.englishNameTranslation}</small>
        </button>`
    })
    if (ListOfSurah) {
        ListOfSurah.innerHTML = HTML
    }
}


const URL = 'https://api.alquran.cloud/v1/surah'
fetch(URL).then(response => response.json()).then(data => {
    // console.log(data.data);
    showSurah(data.data)
    getSurah()

}).catch(err => {
    alert(err)
    let errorAlert = document.getElementById('errorAlert').innerHTML `<div class="alert alert-dark" role="alert">
   Failed to fetch <a href='/'> Retry</a> 
  </div>`
})

function getSurah() {
    let AllSurah = document.querySelectorAll('.list-group-item')
    AllSurah.forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.getElementById('ListOfSurah').style.display = 'none'
            container = document.getElementById('container').style.display = 'block'
            mainAudioPlayer = document.getElementById('mainAudioPlayer').style.display = 'flex'
            Back_button = document.getElementById('w-actions').style.display = 'flex'

            const Id = btn.id



            let limit = 0
            let he = container.offsetHeight  - container.clientHeight + "px"
            if(he == 7){
                limit += 1
            }
            
            fetch(`https://api.alquran.cloud/v1/surah/${Id}/editions/ar.alafasy,en.asad,ur.jalandhry?limit=${limit}`).then(response => response.json()).then(data => {
                let audio_data = data.data[0];
                let en_translation = data.data[1];
                let ur_translation = data.data[2]

                // console.log(data.data[0]);
                surahDatiles(audio_data,en_translation,ur_translation)
            })
         
       
        })
    })
}

function ayahHandler(verseNo) {
    global_index = verseNo - 1;
}

function surahDatiles(audio_data,en_translation,ur_translation) {
    let container = document.getElementById('container')
    
     en_translation.ayahs.forEach((element,index)=>{
        audio_data.ayahs[index].en_translation  = element.text
    })
     
     ur_translation.ayahs.forEach((element,index)=>{
        audio_data.ayahs[index].ur_translation = element.text
    })
    console.log(audio_data.ayahs)
    let html = ''
    audio_data.ayahs.forEach((element, index,array) => {
       // console.log(element)
        html += ` <div class="card text-center mb-3 bg-light">
        <div class="card-header">
            <a  href="#ayah${index + 1}" id="ayahsNo${index}" onclick='ayahHandler(${index})' class="card-title btn btn-outline-secondary" >آیت${index + 1}</a> 
            </div>
            <div class="card-body bg-light" id='ayah${index + 1}'>
            <h5 class="card-title Quran-ayah " id="text-${index}">${element.text}</h5>
            <p class="card-title Quran-ayah " >${element.en_translation}</p>
            <p class="card-title Quran-ayah " >${element.ur_translation}</p>
            <audio src='${element.audio}'></audio>
            <a  href="#" id='${index}'  class="card-title  ayahs " data-url="${element.audio}"></a>
            </div>
            <div class="card-footer text-muted">
            Ruku - ${element.ruku} | juz - ${element.juz} | Page - ${element.page} | Manzil - ${element.manzil} - 
            </div>
        </div>
`
    })
    let _dev = document.createElement('div');
    _dev.innerHTML =  html
    container.appendChild(_dev)


    const ayahsArray = document.getElementsByClassName('ayahs')
    let i = global_index
    let player = document.getElementById('player')
    player.src = ayahsArray[i].getAttribute('data-url')
    document.getElementById(`text-${i}`).style.color = 'green'

    // my contribution
    // document.getElementById(`ayahsNo${i}`).addEventListener('click', ()=> {
    //     console.log(i, ' ayah clicked!!!')
    // })

    player.addEventListener('ended', () => {
        if ( global_index !==0 ) {
            i=global_index
            global_index=0
        }
            
        document.getElementById(`text-${i}`).style.color = 'black'
        i++;
        if (i < ayahsArray.length) {

            player.src = ayahsArray[i].getAttribute('data-url');
            document.getElementById(`text-${i}`).style.color = 'green'
            //document.getElementById(`ayahsNo${i}`).click()
                // ayahsArray[i]
            return;
        }
        i = 0;
        player.src = ayahsArray[i].getAttribute('data-url');
        document.getElementById(`text-${i}`).style.color = 'green'
        //document.getElementById(`ayahsNo${i}`).click()
    })
}



let BackBtn = document.getElementById('back').addEventListener('click', () => {
    window.location = 'index.html'
})
const audioTag = document.querySelector('audio')
const currentTimeTag = document.querySelector('.current')
const durationTag = document.querySelector('.total')
const fillDuration = document.querySelector('.fill-duration')

const startTimer = () => {
    const duration = parseInt(audioTag.duration)
    const strTime = (currentTime) => {
        let hour = undefined
        let minutes = undefined
        let seconds = undefined
        seconds = (currentTime % 60)
        minutes = parseInt(currentTime / 60)
        if (minutes >= 60) {
            hour = (minutes / 60)
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        const returningTime = `${hour ? hour + ":" : ""}${minutes ? minutes + ":" : "00:"}${seconds}`
            // console.log(returningTime);
        return returningTime
    }
    durationTag.innerText = strTime(duration)
    setInterval(() => {
        const duration = parseInt(audioTag.duration)
        const currentTime = parseInt(audioTag.currentTime)
        const time = (currentTime / duration) * 100
        const currentTimeInStr = strTime(currentTime)
        currentTimeTag.innerText = currentTimeInStr
        fillDuration.style.width = `${time}%`

    }, 1000)
}



audioTag.addEventListener('loadeddata', startTimer)
    // startTimer()
let controls = document.getElementById("controls")


const pause = document.getElementById("pause")


pause.addEventListener('click', () => {

    audioTag.pause()

})

const play = document.getElementById("play")

play.addEventListener('click', () => {
    audioTag.play()


})

let prayerTimes = document.getElementById('prayerTimes')
let todaysDate = new Date().getDate()
let month = new Date().getMonth() + 1
let year = new Date().getFullYear()
prayerTimes.addEventListener('click', (e) => {

    navigator.geolocation.getCurrentPosition(showPosition);

    function showPosition(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude
        let URL = `https://api.aladhan.com/timings/${todaysDate}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=1`




        fetch(URL).then(response => response.json()).then(response => {
            let dateReadable = document.getElementById('dateReadable').innerHTML = response.data.date.readable
            let html = ''
            for (const [key, value] of Object.entries(response.data.timings)) {
                html += ` <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">${key}</div>
                ${key}
            </div>
            <span class="badge bg-success p-2 rounded-pill">${value}</span>
        </li>`
            }

            let _times = document.getElementById('_times').innerHTML = html


        }).catch(err => {
            let _times = document.getElementById('_times').innerHTML = `<h1 class='mx-auto'> Failed to fetch <a href='/'> Retry</a> </h1>`
        })
    }
})