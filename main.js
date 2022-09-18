'use strict';
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playList = $('.playlist');
const togglePlayBtn = $('.btn-toggle-play');
const playBtn = $('.player')
const progress = $('.progress');
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const repeatBtn = $('.btn-repeat');
const cdWidth = cd.offsetWidth;



const randomBtn = $('.btn-random');


let app = {

  currentSongIndex: 0,
  isPlaying: false,
  isRepeat: false,
  isRandom: false,
  playedSongList: new Set(),
  songs: [
    {
      id: 1,
      name: 'Dấu mưa',
      path: './assets/music/song1.mp3',
      single: 'Trung Quân',
      image: './assets/img/img-1.jpg'
    },
    {
      id: 2,
      name: 'Mùa thu đi qua',
      path: './assets/music/song2.mp3',
      single: 'Rhymastic',
      image: './assets/img/img-2.jpg'
    },
    {
      id: 3,
      name: 'Tình yêu chậm trễ',
      path: './assets/music/song3.mp3',
      single: 'Monstar',
      image: './assets/img/img-3.jpg'
    },
    {
      id: 4,
      name: 'Yêu em hơn mỗi ngày',
      path: './assets/music/song4.mp3',
      single: 'Andiez x Amee',
      image: './assets/img/img-4.jpg'
    },
    {
      id: 5,
      name: 'Răng khôn',
      path: './assets/music/song5.mp3',
      single: 'Phí Phương Anh x RIN 9',
      image: './assets/img/img-5.jpg'
    },
  ],
  defineProperties: function () {
    // Định nghĩa là khi mở app thì luôn hiển thì bài đầu tiên
    Object.defineProperty(this, 'currentSong', {
      get() {
        return this.songs[this.currentSongIndex];
      }
    })
  },
  render: function () {
    const htmls = this.songs.map(function (song) {
      return `<div class="song">
            <div class="thumb" style="background-image: url(${song.image})">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.single}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
    })
    playList.innerHTML = htmls.join('');
  },

  scrollIntoView: function (scrolledSong) {
    scrolledSong.scrollIntoView(
      {
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      })
    // Scroll
    // scrolledSong.addEventListener('scroll', function () {
    //   console.log(1)
    //   let scrollTop = window.scrollY || document.documentElement.scrollTop;
    //   let newWidth = cdWidth - scrollTop;
    //   cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
    //   cd.style.opacity = newWidth / cdWidth;
    // })
  },
  playRandomSong: function (playedSongList) {
    const lengthPlayList = this.songs.length;
    let newSongIndex;
    newSongIndex = Math.floor(Math.random() * lengthPlayList);
    while (playedSongList.has(newSongIndex)) {
      newSongIndex = Math.floor(Math.random() * lengthPlayList);
    }
    playedSongList.add(newSongIndex);
    this.currentSongIndex = newSongIndex;
    this.loadCurrentSong();
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
    const songLists = $$('.song')
    if ($('.song.active')) {
      $('.song.active').classList.remove('active');
    }
    for (let index in songLists) {
      if (Number(index) === this.currentSongIndex) {
        songLists[index].classList.add('active');
      }
    }
    // this.scrollIntoView(songLists[this.currentSongIndex]);
  },
  nextSong: function () {
    this.currentSongIndex++;
    if (this.currentSongIndex === this.songs.length) {
      this.currentSongIndex = 0
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentSongIndex--;
    if (this.currentSongIndex < 0) {
      this.currentSongIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  handleEvents: function () {
    const songAllList = $$('.song')
    const _this = this;
    // Handling cd rotary
    const cdThumbAnimate = cdThumb.animate([
      { transform: 'rotate(360deg)' }
    ],
      {
        duration: 10000,
        iterations: Infinity,
      })
    cdThumbAnimate.pause()
    // Scroll
    console.log(1)
    document.onscroll = function ()
    {
      // Distance of scroll
      console.log(1)
      let scrollTop = window.scrollY || document.documentElement.scrollTop;
      let newWidth = cdWidth - scrollTop;
      cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
      cd.style.opacity = newWidth / cdWidth;
    }
    // document.addEventListener('scroll', function () {

    // })
    // Play and pause song
    togglePlayBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      }
      else {
        audio.play();
      }
    }
    audio.onplay = function () {
      _this.isPlaying = true;
      playBtn.classList.add('playing');
      cdThumbAnimate.play()
    }
    audio.onpause = function () {
      _this.isPlaying = false;
      playBtn.classList.remove('playing');
      cdThumbAnimate.pause()
    }

    // Handling auto seek
    const autoSeeking = function () {
      const progressPercent = Math.trunc(audio.currentTime / audio.duration * 100);
      // Loại bỏ giá trị NaN
      progress.value = progressPercent > 0 ? progressPercent : 0;
    }
    audio.addEventListener('timeupdate', autoSeeking)

    // Auto update currentTime when move to a new position
    progress.addEventListener('change', function (e) {
      const seekTimes = audio.duration * e.target.value / 100;
      audio.currentTime = seekTimes;
    })
    // Fix bugs due timeupdate constantly updated
    progress.addEventListener('touchmove', function (e) {
      audio.removeEventListener('timeupdate', autoSeeking)
    })
    audio.addEventListener('seeked', function (e) {
      audio.addEventListener('timeupdate', autoSeeking)
    })
    // Play Next and Previous song
    nextBtn.onclick = () => {
      if (_this.isRandom) {
        if (_this.playedSongList.size === this.songs.length) {
          _this.playedSongList.clear()
        }
        _this.playedSongList.add(_this.currentSongIndex);
        _this.playRandomSong(_this.playedSongList);
      }
      else {
        _this.nextSong();
        
        for (let index in songAllList) {
          if (Number(index) === _this.currentSongIndex) {
            _this.scrollIntoView(songAllList[index])
          }
        }
      }
      audio.play();
    }
    prevBtn.onclick = () => {
      if (_this.isRandom) {
        if (_this.playedSongList.size === this.songs.length) {
          _this.playedSongList.clear()
        }
        _this.playedSongList.add(_this.currentSongIndex);
        _this.playRandomSong(_this.playedSongList);
      }
      else {
        _this.prevSong();
        for (let index in songAllList) {
          if (Number(index) === _this.currentSongIndex) {
            _this.scrollIntoView(songAllList[index])

          }
        }
      }
      audio.play();
    }
    // Open repeat mode
    repeatBtn.onclick = () => {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle('active', _this.isRepeat);
    }
    // Random mode
    randomBtn.onclick = () => {
      _this.isRepeat = false;
      repeatBtn.classList.toggle('active', _this.isRepeat);
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle('active', _this.isRandom);
    }
    audio.addEventListener('ended', () => {
      if (_this.isRepeat) {
        audio.play()
      }
      else {
        nextBtn.click()
      }
    })
    const songLists = $$('.song');
    playList.onclick = function (e) {
      for (let index in songLists) {
        if (songLists[index] === e.target.closest('.song')) {
          if (!e.target.closest('.option')) {
            _this.currentSongIndex = Number(index);
            _this.loadCurrentSong();
            _this.scrollIntoView(e.target.closest('.song'))
            audio.play();
          }
        }
      }
    }
  },

  start: function () {
    // Định nghĩa các thuộc tính
    this.defineProperties();

    // Render ra website
    this.render();


    this.loadCurrentSong()



    // Xử lý các sự kiện
    this.handleEvents();
  }

}
app.start()





// // Một số bài hát có thể bị lỗi do liên kết bị hỏng. Vui lòng thay thế liên kết khác để có thể phát
// // Some songs may be faulty due to broken links. Please replace another link so that it can be played

// const $ = document.querySelector.bind(document);
// const $$ = document.querySelectorAll.bind(document);

// const PlAYER_STORAGE_KEY = "F8_PLAYER";

// const player = $(".player");
// const cd = $(".cd");
// const heading = $("header h2");
// const cdThumb = $(".cd-thumb");
// const audio = $("#audio");
// const playBtn = $(".btn-toggle-play");
// const progress = $("#progress");
// const prevBtn = $(".btn-prev");
// const nextBtn = $(".btn-next");
// const randomBtn = $(".btn-random");
// const repeatBtn = $(".btn-repeat");
// const playlist = $(".playlist");

// const app = {
//   currentIndex: 0,
//   isPlaying: false,
//   isRandom: false,
//   isRepeat: false,
//   config: {},
//   // (1/2) Uncomment the line below to use localStorage
//   // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
//   songs: [
//     {
//       name: "Click Pow Get Down",
//       singer: "Raftaar x Fortnite",
//       path: "https://mp3.vlcmusic.com/download.php?track_id=34737&format=320",
//       image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
//     },
//     {
//       name: "Tu Phir Se Aana",
//       singer: "Raftaar x Salim Merchant x Karma",
//       path: "https://mp3.vlcmusic.com/download.php?track_id=34213&format=320",
//       image:
//         "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
//     },
//     {
//       name: "Naachne Ka Shaunq",
//       singer: "Raftaar x Brobha V",
//       path:
//         "https://mp3.filmysongs.in/download.php?id=Naachne Ka Shaunq Raftaar Ft Brodha V Mp3 Hindi Song Filmysongs.co.mp3",
//       image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
//     },
//     {
//       name: "Mantoiyat",
//       singer: "Raftaar x Nawazuddin Siddiqui",
//       path: "https://mp3.vlcmusic.com/download.php?track_id=14448&format=320",
//       image:
//         "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
//     },
//     {
//       name: "Aage Chal",
//       singer: "Raftaar",
//       path: "https://mp3.vlcmusic.com/download.php?track_id=25791&format=320",
//       image:
//         "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
//     },
//     {
//       name: "Damn",
//       singer: "Raftaar x kr$na",
//       path:
//         "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
//       image:
//         "https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg"
//     },
//     {
//       name: "Feeling You",
//       singer: "Raftaar x Harjas",
//       path: "https://mp3.vlcmusic.com/download.php?track_id=27145&format=320",
//       image:
//         "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
//     }
//   ],
//   setConfig: function (key, value) {
//     this.config[key] = value;
//     // (2/2) Uncomment the line below to use localStorage
//     // localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
//   },
//   render: function () {
//     const htmls = this.songs.map((song, index) => {
//       return `
//                         <div class="song ${
//                           index === this.currentIndex ? "active" : ""
//                         }" data-index="${index}">
//                             <div class="thumb"
//                                 style="background-image: url('${song.image}')">
//                             </div>
//                             <div class="body">
//                                 <h3 class="title">${song.name}</h3>
//                                 <p class="author">${song.singer}</p>
//                             </div>
//                             <div class="option">
//                                 <i class="fas fa-ellipsis-h"></i>
//                             </div>
//                         </div>
//                     `;
//     });
//     playlist.innerHTML = htmls.join("");
//   },
//   defineProperties: function () {
//     Object.defineProperty(this, "currentSong", {
//       get: function () {
//         return this.songs[this.currentIndex];
//       }
//     });
//   },
//   handleEvents: function () {
//     const _this = this;
//     const cdWidth = cd.offsetWidth;

//     // Xử lý CD quay / dừng
//     // Handle CD spins / stops
//     const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
//       duration: 10000, // 10 seconds
//       iterations: Infinity
//     });
//     cdThumbAnimate.pause();

//     // Xử lý phóng to / thu nhỏ CD
//     // Handles CD enlargement / reduction
//     document.onscroll = function () {
//       const scrollTop = window.scrollY || document.documentElement.scrollTop;
//       const newCdWidth = cdWidth - scrollTop;

//       cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
//       cd.style.opacity = newCdWidth / cdWidth;
//     };

//     // Xử lý khi click play
//     // Handle when click play
//     playBtn.onclick = function () {
//       if (_this.isPlaying) {
//         audio.pause();
//       } else {
//         audio.play();
//       }
//     };

//     // Khi song được play
//     // When the song is played
//     audio.onplay = function () {
//       _this.isPlaying = true;
//       player.classList.add("playing");
//       cdThumbAnimate.play();
//     };

//     // Khi song bị pause
//     // When the song is pause
//     audio.onpause = function () {
//       _this.isPlaying = false;
//       player.classList.remove("playing");
//       cdThumbAnimate.pause();
//     };

//     // Khi tiến độ bài hát thay đổi
//     // When the song progress changes
//     audio.ontimeupdate = function () {
//       if (audio.duration) {
//         const progressPercent = Math.floor(
//           (audio.currentTime / audio.duration) * 100
//         );
//         progress.value = progressPercent;
//       }
//     };

//     // Xử lý khi tua song
//     // Handling when seek
//     progress.onchange = function (e) {
//       const seekTime = (audio.duration / 100) * e.target.value;
//       audio.currentTime = seekTime;
//     };

//     // Khi next song
//     // When next song
//     nextBtn.onclick = function () {
//       if (_this.isRandom) {
//         _this.playRandomSong();
//       } else {
//         _this.nextSong();
//       }
//       audio.play();
//       _this.render();
//       _this.scrollToActiveSong();
//     };

//     // Khi prev song
//     // When prev song
//     prevBtn.onclick = function () {
//       if (_this.isRandom) {
//         _this.playRandomSong();
//       } else {
//         _this.prevSong();
//       }
//       audio.play();
//       _this.render();
//       _this.scrollToActiveSong();
//     };

//     // Xử lý bật / tắt random song
//     // Handling on / off random song
//     randomBtn.onclick = function (e) {
//       _this.isRandom = !_this.isRandom;
//       _this.setConfig("isRandom", _this.isRandom);
//       randomBtn.classList.toggle("active", _this.isRandom);
//     };

//     // Xử lý lặp lại một song
//     // Single-parallel repeat processing
//     repeatBtn.onclick = function (e) {
//       _this.isRepeat = !_this.isRepeat;
//       _this.setConfig("isRepeat", _this.isRepeat);
//       repeatBtn.classList.toggle("active", _this.isRepeat);
//     };

//     // Xử lý next song khi audio ended
//     // Handle next song when audio ended
//     audio.onended = function () {
//       if (_this.isRepeat) {
//         audio.play();
//       } else {
//         nextBtn.click();
//       }
//     };

//     // Lắng nghe hành vi click vào playlist
//     // Listen to playlist clicks
//     playlist.onclick = function (e) {
//       const songNode = e.target.closest(".song:not(.active)");

//       if (songNode || e.target.closest(".option")) {
//         // Xử lý khi click vào song
//         // Handle when clicking on the song
//         if (songNode) {
//           _this.currentIndex = Number(songNode.dataset.index);
//           _this.loadCurrentSong();
//           _this.render();
//           audio.play();
//         }

//         // Xử lý khi click vào song option
//         // Handle when clicking on the song option
//         if (e.target.closest(".option")) {
//         }
//       }
//     };
//   },
//   scrollToActiveSong: function () {
//     setTimeout(() => {
//       $(".song.active").scrollIntoView({
//         behavior: "smooth",
//         block: "nearest"
//       });
//     }, 300);
//   },
//   loadCurrentSong: function () {
//     heading.textContent = this.currentSong.name;
//     cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
//     audio.src = this.currentSong.path;
//   },
//   loadConfig: function () {
//     this.isRandom = this.config.isRandom;
//     this.isRepeat = this.config.isRepeat;
//   },
//   nextSong: function () {
//     this.currentIndex++;
//     if (this.currentIndex >= this.songs.length) {
//       this.currentIndex = 0;
//     }
//     this.loadCurrentSong();
//   },
//   prevSong: function () {
//     this.currentIndex--;
//     if (this.currentIndex < 0) {
//       this.currentIndex = this.songs.length - 1;
//     }
//     this.loadCurrentSong();
//   },
//   playRandomSong: function () {
//     let newIndex;
//     do {
//       newIndex = Math.floor(Math.random() * this.songs.length);
//     } while (newIndex === this.currentIndex);

//     this.currentIndex = newIndex;
//     this.loadCurrentSong();
//   },
//   start: function () {
//     // Gán cấu hình từ config vào ứng dụng
//     // Assign configuration from config to application
//     this.loadConfig();

//     // Định nghĩa các thuộc tính cho object
//     // Defines properties for the object
//     this.defineProperties();

//     // Lắng nghe / xử lý các sự kiện (DOM events)
//     // Listening / handling events (DOM events)
//     this.handleEvents();

//     // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
//     // Load the first song information into the UI when running the app
//     this.loadCurrentSong();

//     // Render playlist
//     this.render();

//     // Hiển thị trạng thái ban đầu của button repeat & random
//     // Display the initial state of the repeat & random button
//     randomBtn.classList.toggle("active", this.isRandom);
//     repeatBtn.classList.toggle("active", this.isRepeat);
//   }
// };

// app.start();

