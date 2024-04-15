let fr = new FileReader();
let data;
let temp = "level";
let background = "background";
let height = 0;
let enemies = [];
let obstacles = [];
let map = new Map();
let branchSize = {
  "branch-left-medium": 6,
  "branch-right-medium": 6,
  "branch-center-medium": 4,
  "branch-left-long": 9,
  "branch-right-long": 9,
};

const pattern = /(?<=Tiles\/).*?(?=\.tsx)/;

fr.onload = () => {
  let data = JSON.parse(fr.result);
  data.tilesets.forEach(tile => map.set(tile.firstgid, tile.source.match(pattern)[0]));

  const width = data.layers[0].width;
  const matrix = data.layers[0].data;

  for (let i = matrix.length; i >= 0; i--) {
    const tile = map.get(matrix[i]);
    if (tile === undefined) {
      continue;
    } else if (tile.includes('branch')) {
      obstacles.push({
        "type": tile,
        "x": 3 * (i % width),
        "y": 3 * Math.floor((matrix.length - i) / width),
        "width": 3 * branchSize[tile],
      });
    } else if (tile === 'finish') {
      height = 3 * Math.floor((matrix.length - i) / width);
    } else {
      enemies.push({
        "type": tile,
        "x": 3 * (i % width),
        "y": 3 * Math.floor((matrix.length - i) / width),
      });
    }
  }

  let level = {
    "name": temp,
    "background": background,
    "enemies": enemies,
    "enemies_count": enemies.length,
    "obstacles_count": obstacles.length,
    "obstacles": obstacles,
    "finish_height": height,
  };

  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(level, null, 4));
  let dlAnchorElem = document.getElementById('downloadAnchorElem');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", `${temp}.json`);
}

document.getElementById('inputfile').onchange = (e) => {
  fr.readAsText(e.target.files[0]);
}

document.getElementById('submit').onclick = (e) => {
  document.getElementById('form').style.display = "block";
  document.getElementById('submitDiv').style.display = "none";

  temp = document.getElementById('name').value;
  background = document.getElementById('background').value;
}