
async function displayAlbums() {
    try {
        let a = await fetch(`http://127.0.0.1:3000/songs/`);
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;

        let anchors = div.getElementsByTagName("a");
        let cardContainer = document.querySelector(".cardContainer");
        cardContainer.innerHTML = ""; // Clear the container before adding new albums

        let array = Array.from(anchors);

        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            if (e.href.includes("/songs")) {
                let folder = e.href.split("/").slice(-2)[0]; // Get folder name

                try {
                    // Fetch metadata for each folder (info.json)
                    let metadata = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
                    let response = await metadata.json();

                    // Create album card
                    cardContainer.innerHTML += `
                        <div data-folder="${folder}" class="card">
                            <div class="play">
                                <img class="svg" src="./images/btn.svg" alt="btn">
                            </div>
                            <img src="./Songs/${folder}/cover.jpg" alt="Cover Image">
                            <h2>${response.title}</h2>
                            <p>${response.Description}</p>
                        </div>`;
                } catch (error) {
                    console.error(`Error fetching metadata for folder ${folder}:`, error);
                }
            }
        }

        // Add event listeners to each card
        attachAlbumClickListeners();
    } catch (error) {
        console.error("Error fetching album list:", error);
    }
}

function attachAlbumClickListeners() {
    // Add click event listeners to the album cards after they are loaded
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async (item) => {
            const folder = item.currentTarget.dataset.folder;
            console.log(`Loading songs from folder: ${folder}`);
            await getSongs(`songs/${folder}`); // Corrected folder path for fetching songs
        });
    });
}