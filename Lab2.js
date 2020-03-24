/* eslint-disable camelcase */
/* eslint-disable max-len */
'use strict';
const orGraf = {};
const graf = {};
const loops = [];
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.font = '17px Times new Roman';
ctx.textBaseline = 'middle';
ctx.textAlign = 'center';




const A = [
  [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
const r = 15;
const rloops = 3 * r / 4;
const arrr = 5;


const calcVertics = (n, P, x0, y0, obj) => {

  const step = P / n;
  const side = P / 3;
  let left = 0;
  let vert = 1;
  let newX = x0;
  let newY = y0;

  ctx.beginPath();
  ctx.setLineDash([5, 15]);
  ctx.moveTo(x0, y0);

  ctx.lineTo(x0 + side / 2, y0 - side * Math.sin(Math.PI / 3));
  ctx.lineTo(x0 + side, y0);
  ctx.lineTo(x0, y0);
  ctx.stroke();

  ctx.setLineDash([]);

  for (let curMargin = 0; curMargin <= side; curMargin += step) {
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num: vert,
      },
      enumerable: true,
      writable: true
    });
    newX += step * Math.cos(Math.PI / 3);
    newY += -step * Math.sin(Math.PI / 3);
    left = side - curMargin;
    vert++;
  }

  newX = x0 + side / 2;
  newY = y0 - side * Math.sin(Math.PI / 3);

  for (let curMargin = left; curMargin <= side; curMargin += step) {
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num: vert,
      },
      enumerable: true,
      writable: true
    });
    newX += step * Math.cos(Math.PI / 3);
    newY += step * Math.sin(Math.PI / 3);
    left = side - curMargin;
    vert++;
  }

  newX = x0 + side;
  newY = y0;

  for (vert; vert <= n; vert++) {
    newX += -step;

    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num: vert,
      },
      enumerable: true,
      writable: true
    });
  }
};

calcVertics(11, 1600, 50, 520, orGraf);
calcVertics(11, 1600, 650, 520, graf);

const makeCons = (matrix, obj) => {
  for (const key in obj) {
    obj[key].simple = [];
    obj[key].double = [];
  }
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j]) {
        const names = [`vert${i + 1}`, `vert${j + 1}`];
        if (i === j) loops.push(`vert${i + 1}`);
        else if (!matrix[j][i]) {
          obj[names[0]].simple.push(`vert${j + 1}`);
        } else {
          obj[names[0]].double.push(`vert${j + 1}`);
        }
      }
    }
  }
};
const center = (x0, y0, p) => {
  const x = x0 + p / 6;
  const y = y0 + p / 6;
  return {
    x,
    y
  };
};

const drawLoops = (arr, obj, x0, y0) => {
  let alpha;
  const xc = center(x0, y0, 1600).x;
  const yc = center(x0, y0, 1600).y;
  for (const i in arr) {
    alpha = Math.atan2(obj[arr[i]].coords[1] - yc, obj[[arr[i]]].coords[0] - xc);
    const R = Math.sqrt((obj[arr[i]].coords[0] - xc) ** 2 + (obj[arr[i]].coords[1] - yc) ** 2) + r;
    const xloops = xc + R * Math.cos(alpha);
    const yloops = yc + R * Math.sin(alpha);
    ctx.beginPath();
    ctx.arc(xloops, yloops, rloops, 0, 2 * Math.PI, false);
    ctx.stroke();
  }
};

function drawArrowhead(x0, y0, x1, y1, radius, fillStyle = 'white', strokestyle = 'black') {
  const xCenter = x1;
  const yCenter = y1;
  let angle;
  let x;
  let y;
  ctx.fillStyle = fillStyle;
  ctx.strokestyle = strokestyle;
  ctx.beginPath();
  angle = Math.atan2(y1 - y0, x1 - x0);
  x = radius * Math.cos(angle) + xCenter;
  y = radius * Math.sin(angle) + yCenter;

  ctx.moveTo(x, y);
  angle += (1.0 / 3.0) * (2 * Math.PI);
  x = radius * Math.cos(angle) + xCenter;
  y = radius * Math.sin(angle) + yCenter;
  ctx.lineTo(x, y);

  angle += (1.0 / 3.0) * (2 * Math.PI);
  x = radius * Math.cos(angle) + xCenter;
  y = radius * Math.sin(angle) + yCenter;
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

const readyCons = (x0, y0, x1, y1) => {
  const step = 1;
  const alpha = Math.atan2(y1 - y0, x1 - x0);
  const dx = step * Math.cos(alpha);
  const dy = step * Math.sin(alpha);
  let x = x0;
  let y = y0;
  while (true) {
    x += dx;
    y += dy;
    if (Math.sqrt((x1 - x) ** 2 + (y1 - y) ** 2) < r + arrr) break;
  }
  const res = {
    x,
    y
  };
  return res;
};

function singleAdditionalDots(x0, y0, x1, y1) {
  const alpha = Math.atan2(y1 - y0, x1 - x0);
  return {
    dx: (r * 3) * Math.cos(Math.PI / 2 - alpha),
    dy: (r * 5) * Math.sin(Math.PI / 2 - alpha)
  };
}

function doubleAdditionalDots(x0, y0, x1, y1) {
  const alpha = Math.atan2(y1 - y0, x1 - x0);
  return {
    dx: (r * 1.15) * Math.cos(Math.PI / 2 - alpha),
    dy: (r * 2.4) * Math.sin(Math.PI / 2 - alpha)
  };
}

const singleDirected = obj => {
  for (const key in obj) {
    for (let i = 0; i < obj[key].simple.length; i++) {
      const fromX = obj[key].coords[0];
      const fromY = obj[key].coords[1];
      const toX = obj[`${obj[key].simple[i]}`].coords[0];
      const toY = obj[`${obj[key].simple[i]}`].coords[1];


      if (Math.abs(obj[key].num - obj[`${obj[key].simple[i]}`].num) === 1 || Math.abs(obj[key].num - obj[`${obj[key].simple[i]}`].num) === (Object.keys(obj).length - 1)) {
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        const coordinates = readyCons(fromX, fromY, toX, toY);
        drawArrowhead(fromX, fromY, coordinates.x, coordinates.y, arrr);
      } else {
        const { dx, dy } = singleAdditionalDots(fromX, fromY, toX, toY);
        let newX = (fromX + toX) / 2;
        let newY = (fromY + toY) / 2;
        newX -= dx;
        newY += dy;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(newX, newY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        const coordinates = readyCons(newX, newY, toX, toY);
        drawArrowhead(newX, newY, coordinates.x, coordinates.y, arrr);
      }
    }
  }
};

const bothDirected = obj => {
  for (const key in obj) {
    for (let i = 0; i < obj[key].double.length; i++) {

      const fromX = obj[key].coords[0];
      const fromY = obj[key].coords[1];
      const toX = obj[`${obj[key].double[i]}`].coords[0];
      const toY = obj[`${obj[key].double[i]}`].coords[1];

      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      const { dx, dy } = doubleAdditionalDots(fromX, fromY, toX, toY);
      let newX = (fromX + toX) / 2;
      let newY = (fromY + toY) / 2;
      newX += dx;
      newY -= dy;
      ctx.lineTo(newX, newY);
      ctx.lineTo(toX, toY);
      ctx.stroke();
      const coordinates = readyCons(newX, newY, toX, toY);
      drawArrowhead(newX, newY, coordinates.x, coordinates.y, arrr);
    }
  }
};

const single = obj => {
  for (const key in obj) {
    for (let i = 0; i < obj[key].simple.length; i++) {
      const fromX = obj[key].coords[0];
      const fromY = obj[key].coords[1];
      const toX = obj[`${obj[key].simple[i]}`].coords[0];
      const toY = obj[`${obj[key].simple[i]}`].coords[1];


      if (Math.abs(obj[key].num - obj[`${obj[key].simple[i]}`].num) === 1 || Math.abs(obj[key].num - obj[`${obj[key].simple[i]}`].num) === (Object.keys(obj).length - 1)) {
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
      } else {
        const { dx, dy } = singleAdditionalDots(fromX, fromY, toX, toY);
        let newX = (fromX + toX) / 2;
        let newY = (fromY + toY) / 2;
        newX -= dx;
        newY += dy;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(newX, newY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
      }
    }
  }
};

const both = obj => {
  for (const key in obj) {
    for (let i = 0; i < obj[key].double.length; i++) {

      const fromX = obj[key].coords[0];
      const fromY = obj[key].coords[1];
      const toX = obj[`${obj[key].double[i]}`].coords[0];
      const toY = obj[`${obj[key].double[i]}`].coords[1];


      if (fromX + fromY > toX + toY) {
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);

        const { dx, dy } = doubleAdditionalDots(fromX, fromY, toX, toY);
        let newX = (fromX + toX) / 2;
        let newY = (fromY + toY) / 2;
        newX += dx;
        newY -= dy;
        ctx.lineTo(newX, newY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
      }
    }
  }
};

const drawVertex = obj => {
  for (const key in obj) {
    ctx.beginPath();
    ctx.arc(obj[key].coords[0], obj[key].coords[1], r, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'grey';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.strokeText(obj[key].num, obj[key].coords[0], obj[key].coords[1]);
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }
};



const exitCount = (obj, loops) => {
  ctx.font = '24px Times new Roman';
  ctx.fillStyle = 'black';
  ctx.fillText('Outside', 300, 650);
  ctx.stroke();
  for (const key in obj) {
    const name = `vert${obj[key].num}`;
    obj[key].exit = obj[key].simple.length + obj[key].double.length;

    if (loops.includes(`vert${obj[key].num}`)) obj[key].exit++;
    ctx.fillText(`${name} : ${obj[key].exit}`, 300, 650 + obj[key].num * 25);
  }
};

const entranceCount = (obj, loops) => {
  ctx.font = '24px Times new Roman';
  ctx.fillStyle = 'black';
  ctx.fillText('Inside', 600, 650);
  ctx.stroke();
  for (const key in obj) {
    const name = `vert${obj[key].num}`;
    obj[key].entrance = 0;
    if (loops.includes(name)) obj[key].entrance++;
    for (const j in obj) {
      if (obj[j].simple.includes(name)) obj[key].entrance++;
      if (obj[j].double.includes(name)) obj[key].entrance++;
    }
    ctx.fillText(`${name} : ${obj[key].entrance}`, 600, 650 + obj[key].num * 25);
  }
};


const degree = (obj, loops) => {
  ctx.font = '24px Times new Roman';
  ctx.fillStyle = 'black';
  ctx.fillText('Degrees', 900, 650);
  ctx.stroke();
  for (const key in obj) {
    const name = `vert${obj[key].num}`;
    obj[key].degree = obj[key].simple.length;
    if (loops.includes(name)) obj[key].degree += 2;
    for (const j in obj) {
      if (obj[j].simple.includes(name)) obj[key].degree++;
      if (obj[j].double.includes(name)) obj[key].degree++;
    }
    ctx.fillText(`${name} : ${obj[key].degree}`, 900, 650 + obj[key].num * 25);
    ctx.stroke();
  }
};

const isolated = obj => {
  const res = [];
  for (const key in obj) {
    if (obj[key].degree === 0) {
      obj[key].isolated = true;
      res.push(`vert${obj[key].num}`);
    }
  }
  if (res.length === 0) {
    ctx.fillText('There are no isolated vertics', 600, 1000);
    ctx.stroke();
  } else {
    ctx.fillText(`Isolated vertics: ${res}`, 600, 1000);
    ctx.stroke();
  }
};

const hanging = obj => {
  const res = [];
  for (const key in obj) {
    if (obj[key].degree === 1) {
      obj[key].hanging = true;
      res.push(`vert${obj[key].num}`);
    }
  }
  if (res.length === 0) {
    ctx.fillText('There are no hanging vertics', 600, 1050);
    ctx.stroke();
  } else {
    ctx.fillText(`Hanging vertics: ${res}`, 600, 1050);
    ctx.stroke();
  }
};


const regular = obj => {
  const comparable = obj.vert1.degree;
  let regularity = 'Graph is regular';
  for (const key in obj) {
    if (obj[key].degree !== comparable) regularity = 'Graph is not regular';
  }
  ctx.fillText(regularity, 600, 1100);
  ctx.stroke();
};









makeCons(A, orGraf);
makeCons(A, graf);
drawLoops(loops, orGraf, 75, 100);
drawLoops(loops, graf, 675, 100);
singleDirected(orGraf);
both(graf);
single(graf);
bothDirected(orGraf);
drawVertex(orGraf);
drawVertex(graf);


exitCount(orGraf, loops);
entranceCount(orGraf, loops);
degree(orGraf, loops);
isolated(orGraf);
hanging(orGraf);
regular(orGraf);
