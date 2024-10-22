console.log("Let's right javascript");


async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text()
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    console.log(as);
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(/songs/)[1])
        }
    }
    // console.log(songs);
    return songs
}

async function main() {
    //Get the List of all Songs
    let song = await getSongs()
    // let songs = Array.from(song)
    // console.log(song);

    //Show all the songs in the playlist
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    console.log(songUl);
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li><img class="invert" src="./images/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Soura</div>
                            </div>
                            <div class="playnow">
                                <span>playnow</span>
                                <img class="invert" src="./images/play.svg" alt="">
                            </div></li>`;
    }


    // play the first song 
    var audio = new Audio(songs[1]);
    audio.play(); 

    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration;
        console.log(audio.duration, audio.currentSrc, audio.currentTime);
        // The duration variable now holds the duration (in seconds) of the audio clip
    });

      /* Didn't work this section
       //Add an event listener to previous
       // previous.addEventListener("click", () => {
       //     let index = songs.indexOf(currentSong.src.split("/").slice(1)[0])
   
       //     console.log(songs,index)
       //     if([index-1] >= 0){
       //         playMusic(songs[index-1])
       //     }
       // })
   
       
          //Add an event listener to next
          next.addEventListener("click", () => {
           let index = songs.indexOf(currentSong.src.split("/").slice(1)[0])
   
           console.log(songs,index)
           if([index+1] > length){
               playMusic(songs[index+1])
           }
       })
   */
}