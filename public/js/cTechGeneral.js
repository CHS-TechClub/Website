let players = document.getElementById("players");
let groupsTab = document.getElementById("groups");

window.addEventListener("load", (event) => {
  //players
  fetch("http://108.35.196.122:8080/players")
    .then(response => response.json())
    .then((uuids) => {
      let name;
      for (const uuid of uuids) {
        fetch(`https://api.minetools.eu/uuid/${uuid}`)
          .then(res => res.json())
          .then((player) => {
            name = player.name;
            players.innerHTML += `<li class="playerTab">
              <a class="playerLink" href="/players/${uuid}">
                <div class="playerInfo rounded">
                  <img class="rounded" src="https://crafatar.com/avatars/${uuid}" alt="${name}" width="75px"> ${name}
                </div>
              </a>
            </li>`
          })
      }
    })

    //Groups
    fetch("http://108.35.196.122:8080/groups")
      .then(response => response.json())
      .then((groups) => {
        for (const group of groups) {
          groupsTab.innerHTML += `<li class="playerTab">
            <a class="playerLink" href="/groups/${group[0]}">
              <div class="playerInfo rounded p-3" style="color: ${group[1]};">
                ${group[0]}
              </div>
            </a>
          </li>`;
        }
      })
})
