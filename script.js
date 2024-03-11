let fr = new FileReader();
let data;
let temp = "level";
let height = 0;
let enemies = [];
let obstacles = [];
let map = new Map();

const pattern = /(?<=Tiles\/).*?(?=\.tsx)/;

fr.onload = () => {
  let data = JSON.parse(fr.result);
  data.tilesets.forEach(tile => map.set(tile.firstgid, tile.source.match(pattern)[0]));

  const width = data.layers[0].width;
  const matrix = data.layers[0].data;
  let start = -1;

  for (let i = matrix.length; i >= 0; i--) {
    switch (map.get(matrix[i])) {
      case undefined:
        continue;
      case 'finish':
        height = 3 * Math.floor((matrix.length - i) / width);
        break;
      case 'obstacle':
        if (start === -1) start = i;
        if (i - 1 % width === 0 || map.get(matrix[i - 1]) !== 'obstacle') {
          obstacles.push({
            "type": "branch",
            "x": 3 * (i % width),
            "y": 3 * Math.floor((matrix.length - i) / width),
            "width": 3 * (start - i + 1),
          });
          start = -1;
        }
        break;
      default:
        enemies.push({
          "type": map.get(matrix[i]),
          "x": 3 * (i % width),
          "y": 3 * Math.floor((matrix.length - i) / width),
        });
        break;
    }
  }

  let level = {
    "name": temp,
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
}