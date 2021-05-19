let staffSection = document.getElementById("staffList")

window.addEventListener('load', (event) => {
  fetch("/api/staff")
  .then(response => response.json())
  .then((staffTeam) => {
    for (const staff of staffTeam) {
      let staffCard = `
      <li>
        <div class="row box-staff w-100">
          <div class="col-sm-3 bg-black">
            <img src="${staff.imgPath}" alt="image" class="rounded w-100 staff-image">
          </div>

          <div class="col-sm-6">
            <ul class="point-less" style="font-size: 30px;">
              <li><strong>Name:</strong> ${staff.name}</li>
              <li><strong>Email:</strong> ${staff.email}</li>
              <li><button class="btn btn-danger" style="font-size: 20px;">Delete</button></li>
            </ul>
          </div>
        </div>
      </li>
      `;
      staffSection.insertAdjacentHTML("afterBegin", staffCard);
    }
  })
})
