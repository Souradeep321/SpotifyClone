console.log("Let's right javascript");
let currentSong = new Audio();
let songs;//Global Variable 
let currFolder;

const convertSecondsToMMSS = (seconds) => {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";  // Return default "00:00" for invalid input
    }

    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');

    return `${minutes}:${secs}`;
};

//getSongs function()
async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`  http://127.0.0.1:3000/${currFolder}/`);
    // let a = await fetch(`  http://127.0.0.1:3000/${currFolder}/`);
    let response = await a.text()
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    // console.log(as);
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currFolder}/`)[1])
        }
    }

    //play the first songs

    //Show all the songs in the playlist
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUl.innerHTML = ``
    // console.log(songUl);
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li><img class="invert" src="./images/music.svg" alt="">
                               <div class="info">
                                   <div>${song.replaceAll(" %20", " ")}</div>
                                   <div>Soura</div>
                               </div>
                               <div class="playnow">
                                   <span>playnow</span>
                                   <img class="invert" src="./images/play.svg" alt="">
                               </div></li>`;
    }

    //Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })

    // console.log(songs);
    return songs
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/Songs/" + track)
    currentSong.src = `/${currFolder}/` + track //We are Using Global variable currentsong [line no 2]
    if (!pause) {
        currentSong.play()
        play.src = "./images/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}

async function displayAlbums() {
    let a = await fetch(`  http://127.0.0.1:3000/songs/`);
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    // console.log(div);
    let anchors = div.getElementsByTagName("a")
    // console.log(anchors);
    let cardContainer = document.querySelector(".cardContainer")

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs")) {
            // console.log(e.href);  
            let folder = e.href.split("/").slice(-2)[0];
            //Get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let response = await a.json()
            // console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
            <div class="play">
              <img class="svg" src="./images/green.svg" alt="btn">
            </div>
            <img src="./Songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.Description}</p> 
          </div>`
        }
    }

    //Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // console.log(e);
        e.addEventListener("click", async (item) => {
            // console.log(item,item.currentTarget.dataset);
            songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    });

}

async function main() {
    // let currentSong  = new Audio();
    //Get the List of all Songs
    await getSongs("Songs/ncs")
    playMusic(songs[0], true)
    // console.log(songs);

    //Display all the albums on the page
    displayAlbums()


    //Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "./images/pause.svg"
        } else {
            currentSong.pause()
            play.src = "./images/play.svg"
        }
    })

    // Listen for timeUpdate event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMMSS(currentSong.currentTime)} / ${convertSecondsToMMSS(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    // add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        //   console.log(e.target.getBoundingClientRect().width,e.offsetX);
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100
    })

    //Add an event listener  for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    //Add an event listener  for close button
    document.querySelector(".closeimg").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })

    /*----------------------------------------------------------------------------------*/
    // Ensure you have the correct button elements selected
    const previous = document.querySelector("#previous"); // Make sure the button has id="previous"
    const next = document.querySelector("#next");         // Make sure the button has id="next"

    previous.addEventListener("click", () => {
        if (!songs || songs.length === 0) {
            console.error("No songs available.");
            return;
        }

        let currentFile = decodeURI(currentSong.src.split('/').pop().trim());
        console.log("Current file:", currentFile);
        console.log("Songs array:", songs);

        let index = songs.findIndex(song => {
            console.log("Checking song:", decodeURI(song), "against", currentFile);
            return decodeURI(song.trim()) === currentFile;
        });

        if (index > 0) {
            playMusic(songs[index - 1]);
        } else {
            console.log("This is the first song, no previous song available.");
        }
    });

    next.addEventListener("click", () => {
        if (!songs || songs.length === 0) {
            console.error("No songs available.");
            return;
        }
        let currentFile = decodeURI(currentSong.src.split('/').pop().trim());
        console.log("Current file:", currentFile);
        console.log("Songs array:", songs);

        let index = songs.findIndex(song => {
            console.log("Checking song:", decodeURI(song), "against", currentFile);
            return decodeURI(song.trim()) === currentFile;
        });

        if (index < songs.length - 1 && index >= 0) {
            playMusic(songs[index + 1]);
        } else {
            console.log("This is the last song, no next song available.");
        }
    });

    /*----------------------------------------------------------------------------------*/


    //Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to " + e, e.target, e.target.value + " out of 100");
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume > 0) {
            let img = document.querySelector(".volume>img")
            img.src = "./images/volume.svg"
        }
        else if (currentSong.volume == 0) {
            let img = document.querySelector(".volume>img")
            img.src = "./images/mute.svg"
        }
    })

    //Load the playlist whenever card is clicked
    //   Array.from(document.getElementsByClassName("card")).forEach(e => {
    //     // console.log(e);
    //     e.addEventListener("click", async (item) => {
    //         // console.log(item,item.currentTarget.dataset);
    //         songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`)
    //     })
    // });

    //Add Event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", (e) => {
        // console.log(e.target);
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            // e.target.src = "./images/mute.svg"
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0 //For updating the range
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            // e.target.src =  "./images/volume.svg"
            currentSong.volume = 0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10
        }
    })






}

main()




