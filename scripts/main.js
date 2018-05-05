let canvas = document.querySelector('#game')
let ctx = canvas.getContext('2d')
let image;

function Entity(img, vx, vy) {
  this.img = img;
  this.vx = vx;
  this.vy = vy;
  this.posx = 0;
  this.posy = 0;
}

let edgex = 600;
let edgey = 400;

Entity.prototype.step = function(dt) {
  let dx = this.vx * dt;
  let dy = this.vy * dt;
  this.posx += dx;
  this.posy += dy;
  if (this.posx < 0) {
    this.vx *= -1;
    this.posx *= -1;
  }
  if (this.posy < 0) {
    this.vy *= -1;
    this.posy *= -1;
  }
  if (this.posx > edgex) {
    this.vx *= -1
    this.posx = 2*edgex - this.posx
  }
  if (this.posy > edgey) {
    this.vy *= -1
    this.posy = 2*edgey - this.posy
  }
}


let entities = [];

let last = 0;
async function frame(time) {
  let dt = (time - last) / 1000;
  last = time;
  ctx.fillStyle = 'rgb(50, 100, 200)';
  ctx.fillRect(0,0,700,500);
  entities.forEach(function(e) {
    e.step(dt);
    ctx.drawImage(e.img, e.posx, e.posy, 100, 100);
  });
  requestAnimationFrame(frame);
}

async function bitmapFor(url) {
  let r = await fetch(url);
  let blob = await r.blob();
  return await createImageBitmap(blob);
}

let img_urls = [
  './assets/img/popcorn.jpg',
  './assets/img/soda.jpg',
  './assets/img/buncha.jpg'
]

function genDefs() {
  return img_urls.map(url => {
    return { url, vx: (Math.random() * 250)+50, vy:(Math.random() * 250)+50 };
  });
}

async function go() {
  let defs = genDefs();
  let imgs = await Promise.all(defs.map(d=>bitmapFor(d.url)));
  console.log(imgs);
  entities = imgs.map(function(img, idx) {
    let {vx, vy} = defs[idx];
    return new Entity(img, vx, vy);
  });
  console.log(entities);
  requestAnimationFrame(frame);
}

go();

