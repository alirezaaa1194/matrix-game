const container = document.querySelector(".container");
const increaseBtn = document.querySelector(".increase-btn");
const levelLabel = document.querySelector(".level-label");
const timeLabel = document.querySelector(".time-label");
const musicLabel = document.querySelector(".music-label");

const musics = ["آخ برم راننده رو...", "اون کلاچ و دنده رو...", "گاز و فرمونو ببین...", "شور و حال بنده رو..."];
let musicCounter = 0;

let ratio = 4;
let rnd = null;
let counter = 0;
let isStart = false;
let time = 10;

let allAlgorithmNums = [];
let allAlgorithmZarb = [];

let maxNumInAlgorithm = null;

let userZarb = [];
let myTimer = null;
const timeHandler = () => {
  time = 10;
  timeLabel.innerHTML = time;
  musicLabel.innerHTML = musics[0];

  myTimer = setInterval(() => {
    //music
    if (time % 2 === 0) {
      if (musicCounter < musics.length) {
        musicLabel.innerHTML = musics[musicCounter];
        musicCounter++;
      } else {
        musicCounter = 0;
      }
    }
    if (ratio >= 4) {
      if (time > 0) {
        time--;
        timeLabel.innerHTML = time;

        if (time <= 4) {
          timeLabel.classList.add("hint");
        } else {
          timeLabel.classList.remove("hint");
        }
      } else {
        if (ratio > 4) {
          ratio--;
          squareGenerator();
        } else {
          alert("Game Over");
          clearInterval(myTimer);
          location.reload();
        }
      }
    }
  }, 1000);
};

const squareGenerator = () => {
  clearInterval(myTimer);
  container.innerHTML = "";
  levelLabel.innerHTML = ratio;
  container.style.gridTemplateColumns = `repeat(${ratio}, 1fr)`;
  counter = 0;
  isStart = false;
  userZarb = [];
  timeLabel.classList.remove("hint");
  timeHandler();

  for (let i = 0; i < ratio; i++) {
    for (let j = 0; j < ratio; j++) {
      rnd = Math.floor(Math.random() * 100);
      counter++;
      container.insertAdjacentHTML("beforeend", `<span data-num="${rnd}" id="${counter}">${rnd}</span>`);
      // <sup>${counter}</sup>
    }
  }
  findMaxNum();
  findMaxZarb();
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
const findMaxNum = () => {
  let spans = document.querySelectorAll("span");

  let spanNum = null;
  let spanId = null;

  let filteredSpansX = [];
  let spanIndexY = null;
  let filteredSpansY = [];
  let filteredSpansZ = [];
  spans.forEach((span) => {
    spanNum = span.dataset.num;
    spanId = span.id;

    span.addEventListener(
      "click",
      () => {
        if (!isStart) {
          if (!span.className.includes("off") && !span.className.includes("submit")) {
            span.classList.add("submit");
            isStart = true;
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // find X Neighborhood
            filteredSpansX = Array.from(spans).filter((span2) => {
              span2.setAttribute("data-x", Math.ceil(span2.id / ratio));
              return Math.ceil(span.id / ratio) === Math.ceil(span2.id / ratio);
            });

            // find Y Neighborhood
            spanIndexY = filteredSpansX.findIndex((span2) => {
              return span2.id === span.id;
            });
            spanIndexY += 1;

            filteredSpansY = Array.from(spans).filter((span2) => {
              span2.setAttribute("data-y", span2.id % ratio || ratio);
              return span2.id % ratio === spanIndexY;
            });
            if (!filteredSpansY.length) {
              filteredSpansY = Array.from(spans).filter((span2) => {
                return span2.id % ratio === 0;
              });
            }

            //   find Z Neighborhood
            filteredSpansZ = Array.from(spans).filter((span2) => {
              return span.dataset.x - span2.dataset.x === span.dataset.y - span2.dataset.y;
            });

            let filteredSpansZ2 = Array.from(spans).filter((span2) => {
              return span.dataset.x - span2.dataset.x === -(span.dataset.y - span2.dataset.y);
            });

            // if (filteredSpansZ.length >= 1) {
            //   filteredSpansZ = filteredSpansZ;
            // } else if (filteredSpansZ.length === filteredSpansZ2.length) {
            //   filteredSpansZ = Array.from(new Set(filteredSpansZ.concat(filteredSpansZ2)));
            // } else {
            //     filteredSpansZ = filteredSpansZ2;
            // }

            if (filteredSpansZ.length == 4) {
              filteredSpansZ = filteredSpansZ;
            } else if (filteredSpansZ2.length == 4) {
              filteredSpansZ = filteredSpansZ2;
            } else {
              filteredSpansZ = Array.from(new Set(filteredSpansZ.concat(filteredSpansZ2)));
            }
            let x2 = [];
            let y2 = [];
            let z2 = [];

            // filteredSpansZ = Array.from(new Set(filteredSpansZ.concat(filteredSpansZ2)));

            //             x2 = filteredSpansX.splice(filteredSpansX.indexOf(span, 1));
            //             filteredSpansX.push(span);
            // filteredSpansX.reverse()
            //             filteredSpansX = filteredSpansX.slice(0, 4);
            // filteredSpansY = filteredSpansY.slice(0, 4);
            // filteredSpansZ = filteredSpansZ.slice(0, 4);

            // console.log(filteredSpansX);

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////

            //   console.log(`filter X => `, filteredSpansX);
            //   console.log(`filter Y => `, filteredSpansY);
            //   console.log(`filter Z => `, filteredSpansZ);

            userZarb.push(+span.dataset.num);
            handleMatch(filteredSpansX, filteredSpansY, filteredSpansZ, span);
          }
        } else if (userZarb.length < ratio && !span.className.includes("off") && !span.className.includes("submit")) {
          userZarb.push(+span.dataset.num);
          span.classList.add("submit");
          handleMatch(filteredSpansX, filteredSpansY, filteredSpansZ, span);
        }
      },

      { once: true }
    );
  });
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
const findMaxZarb = () => {
  let spans = document.querySelectorAll("span");

  let filteredSpansX = [];
  let spanIndexY = null;
  let filteredSpansY = [];
  let filteredSpansZ = [];

  spans.forEach((span) => {
    // find X Neighborhood
    filteredSpansX = Array.from(spans).filter((span2) => {
      span2.setAttribute("data-x", Math.ceil(span2.id / ratio));
      return Math.ceil(span.id / ratio) === Math.ceil(span2.id / ratio);
    });

    // find Y Neighborhood
    spanIndexY = filteredSpansX.findIndex((span2) => {
      return span2.id === span.id;
    });
    spanIndexY += 1;

    filteredSpansY = Array.from(spans).filter((span2) => {
      span2.setAttribute("data-y", span2.id % ratio || ratio);
      return span2.id % ratio === spanIndexY;
    });
    if (!filteredSpansY.length) {
      filteredSpansY = Array.from(spans).filter((span2) => {
        return span2.id % ratio === 0;
      });
    }

    //   find Z Neighborhood
    filteredSpansZ = Array.from(spans).filter((span2) => {
      return span.dataset.x - span2.dataset.x === span.dataset.y - span2.dataset.y;
    });

    let filteredSpansZ2 = Array.from(spans).filter((span2) => {
      return span.dataset.x - span2.dataset.x === -(span.dataset.y - span2.dataset.y);
    });

    if (filteredSpansZ.length >= 4) {
      filteredSpansZ = filteredSpansZ;
    } else if (filteredSpansZ.length === filteredSpansZ2.length) {
      filteredSpansZ = Array.from(new Set(filteredSpansZ.concat(filteredSpansZ2)));
    } else {
      filteredSpansZ = filteredSpansZ2;
    }

    let x2 = [];
    let y2 = [];
    let z2 = [];

    // filteredSpansX = filteredSpansX.slice(0, 4);
    // filteredSpansY = filteredSpansY.slice(0, 4);
    // filteredSpansZ = filteredSpansZ.slice(0, 4);

    filteredSpansX.forEach((filterX) => x2.push(+filterX.dataset.num));
    filteredSpansY.forEach((filterY) => y2.push(+filterY.dataset.num));
    filteredSpansZ.forEach((filterZ) => z2.push(+filterZ.dataset.num));

    allAlgorithmNums.push(x2);
    allAlgorithmNums.push(y2);
    allAlgorithmNums.push(z2);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  });

  allAlgorithmNums.forEach((nums) => {
    let zarb = nums.reduce((prev, cur) => prev * cur);
    allAlgorithmZarb.push(zarb);
  });
  allAlgorithmZarb = Array.from(new Set(allAlgorithmZarb));

  maxNumInAlgorithm = [...allAlgorithmZarb];
  maxNumInAlgorithm.sort((a, b) => a - b);
  // console.log(maxNumInAlgorithm);
  maxNumInAlgorithm = maxNumInAlgorithm[maxNumInAlgorithm.length - 1];
};

const handleMatch = (x, y, z, mainSpan) => {
  let allMatchedSpans = x.concat(y, z);
  let spans = document.querySelectorAll("span");

  spans.forEach((span) => {
    if (!allMatchedSpans.includes(span)) {
      span.classList.add("off");
    }
  });

  if (!x.includes(mainSpan)) {
    x.forEach((span) => span.classList.add("submit"));
  } else {
  }
  if (!y.includes(mainSpan)) {
    y.forEach((span) => span.classList.add("submit"));
  } else {
  }
  if (!z.includes(mainSpan)) {
    z.forEach((span) => span.classList.add("submit"));
  } else {
  }

  let mainZarb = null;

  mainZarb = userZarb.reduce((prev, cur) => prev * cur);

  if (userZarb.length === ratio) {
    if (mainZarb === maxNumInAlgorithm) {
      ratio += 1;
      squareGenerator();
    } else if (mainZarb < maxNumInAlgorithm) {
      if (ratio > 4) {
        ratio -= 1;
        squareGenerator();
      } else {
        // console.log("game over");
        alert("Game Over");

        location.reload();
      }
    }
  }
};
// increaseBtn.addEventListener("click", () => {
//   ratio += 1;
//   squareGenerator();
// });
window.addEventListener("load", () => {
  squareGenerator();
});
