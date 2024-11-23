document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    const result = await response.json();
  
    if (result.success) {
      // Redirect to the index page on successful login
      window.location.href = '/index.html';
    } else {
      // Show an error message if login fails
      const errorMessage = document.getElementById('error-message');
      errorMessage.style.display = 'block';
    }
  });
  
  const channelData = [
    {
      title: "NBC News Now",
      url:
        "https://cdn3.turboviplay.com/data1/6730bb3ca53cb/6730bb3ca53cb.m3u8",
      image: "https://i.imgur.com/v48mMRT.png",
      language: "English"
    },
  
    {
      title: "Global News",
      url:
        "https://cdn3.turboviplay.com/data1/6730bb3ca53cb/6730bb3ca53cb480.m3u8",
      image: "https://i.imgur.com/IpfmG93.png",
      language: "English"
    },
    {
      title: "ICI RDI",
      url: "https://rcavlive.akamaized.net/hls/live/704025/xcanrdi/master.m3u8",
      image: "https://i.imgur.com/jtyrp30.png",
      language: "English"
    },
    {
      title: "Télé Québec",
      url:
        "https://bcovlive-a.akamaihd.net/575d86160eb143458d51f7ab187a4e68/us-east-1/6101674910001/playlist.m3u8",
      image: "https://i.imgur.com/8grBWK9.png",
      language: "French"
    },
    {
      title: "PBS America",
      url: "https://pbs-samsunguk.amagi.tv/playlist.m3u8",
      image: "ttps://i.imgur.com/J4zE5z9.jpg",
      language: "English"
    },
    {
      title: "Quatro ",
      url: "https://limited09.todostreaming.es/live/tarson-livestream.m3u8",
      image: "https://i.imgur.com/zROxNap.png",
      language: "Spanish"
    },
    {
      title: "Telemadrid",
      url:
        "https://telemadridhls2-live-hls.secure2.footprint.net/egress/chandler/telemadrid/telemadrid_1/bitrate_1.m3u8",
      image: "https://imgur.com/VSDsSTZ.png",
      language: "Spanish"
    },
  
    {
      title: "À Punt TV",
      url:
        "https://bcovlive-a.akamaihd.net/469e448f034b4d46afa4bcac53297d60/eu-central-1/6057955885001/profile_0/chunklist_dvr.m3u8",
      image: "ttps://i.imgur.com/M88LoNl.png",
      language: "Spanish"
    },
    {
      title: "RTV Drenthe",
      url: "https://cdn.rtvdrenthe.nl/live/rtvdrenthe/tv/1080p/prog_index.m3u8",
      image: "https://i.imgur.com/GaGqM4z.png",
      language: "Dutch"
    },
  
    {
      title: "RTV Utrecht",
      url: "https://media.rtvutrecht.nl/live/rtvutrecht/rtvutrecht/index.m3u8",
      image: "https://i.imgur.com/c0I24N6.png",
      language: "Dutch"
    },
    {
      title: "Omroep Flevoland",
      url:
        "https://d5ms27yy6exnf.cloudfront.net/live/omroepflevoland/tv/index.m3u8",
      image: "https://i.imgur.com/d1CmTcI.png",
      language: "Dutch"
    },
    {
      title: "NH Nieuws",
      url:
        "https://rrr.sz.xlcdn.com/?account=nhnieuws&file=live&type=live&service=wowza&protocol=https&output=playlist.m3u8",
      image: "https://i.imgur.com/SQPVOwn.png",
      language: "Dutch"
    }
  ];
  
  const channelList = document.querySelector(".channel-list");
  channelData.forEach((channel) => {
    const markup = `<li class="channel">
        <div class="handle">☰</div>
        <button class="play-channel" title="${channel.title}" data-m3u8="${channel.url}">
          <img class="channel-poster" src="${channel.image}">
        </button>
        <div class="channel-info">
          <div class="channel-title">${channel.title}</div>
          <div class="channel-language">${channel.language}</div>
         </div>
      </li>`;
    channelList.insertAdjacentHTML("beforeend", markup);
  });
  
  const video = document.querySelector("#player");
  const channelPlays = document.querySelectorAll(".play-channel");
  const channels = document.querySelectorAll(".channel");
  const nowPlayingTitle = document.querySelector("#channel-playing");
  
  const sortable = Sortable.create(channelList);
  
  function loadStream(channelPlay) {
    channels.forEach((channel) => {
      channel.dataset.playing = "false";
    });
    const url = channelPlay.dataset.m3u8;
    const parent = channelPlay.closest("li");
    const title = parent.querySelector(".channel-title").textContent;
    parent.dataset.playing = "true";
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
        nowPlayingTitle.textContent = title;
      });
    }
  }
  
  channelPlays.forEach((channelPlay) => {
    channelPlay.addEventListener("click", (e) => {
      loadStream(channelPlay);
    });
  });
  