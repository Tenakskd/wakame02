"use strict";
const express = require("express");
let app = express();
const cluster = require("cluster");
const os = require("os");
const compression = require("compression");
const numClusters = os.cpus().length;
if (cluster.isMaster) {
  for (let i = 0; i < numClusters; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    cluster.fork();
  });
} else {
  app.use(compression());
  app.use(express.static(__dirname + "/public"));
  app.set("view engine", "ejs");
  app.listen(3000, () => {
    console.log(`Worker ${process.pid} started`);
  });
}
const m3u8stream = require('m3u8stream');
const ytsr = require("ytsr");
const ytpl = require("ytpl");
const miniget = require("miniget");
const ejs = require("ejs");
const axios = require('axios');
const fs = require('fs');
const https = require('https');
const url = require('url');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jp = require('jsonpath');
const path = require('path');
const bodyParser = require('body-parser');
const { URL } = require('url');
const session = require('express-session');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const http = require('http');
const ytdl = require('ytdl-core');
const m3u8Parser = require('m3u8-parser');

const limit = 50;

const user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36";

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const supabaseUrl = process.env.SUPABASE_URL;
const massirosugirupass = process.env.passma;
const supabaseKey = process.env.SUPABASE_KEY; 
const wakamellurl = process.env.wakamellurl;
const supabase = createClient(supabaseUrl, supabaseKey);
const MAX_API_WAIT_TIME = 3000; 
const MAX_TIME = 15000;
const yttttinfo = process.env.yt;
const ytinfo3 = "?autoplay=0&amp;mute=0&amp;controls=1&amp;start=0&amp;origin=https%3A%2F%2Fcreate.kahoot.it&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;iv_load_policy=3&amp;modestbranding=1&amp;fs=1&amp;embed_config=%7B%22enc%22%3A%22ATi76SMQHmaGhsLq0kYDVCvHwW2gSjUXOle4S6o63qI5drsmVuRulS1C7ZieHls6oEt-anb27SYOtHMiEGN9KiPEOfH5J8vNgpVAVbz2r997FLe6lAM9dMdB_SbLFdyEHsXr5_181y3kvbsVrfpNu4UJZnNIdoLrKw%3D%3D%22%2C%22hideTitle%22%3Atrue%7D&amp;enablejsapi=1&amp;widgetid=1";

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 5 * 24 * 60 * 60 * 1000 }
}));

app.get('/tsttsttst23', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('history')
      .select('videoId')
      .order('id', { ascending: false })
      .limit(500); 
    if (error) {
      throw new Error(`データ取得エラー: ${error.message}`);
    }
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomEntry = data[randomIndex];
    const videoId = randomEntry.videoId;
    res.redirect(`/w/${videoId}`);
  } catch (error) {
    console.error('エラーが発生しました:', error);
    res.status(500).send('履歴を取得できませんでした');
  }
});

app.get('/login/if', async (req, res) => {
    if (req.cookies.massiropass !== 'ok') {
        res.render('login', { error: 'ログインしていません。もう一度ログインして下さい' })
    } else {
        return res.redirect('/');
    }
});
app.get('/login', (req, res) => {
    let referer = req.get('Referer') || 'No referer information';
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`URL: ${referer} から来た, IP: ${ip}`);
    res.render('login', { error: null });
});
app.post('/login', (req, res) => {
    const password = req.body.password;
    if (password === massirosugirupass) {
        res.cookie('massiropass', 'ok', { maxAge: 5 * 24 * 60 * 60 * 1000, httpOnly: true });
        const redirectTo = req.session.redirectTo || '/';
        delete req.session.redirectTo;
        return res.redirect(redirectTo);
    } else {
        if (password === 'ohana') {
            return res.redirect('https://ohuaxiehui.webnode.jp');
        } else {
            res.render('login', { error: 'パスワードが間違っています。もう一度お試しください。' });
        }
    }
});
app.get('/login/forgot', (req, res) => {
  res.render(`login/forgot.ejs`);
});
app.post('/logout', (req, res) => {
    res.cookie('pass', 'false', { maxAge: 1, httpOnly: true });
    return res.redirect('/login');
});

app.get('/tst/:id', (req, res) => {
  const id = req.params.id;
  res.render(`tst/${id}`, { id: id });
});

app.get("/famous",(req, res) => {
  res.render("../views/famous.ejs")
})

const invidiousapis = [
  "https://iv.duti.dev",
  "https://invidious.schenkel.eti.br",
  "https://eu-proxy.poketube.fun",
  "https://invidious.f5.si",
  "https://pol1.iv.ggtyler.dev",
  "https::/cal1.iv.ggtyler.dev",
  "https://usa-proxy2.poketube.fun",
  "https://lekker.gay",
  "https://invidious.privacyredirect.com",
  "https://invidious.materialio.us",
  "https://invidious.ducks.party",
  "https://yewtu.be",
  "https://invid-api.poketube.fun",
  "https://iv.melmac.space",
  "https://youtube.privacyplz.org",
  "https://invidious.darkness.service",
  "https://iv.datura.network",
  "https://invidious.jing.rocks",
  "https://invidious.private.coffee",
  "https://youtube.mosesmang.com",
  "https://invidious.projectsegfau.lt",
  "https://invidious.perennialte.ch",
  "https://invidious.einfachzocken.eu",
  "https://invidious.adminforge.de",
  "https://yt.artemislena.eu",
  "https://invidious.esmailelbob.xyz",
  "https://invidious.dhusch.de",
  "https://invidious.0011.lt"
]; 
const highinvidiousapis = [
  "https://inv.nadeko.net",
  "https://pol1.iv.ggtyler.dev",
  "https://yt.drgnz.club",
  "https://invidious.privacyredirect.com",
  "https://invidious.jing.rocks",
  "https://iv.datura.network",
  "https://invidious.private.coffee",
  "https://invidious.materialio.us",
  "https://invidious.fdn.fr",
  "https://vid.puffyan.us",
  "https://invidious.private.coffee",
  "https://youtube.privacyplz.org",
  "https://invidious.fdn.fr",
  "https://youtube.mosesmang.com",
  "https://invidious.nerdvpn.de",
  "https://iv.datura.network",
  "https://invidious.perennialte.ch"
];


async function fetchVideoInfoParallel(videoId) {
  const startTime = Date.now();
  const instanceErrors = new Set();

  for (const instance of invidiousapis) {
    try {
      const response = await axios.get(`${instance}/api/v1/videos/${videoId}`, { timeout: MAX_API_WAIT_TIME });
      console.log(`使ってみたURL: ${instance}/api/v1/videos/${videoId}`);

      if (response.data && response.data.formatStreams) {
        return response.data; 
      } else {
        console.error(`formatStreamsが存在しない: ${instance}`);
      }
    } catch (error) {
      console.error(`エラーだよ: ${instance} - ${error.message}`);
      instanceErrors.add(instance);
    }

    if (Date.now() - startTime >= MAX_TIME) {
      throw new Error("接続がタイムアウトしました");
    }
  }

  throw new Error("動画を取得する方法が見つかりません");
}

async function fetchstreamUrl(videoId) {
  const startTime = Date.now();
  const instanceErrors = new Set();

  for (const instance of invidiousapis) {
    try {
      const response = await axios.get(`${instance}/api/v1/videos/${videoId}`, { timeout: MAX_API_WAIT_TIME });
      console.log(`使ってみたURL: ${instance}/api/v1/videos/${videoId}`);

      if (response.data && response.data.formatStreams) {
        const formatStreams = response.data.formatStreams || [];
        let streamUrl = formatStreams.reverse().map(stream => stream.url)[0];
        return streamUrl; 
      } else {
        console.error(`formatStreamsが存在しない: ${instance}`);
      }
    } catch (error) {
      console.error(`エラーだよ: ${instance} - ${error.message}`);
      instanceErrors.add(instance);
    }

    if (Date.now() - startTime >= MAX_TIME) {
      throw new Error("接続がタイムアウトしました");
    }
  }

  throw new Error("動画を取得する方法が見つかりません");
}

function streamurlchange(url) {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.delete('host');
    return urlObj.toString();
  } catch (error) {
    console.error('URLが無効です:', url);
    return url;
  }
}

async function ggscrvideo(videoId) {
  const localurllist = [
        { url: `${process.env.q1}${videoId}&itag=18`, pid: 0 },
        { url: `${process.env.q2}${videoId}&itag=18`, pid: 0 },
        { url: `${process.env.t3}${process.env.t4}${videoId}`, pid: 1 },
        { url: `${process.env.t3}2${process.env.t4}${videoId}`, pid: 1 },
        { url: `${process.env.t3}3${process.env.t4}${videoId}`, pid: 1 },
        { url: `${process.env.t3}4${process.env.t4}${videoId}`, pid: 1 },
        { url: `${process.env.t3}5${process.env.t4}${videoId}`, pid: 1 }
  ];
  const startTime = Date.now();
  const instanceErrors = new Set();

  for (const instance of localurllist) {
    try {
      const response = await axios.get(`${instance.url}`, { timeout: 1300, maxRedirects: 0});
      console.log(`使ってみたURL: ${instance.url}`);
      let streamUrl = [];    
      
      if (instance.pid === 0) {
        streamUrl = response.data;
      } else if (instance.pid === 1) {
        const videoPageHtml = response.data;
        const videoUrlMatch = videoPageHtml.match(/<meta property="og:video" content="([^"]+)"\s*\/?>/);
        streamUrl = videoUrlMatch ? videoUrlMatch[1] : null;
      }
      if (streamUrl) {
        return streamUrl; 
      } else {
        console.error(`ストリームurlが存在しない: ${instance.url}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 302 && instance.pid === 0) {
          console.error(`リダイレクト先のURLの取得を試みています...: ${instance.url}`);
          const redirectUrl = error.response.headers.location;
          return redirectUrl;
      }
      console.error(`エラーだよ: ${instance.url} - ${error.message}`);
      instanceErrors.add(instance.url);
    }
    if (Date.now() - startTime >= MAX_TIME) {
      return await fetchstreamUrl(videoId);
    }
  }
  return await fetchstreamUrl(videoId);
}

async function ggetvideoinfo(videoId) {
  try {
    const res = await axios.get(`https://inv.nadeko.net/watch?v=${videoId}`);
    const videoPageHtml = res.data;
    const videoUrlMatch = videoPageHtml.match(/<meta property="og:video" content="([^"]+)"\s*\/?>/);
    const streamUrl = videoUrlMatch ? videoUrlMatch[1] : null;
    const titleMatch = videoPageHtml.match(/<meta property="og:title" content="([^"]+)"\s*\/?>/);
    const videoTitle = titleMatch ? titleMatch[1] : null;
    return { streamUrl, videoTitle };
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

async function highfetchVideoInfoParallel(videoId) {
  const startTime = Date.now();
  const instanceErrors = new Set();

  for (const instance of invidiousapis) {
    try {
      const response = await axios.get(`${instance}/api/v1/videos/${videoId}`, { timeout: MAX_API_WAIT_TIME });
      console.log(`使ってみたURL: ${instance}/api/v1/videos/${videoId}`);

      if (response.data && response.data.formatStreams) {
        return response.data; 
      } else {
        console.error(`formatStreamsが存在しない: ${instance}`);
      }
    } catch (error) {
      console.error(`エラーだよ: ${instance} - ${error.message}`);
      instanceErrors.add(instance);
    }

    if (Date.now() - startTime >= MAX_TIME) {
      throw new Error("接続がタイムアウトしました");
    }
  }

  throw new Error("動画を取得する方法が見つかりません");
}

app.get('/ww/:id', async (req, res) => {
  const videoId = req.params.id;
  try {
    const response = await axios.get(`https://wakamecm.glitch.me/umekomiapi/${videoId}`, { timeout: 3000 });
    const videoInfo = response.data
    let streamUrl = await ggscrvideo(videoId);
    
    if (videoId === '50Ura_ZcSvY') {
    streamUrl = 'https://cdn.glitch.me/3128bf45-3a23-4695-81ba-3aba21b8585b/%E3%80%90MV%E3%80%91HELP!!%20%20-%20Kobo%20Kanaeru%20-%20Kobo%20Kanaeru%20Ch.%20hololive-ID%20(1080p%2C%20h264%2C%20youtube).mp4?v=1730184504508';}
    if (videoId === 'zbWEZDA3xZc') {
    streamUrl = 'https://cdn.glitch.me/5b8b419f-e61e-4533-9e15-5b2805b88d0e/Henceforth%20_%20%E7%B5%90%E5%9F%8E%E3%81%95%E3%81%8F%E3%81%AA(Cover)%20-%20Sakuna%20Ch.%20%E7%B5%90%E5%9F%8E%E3%81%95%E3%81%8F%E3%81%AA%20(1080p%2C%20h264%2C%20youtube).mp4?v=1731296837239';}
      
    const templateData = {
      stream_url: streamUrl,
      videoId: videoId,
      channelId: videoInfo.channelId,
      channelName: videoInfo.channelName,
      channelImage: videoInfo.channelImage,
      videoTitle: videoInfo.videoTitle,
      videoDes: videoInfo.videoDes,
      videoViews: videoInfo.videoViews,
      likeCount: videoInfo.likeCount
    };

    const { data, error } = await supabase
      .from('history')
      .insert([
        { 
          videoId: videoId,
          channelId: videoInfo.channelId, 
          channelName: videoInfo.channelName, 
          videoTitle: videoInfo.videoTitle 
        }
      ]);
          
    res.render('infowatch', templateData);
  } catch (error) {
        res.status(500).render('matte', { 
      videoId, 
      error: '動画を取得できません', 
      details: error.message 
    });
  }
});

app.get('/w/:id', async (req, res) => {
  const videoId = req.params.id;
    let cookies = parseCookies(req);
    let wakames = cookies.wakametubeumekomi === 'true';
    if (wakames) {
      res.redirect(`/ww/${videoId}`);
    }
  try {
    const response = await axios.get(`https://wakamecm.glitch.me/umekomiapi/${videoId}`);
    const videoInfo = response.data;
    const src = `${yttttinfo}${videoId}${ytinfo3}`;
    
    const templateData = {
      videoId: videoId,
      channelId: videoInfo.channelId,
      channelName: videoInfo.channelName,
      channelImage: videoInfo.channelImage,
      videoTitle: videoInfo.videoTitle,
      videoDes: videoInfo.videoDes,
      videosrc: src,
      videoViews: videoInfo.videoViews,
      likeCount: videoInfo.likeCount
    };

    const { data, error } = await supabase
      .from('history')
      .insert([
        { 
          videoId: videoId,
          channelId: videoInfo.channelId, 
          channelName: videoInfo.channelName, 
          videoTitle: videoInfo.videoTitle 
        }
      ]);
          
    res.render('jouchowatch', templateData);
  } catch (error) {
    console.log(error);
        res.status(500).render('matte', { 
      videoId, 
      error: '動画を取得できません', 
      details: error.message 
    });
  }
});

app.get('/yt/:videoId', async (req, res) => {
  const videoId = req.params.videoId;
  try {
    const streamUrl = await ggscrvideo(videoId);
    res.json({ streamUrl, videoId });
  } catch (error) {
    console.error(`Failed to fetch video data: ${error.message}`, error.response?.data);
    res.status(500)
  }
});

const caninvidiousInstances = [
  "https://inv.riverside.rocks",
  "https://youtube.076.ne.jp",
  "https://invidious.weblibre.org","https://iv.datura.network",
  "https://invidious.reallyaweso.me",
  "https://inv.phene.dev","https://invidious.protokolla.fi",
  "https://invidious.perennialte.ch",
  "https://invidious.materialio.us","https://yewtu.be",
  "https://invidious.fdn.fr",
  "https://inv.tux.pizza",
  "https://vid.puffyan.us",
  "https://invidio.xamh.de",
  "https://invidious.sethforprivacy.com",
  "https://invidious.tiekoetter.com",
  "https://inv.bp.projectsegfau.lt",
  "https://invidious.rhyshl.live",
  "https://invidious.private.coffee",
  "https://invidious.ethibox.fr",
  "https://invidious.privacyredirect.com",
  "https://inv.nadeko.net",
  "https://invidious.nerdvpn.de",
  "https://invidious.namazso.eu",
  "https://iv.nowhere.moe/"
];
async function getytk(videoId) {
  for (const instance of caninvidiousInstances) {
    try {
      const response = await axios.get(`${instance}/api/v1/videos/${videoId}`);
      
      if (response.data && response.data.authorId) {
        return response.data;
      }
    } catch (error) {
      console.error(`エラー: ${error.message} - ${instance}`);
    }
  }
  throw new Error("見つかりませんでした");
}

app.get('/canw/:id', async (req, res) => {
  const videoId = req.params.id;
  
  try {
    const videoInfo = await getytk(videoId);
    
    const formatStreams = videoInfo.formatStreams || [];
    const streamUrl = formatStreams.reverse().map(stream => stream.url)[0];
    
    const templateData = {
      stream_url: streamUrl,
      videoId: videoId,
      channelId: videoInfo.authorId,
      channelName: videoInfo.author,
      channelImage: videoInfo.authorThumbnails?.[videoInfo.authorThumbnails.length - 1]?.url || '',
      videoTitle: videoInfo.title,
      videoDes: videoInfo.descriptionHtml,
      videoViews: videoInfo.viewCount,
      likeCount: videoInfo.likeCount
    };

    res.render('deswatch', templateData);
  } catch (error) {
        res.status(500).render('matte', { 
      videoId, 
      error: '動画を取得できません', 
      details: error.message 
    });
  }
});

app.get('/embeder/:id', async (req, res) => {
  const videoId = req.params.id;
  
  try {
    const videoInfo = await fetchVideoInfoParallel(videoId);
    
    const templateData = {
      videoId: videoId,
      channelId: videoInfo.authorId,
      channelName: videoInfo.author,
      channelImage: videoInfo.authorThumbnails?.[videoInfo.authorThumbnails.length - 1]?.url || '',
      videoTitle: videoInfo.title,
      videoDes: videoInfo.descriptionHtml,
      videoViews: videoInfo.viewCount,
      likeCount: videoInfo.likeCount
    };

    res.render('embeder', templateData);
  } catch (error) {
        res.status(500).render('matte', { 
      videoId, 
      error: '動画を取得できません', 
      details: error.message 
    });
  }
});

app.get('/www/:id', async (req, res) => {
  const videoId = req.params.id;
  try {
    const videoInfo = await fetchVideoInfoParallel(videoId);
    const audioStreams = videoInfo.adaptiveFormats || [];
    
    let streamUrl = audioStreams
      .filter(stream => stream.container === 'mp4' && stream.resolution === '1080p')
      .map(stream => streamurlchange(stream.url))[0];

    if (!streamUrl) {
      streamUrl = audioStreams
        .filter(stream => stream.container === 'mp4' && stream.resolution === '720p')
        .map(stream => streamurlchange(stream.url))[0];
    }

    const audioUrl = audioStreams
      .filter(stream => stream.container === 'm4a' && stream.audioQuality === 'AUDIO_QUALITY_MEDIUM')
      .map(stream => streamurlchange(stream.url))[0];

    const templateData = {
      stream_url: streamUrl,
      audioUrl: audioUrl,
      videoId: videoId,
      channelId: videoInfo.authorId,
      channelName: videoInfo.author,
      channelImage: videoInfo.authorThumbnails?.[videoInfo.authorThumbnails.length - 1]?.url || '',
      videoTitle: videoInfo.title,
      videoDes: videoInfo.descriptionHtml,
      videoViews: videoInfo.viewCount,
      likeCount: videoInfo.likeCount
    };

    res.render('highquo', templateData);
  } catch (error) {
        res.status(500).render('matte', { 
      videoId, 
      error: '動画を取得できません', 
      details: error.message 
    });
  }
});

app.get('/ll/:id', async (req, res) => {
  const videoId = req.params.id;

  try {
    const videoInfo = await fetchVideoInfoParallel(videoId);
    
    const audioStreams = videoInfo.formatStreams || [];
    const streamUrl = audioStreams.map(audio => audio.url)[0];

    if (!streamUrl) {
          res.status(500).render('matte', { 
      videoId, 
      error: 'ストリームURLが見つかりません',
    });
    }
    if (!videoInfo.authorId) {
      return res.redirect(`/redirect?p=ll&id=${videoId}`);
    }

    const templateData = {
      audioUrl: streamUrl,
      videoId: videoId,
      videoTitle: videoInfo.title,
    };

    res.render('listen', templateData);
  } catch (error) {
        res.status(500).render('matte', { 
      videoId, 
      error: '動画を取得できません', 
      details: error.message 
    });
  }
});
app.get('/umekomi/:id', async (req, res) => {
  let videoId = req.params.id;
  let url = `https://www.youtube.com/watch?v=${videoId}`;
  
  try {
    const inforesponse = await axios.get(url);
    const html = inforesponse.data;

    const titleMatch = html.match(/"title":\{.*?"text":"(.*?)"/);
    const descriptionMatch = html.match(/"attributedDescriptionBodyText":\{.*?"content":"(.*?)","commandRuns/);
    const viewsMatch = html.match(/"views":\{.*?"simpleText":"(.*?)"/);
    const channelImageMatch = html.match(/"channelThumbnail":\{.*?"url":"(.*?)"/);
    const channelNameMatch = html.match(/"channel":\{.*?"simpleText":"(.*?)"/);
    const channnelIdMatch = html.match(/"browseEndpoint":\{.*?"browseId":"(.*?)"/);

    const videoTitle = titleMatch ? titleMatch[1] : 'タイトルを取得できませんでした';
    const videoDes = descriptionMatch ? descriptionMatch[1].replace(/\\n/g, '\n') : '概要を取得できませんでした';
    const videoViews = viewsMatch ? viewsMatch[1] : '再生回数を取得できませんでした';
    const channelImage = channelImageMatch ? channelImageMatch[1] : '取得できませんでした';
    const channelName = channelNameMatch ? channelNameMatch[1] : '取得できませんでした';
    const channelId = channnelIdMatch ? channnelIdMatch[1] : '取得できませんでした';
    
    const { data, error } = await supabase
      .from('history')
      .insert([
        { 
          videoId: videoId,
          channelId: channelId, 
          channelName: channelName, 
          videoTitle: videoTitle 
        }
      ]);

    res.render('umekomi.ejs', { videoId, videoTitle, videoDes, videoViews, channelImage, channelName, channelId});
  } catch (error) {
    console.error(error);
    res.status(500).render('matte', { videoId, error: '動画情報を取得できません', details: error.message });
  }
});
const MINIGET_RETRY_LIMIT = 3;
const RETRY_DELAY_MS = 2000;

app.get("/live/:id", async (req, res) => {
    const videoId = req.params.id;
    if (!videoId) return res.redirect("/");

    try {
        const videoInfo = await fetchVideoInfoParallel(videoId);

        const hlsUrl = videoInfo.hlsUrl;
        if (!hlsUrl) {
            return res.status(500).send("No live stream URL available.");
        }

        console.log("HLS URL:", hlsUrl);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        res.setHeader("Content-Type", "application/vnd.apple.mpegurl");

        const fetchStreamWithRetry = async (url, retryCount = 0) => {
            try {
                const stream = miniget(url);
                stream.pipe(res);

                stream.on('error', (err) => {
                    console.error("Error while streaming HLS:", err);
                    if (retryCount < MINIGET_RETRY_LIMIT) {
                        console.log(`Retrying... (${retryCount + 1}/${MINIGET_RETRY_LIMIT})`);
                        setTimeout(() => fetchStreamWithRetry(url, retryCount + 1), RETRY_DELAY_MS);
                    } else {
                        res.status(500).send("Failed to stream after multiple retries.");
                    }
                });

                stream.on('end', () => {
                    console.log('Stream ended.');
                });
            } catch (err) {
                if (retryCount < MINIGET_RETRY_LIMIT) {
                    console.log(`Error fetching stream. Retrying... (${retryCount + 1}/${MINIGET_RETRY_LIMIT})`);
                    setTimeout(() => fetchStreamWithRetry(url, retryCount + 1), RETRY_DELAY_MS);
                } else {
                    res.status(500).send("Failed to fetch stream after multiple retries.");
                }
            }
        };

        await fetchStreamWithRetry(hlsUrl);

    } catch (error) {
        console.error("Error fetching video info:", error);
        res.status(500).send(error.toString());
    }
});



app.get("/miniget/:id", async (req, res) => {
  const id = req.params.id;
	let stream = miniget(`https://inv-eu1.nadeko.net:8448/latest_version?id=${id}&itag=18&check=9B8c_qXj9RabmqnBpnJrkhwQ_bgnjDzsd6OoOOuruhs=&local=true`, {
		headers: {
			"user-agent": user_agent
		}
	});
	stream.on('error', err => {
		console.log(err);
		res.status(500).send(err.toString());
	});
	stream.pipe(res);
});


app.get('/pytdf/:id', async (req, res) => {
  const videoId = req.params.id;

  try {
    const videoInfo = await fetchVideoInfoParallel(videoId);
    const formatStreams = videoInfo.formatStreams || [];
    const streamUrl = formatStreams.reverse().map(stream => stream.url)[0];

        const response = await axios({
            method: 'get',
            url: streamUrl,
            responseType: 'stream',
        });

        res.setHeader('Content-Disposition', 'attachment; filename=video.mp4');
        res.setHeader('Content-Type', 'video/mp4');
        response.data.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).send('ダウンロードに失敗しました。');
    }
});

app.get("/", (req, res) => {
   res.sendFile(__dirname + "/views/index.html");
});

app.get('/st', (req, res) => {
    res.sendStatus(200);
});

app.get("/s", async (req, res) => {
	let query = req.query.q;
	let page = Number(req.query.p || 2);
    let cookies = parseCookies(req);
    let wakames = cookies.wakames === 'true';
    if (wakames) {
        try {
		res.render("search2.ejs", {
			res: await ytsr(query, { limit, pages: page }),
			query: query,
			page
		});
	} catch (error) {
		console.error(error);
		try {
			res.status(500).render("error.ejs", {
				title: "ytsr Error",
				content: error
			});
		} catch (error) {
			console.error(error);
		}
	}
    } else {
       try {
		res.render("search.ejs", {
			res: await ytsr(query, { limit, pages: page }),
			query: query,
			page
		});
	} catch (error) {
		console.error(error);
		try {
			res.status(500).render("error.ejs", {
				title: "ytsr Error",
				content: error
			});
		} catch (error) {
			console.error(error);
		}
	}
    }
});
app.get("/p/:id", async (req, res) => {
	if (!req.params.id) return res.redirect("/");
	let page = Number(req.query.p || 1);
	try {
		res.render("playlist.ejs", {
			playlist: await ytpl(req.params.id, { limit, pages: page }),
			page
		});
	} catch (error) {
		console.error(error);
		res.status(500).render("error.ejs", {
			title: "ytpl Error",
			content: error
		});
	}
});

app.get("/c/:id", async (req, res) => {
	if (!req.params.id) return res.redirect("/");
	let page = Number(req.query.p || 1);
	try {
		res.render("channel.ejs", {
			channel: await ytpl(req.params.id, { limit, pages: page }),
			page
		});
	} catch (error) {
		console.error(error);
		res.status(500).render("error.ejs",{
			title: "ytpl Error",
			content: error
		});
	}
});

app.get("/vi*", (req, res) => {
	let stream = miniget(`https://i.ytimg.com/${req.url.split("?")[0]}`, {
		headers: {
			"user-agent": user_agent
		}
	});
	stream.on('error', err => {
		console.log(err);
		res.status(500).send(err.toString());
	});
	stream.pipe(res);
});

app.get("/loginvi*", (req, res) => {
	let stream = miniget(`https://i.ytimg.com/${req.url.split("?")[0]}`, {
		headers: {
			"user-agent": user_agent
		}
	});
	stream.on('error', err => {
		console.log(err);
		res.status(500).send(err.toString());
	});
	stream.pipe(res);
});

app.get("/ytc/:id", (req, res) => {
    const channelId = req.params.id;
    const imageUrl = `https://yt3.ggpht.com/ytc/${channelId}=s900-c-k-c0xffffffff-no-rj-mo`;
    let stream = miniget(imageUrl, {
        headers: {
            "user-agent": user_agent
        }
    });
    stream.on('error', err => {
        console.log(err);
        res.status(500).send(err.toString());
    });
    stream.pipe(res);
});


app.get("/tool",(req, res) => {
  res.render("../tool/n/home.ejs")
})

app.get("/tool/n/comment/:id",(req, res) => {
  const id = req.params.id;
  res.render("../tool/n/comment.ejs", {id})
})

app.get('/tool/:id', (req, res) => {
  const id = req.params.id;
  res.render(`../tool/${id}.ejs`, { id: id });
});

app.get("/tst1234",(req, res) => {
  res.render("../tst.ejs")
})

app.get("/urls",(req, res) => {
  res.render("../views/url.ejs")
})

app.get("/blog",(req, res) => {
  res.render("../views/blog.ejs")
})
app.get('/blog/:id', (req, res) => {
  const id = req.params.id;
  res.render(`blog/${id}`, { id: id });
});

app.get("/neta",(req, res) => {
  res.render("../views/neta.ejs")
})
app.get('/neta/:id', (req, res) => {
  const id = req.params.id;
  res.render(`neta/${id}`, { id: id });
});

app.get("/send",(req, res) => {
  res.render("../views/send.ejs")
})

app.get("/app",(req, res) => {
  res.render("../public/apps.ejs")
})

app.get("/kirikiri", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('history')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);
    if (error) {
      throw new Error(`データ取得エラー: ${error.message}`);
    }
    if (data.length === 0) {
      throw new Error('データが存在しません');
    }
    const latestId = data[0].id;
    res.render("../views/kiriban.ejs", { latestId });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    res.status(500).send('データを取得できませんでした');
  }
});


app.get('/game/:id', (req, res) => {
  const id = req.params.id;
  res.render(`../game/${id}.ejs`, { id: id });
});

app.get("/proxy/",(req, res) => {
  res.render("../read/proxy.ejs")
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

function parseCookies(request) {
    const list = {};
    const cookieHeader = request.headers.cookie;

    if (cookieHeader) {
        cookieHeader.split(';').forEach(cookie => {
            let parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });
    }

    return list;
}

app.get('/setting', (req, res) => {
    const cookies = parseCookies(req);
    const wakames = cookies.wakames === 'true';
    const wakametubeumekomi = cookies.wakametubeumekomi === 'true';
    res.render('setting.ejs', { wakames, wakametubeumekomi });
});

app.post('/setting', (req, res) => {
    const wakames = req.body.wakames === 'on';
    const wakametubeumekomi = req.body.wakametubeumekomi === 'on';

    res.setHeader('Set-Cookie', [
        `wakames=${wakames}; HttpOnly; Max-Age=31536000`,
        `wakametubeumekomi=${wakametubeumekomi}; HttpOnly; Max-Age=31536000`
    ]);
    
    res.redirect('/setting');
});

app.get('/proxy/:id', (req, res) => {
  const id = req.params.id;
  res.render(`../read/proxy/${id}.ejs`, { id: id });
});

app.get('/songs/rainbow', async (req, res) => {
  let videoId = "RMZNjFkJK7E";
  
  try {
    const videoInfo = await fetchVideoInfoParallel(videoId);
    const streamUrl = "https://cdn.glitch.me/e7208106-7973-47a2-8d4b-9fdc27b708a0/rainbow.mp4?v=1726103047477";
    
    const templateData = {
      stream_url: streamUrl,
      videoId: videoId,
      channelId: videoInfo.authorId,
      channelName: videoInfo.author,
      channelImage: videoInfo.authorThumbnails?.[videoInfo.authorThumbnails.length - 1]?.url || '',
      videoTitle: videoInfo.title,
      videoDes: videoInfo.descriptionHtml,
      videoViews: videoInfo.viewCount,
      likeCount: videoInfo.likeCount
    };

    res.render('infowatch', templateData);
  } catch (error) {
    console.error(error);
    res.status(500).render('matte', { videoId, error: '動画を取得できません', details: error.message });
  }
});

app.get('/gethtml/:encodedUrl', async (req, res) => {
  const { encodedUrl } = req.params;
  
  const replacedUrl = decodeURIComponent(encodedUrl);
  
  const url = replacedUrl.replace(/\.wakame02\./g, '.');

  if (!url) {
    return res.status(400).send('URLが入力されていません');
  }
  
  try {
    const response = await axios.get(url);
    const html = response.data;
    res.setHeader('Content-Type', 'text/plain');
    res.send(html);
  } catch (error) {
    res.status(500).send('URLの取得に失敗しました');
  }
});

app.get('/getinv/:encodedUrl', async (req, res) => {

  const { encodedUrl } = req.params;
  const replacedUrl = decodeURIComponent(encodedUrl);
  const invurl = replacedUrl.replace(/\.wakame02\./g, '.');
  const videoId = "H08YWE4CIFQ";
  
  try {
    const videoInfo = await axios.get(`${invurl}/api/v1/videos/H08YWE4CIFQ`);
    
    const formatStreams = videoInfo.formatStreams || [];
    const streamUrl = formatStreams.reverse().map(stream => stream.url)[0];
    
    const templateData = {
      stream_url: streamUrl,
      videoId: videoId,
      channelId: videoInfo.authorId,
      channelName: videoInfo.author,
      channelImage: videoInfo.authorThumbnails?.[videoInfo.authorThumbnails.length - 1]?.url || '',
      videoTitle: videoInfo.title,
      videoDes: videoInfo.descriptionHtml,
      videoViews: videoInfo.viewCount,
      likeCount: videoInfo.likeCount
    };

    res.render('infowatch', templateData);
  } catch (error) {
        res.status(500).render('matte', { 
      videoId, 
      error: '動画を取得できません', 
      details: error.message 
    });
  }
});
app.get('/getpage/:encodedUrl', async (req, res) => {
  const { encodedUrl } = req.params;
  
  const replacedUrl = decodeURIComponent(encodedUrl);
  
  const url = replacedUrl.replace(/\.wakame02\./g, '.');

  if (!url) {
    return res.status(400).send('URLが入力されていません');
  }
  const baseUrl = new URL(url);
  try {
    const response = await axios.get(url);
    let html = response.data;
  html = html.replace(/<a\s+([\s\S]*?)href="([\s\S]*?)"([\s\S]*?)>([\s\S]*?)<\/a>/g, (match, beforeHref, url, afterHref, innerText) => {
  let absoluteUrl;

  try {
    if (url.startsWith('http') || url.startsWith('https')) {
      absoluteUrl = url;
    } else {
      absoluteUrl = new URL(url, baseUrl).href;
    }
  } catch (e) {
    console.error('Error parsing URL:', url, e);
    return match;
  }

  const replacedAbsoluteUrl = absoluteUrl.replace(/\./g, '.wakame02.');
  const encoded = encodeURIComponent(replacedAbsoluteUrl);

  return `<a ${beforeHref}href="/getpage/${encoded}"${afterHref}>${innerText}</a>`;
});
    res.send(html);
  } catch (error) {
    res.status(500).send('URLの取得に失敗しました');
  }
});

app.get('/getwakame/:encodedUrl', async (req, res) => {
  const { encodedUrl } = req.params;
  if (!encodedUrl) {
    return res.status(400).send('URLが入力されていません');
  }

  const replacedUrl = decodeURIComponent(encodedUrl).replace(/\.wakame02\./g, '.');

  try {
    const response = await axios.get(replacedUrl);
    
    if (response.status !== 200) {
      return res.status(response.status).send('URLの取得に失敗しました');
    }

    let html = response.data;
    const baseUrl = new URL(replacedUrl);
    console.log(baseUrl)
  html = html.replace(/<a\s+([\s\S]*?)href="([\s\S]*?)"([\s\S]*?)>([\s\S]*?)<\/a>/g, (match, beforeHref, url, afterHref, innerText) => {
  let absoluteUrl;

  try {
    if (url.startsWith('http') || url.startsWith('https')) {
      absoluteUrl = url;
    } else {
      absoluteUrl = new URL(url, baseUrl).href;
    }
  } catch (e) {
    console.error('Error parsing URL:', url, e);
    return match;
  }

  const replacedAbsoluteUrl = absoluteUrl.replace(/\./g, '.wakame02.');
  const encoded = encodeURIComponent(replacedAbsoluteUrl);

  return `<a ${beforeHref}href="/getwakame/${encoded}"${afterHref}>${innerText}</a>`;
});

html = html.replace(/<img\s+([\s\S]*?src="([\s\S]*?)"[\s\S]*?)>/g, (match, fullTag, url) => {
  let absoluteUrl;
  if (url.startsWith('http') || url.startsWith('https')) {
    absoluteUrl = url;
  } else {
    absoluteUrl = new URL(url, baseUrl).href;
  }

  const encodedString = Buffer.from(absoluteUrl).toString('base64');
  const replacedAbsoluteUrl = encodedString.replace(/\./g, '.wakame02.');
  const encoded = encodeURIComponent(replacedAbsoluteUrl);

  return `<img ${fullTag.replace(url, `/getimage/${encoded}`)}>`;
});
    const linkTags = html.match(/<link\s+[^>]*href="([^"]+)"[^>]*>/g);

    if (linkTags) {
      for (const match of linkTags) {
        const href = match.match(/href="([^"]+)"/)[1];
        let absoluteUrl;
        if (href.startsWith('http') || href.startsWith('https') || href.startsWith('//')) {
          absoluteUrl = href;
        } else {
            absoluteUrl = new URL(href, baseUrl).href;
        }

        try {
          const cssResponse = await axios.get(absoluteUrl);
          if (cssResponse.status === 200) {
            html = html.replace(match, `<style>${cssResponse.data}</style>`);
          }
        } catch (error) {
          console.error('CSSの取得に失敗しました:', error.message);
        }
      }
    }
    
    res.send(html);
  } catch (error) {
    console.error('Error fetching URL:', error.message);
    res.status(500).send('サーバーエラー：URLの取得に失敗しました');
  }
});

function decodeBase64Url(encodedUrl) {
    return Buffer.from(encodedUrl, 'base64').toString('ascii');
}
app.get('/getimage/:encodedUrl', (req, res) => {
  const encodedUrl = req.params.encodedUrl;
  const decodedUrl = decodeBase64Url(encodedUrl);
  const imageUrl = decodedUrl.replace(/\.wakame02\./g, '.');
    miniget(imageUrl)
        .on('error', (err) => {
            console.error('Error fetching image:', err);
            res.status(500).send('Error fetching image');
        })
        .pipe(res);
});

const scdl = require('soundcloud-downloader').default;

app.get('/wakams', (req, res) => {
    res.render('wakamusic', { tracks: [] , query: [] });
});

app.get('/wakamc', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).send('Search query is required');
    }

    try {
        const searchResults = await scdl.search({ query: query, resourceType: 'tracks' });

        const tracks = searchResults.collection.slice(0, 10).map(track => ({
            id: track.id,
            title: track.title,
            username: track.user.username,
            artwork_url: track.artwork_url ? track.artwork_url.replace('-large', '-t500x500') : 'https://via.placeholder.com/500'
        }));

        res.render('wakamusic', { tracks: tracks , query: query });
    } catch (error) {
        console.error('Error occurred while searching:', error);
        res.status(500).send('えらー。あらら');
    }
});

app.get('/okiniiri', (req, res) => {
    let favorites = [];

    const cookie = req.headers.cookie
        .split('; ')
        .find(row => row.startsWith('wakamemusicfavorites='));

    if (cookie) {
        try {
            favorites = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
        } catch (error) {
            console.error('Error parsing cookie:', error);
        }
    }

    res.render('okiniiri', { tracks: favorites });
});

app.get('/wakamc/f', (req, res) => {
    let favorites = [];

    const cookie = req.headers.cookie
        .split('; ')
        .find(row => row.startsWith('wakamemusicfavorites='));

    if (cookie) {
        try {
            favorites = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
        } catch (error) {
            console.error('Error parsing cookie:', error);
        }
    }

    res.render('wakamemusicf', { favorites: favorites });
});

app.get('/wakameokini', (req, res) => {
    let favorites = [];

    const cookie = req.headers.cookie
        .split('; ')
        .find(row => row.startsWith('wakametubefavorites='));

    if (cookie) {
        try {
            favorites = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
        } catch (error) {
            console.error('Error parsing cookie:', error);
        }
    }
    res.render('wakameokiniiri', { tracks: favorites });
});


app.get('/wakamehistory', (req, res) => {
    let favorites = [];

    const cookie = req.headers.cookie
        .split('; ')
        .find(row => row.startsWith('wakametubehistory='));

    if (cookie) {
        try {
            favorites = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
        } catch (error) {
            console.error('Error parsing cookie:', error);
        }
    }
    res.render('wakamehistory', { tracks: favorites });
});

app.get('/suggest', (req, res) => {
    const keyword = req.query.keyword;
    const options = {
        hostname: 'www.google.com',
        path: `/complete/search?client=youtube&hl=ja&ds=yt&q=${encodeURIComponent(keyword)}`,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    };
    const request = http.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            const jsonString = data.substring(data.indexOf('['), data.lastIndexOf(']') + 1);

            try {
                const suggestionsArray = JSON.parse(jsonString);
                const suggestions = suggestionsArray[1].map(i => i[0]);
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.json(suggestions);
            } catch (error) {
                console.error('JSON parse error:', error);
                res.status(500).send({ error: 'えらー。あらら' });
            }
        });
    });
    request.on('error', (error) => {
        console.error('Request error:', error);
        res.status(500).send({ error: 'えらー。あらら' });
    });
    request.end();
});


app.get("/topvideos", async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 1000;

    const { data, error } = await supabase
      .from('history')              
      .select('videoId, videoTitle') 
      .order('id', { ascending: false })
      .limit(count);

    if (error) {
      throw new Error(`データ取得エラー: ${error.message}`);
    }

    const videoCount = data.reduce((acc, { videoId, videoTitle }) => {
      if (!acc[videoId]) {
        acc[videoId] = { count: 0, videoTitle };
      }
      acc[videoId].count += 1;
      return acc;
    }, {});

    const topVideos = Object.entries(videoCount)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 25);
    
    console.log(topVideos);

    res.render("../views/top-videos.ejs", { topVideos, count });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    res.status(500).send('データを取得できませんでした');
  }
});

app.get('/watch', (req, res) => {
  const videoId = req.query.v;
  if (videoId) {
    res.redirect(`/w/${videoId}`);
  } else {
    res.redirect(`/`);
  }
});
app.get('/channel/:id', (req, res) => {
  const id = req.params.id;
    res.redirect(`/c/${id}`);
});
app.get('/channel/:id/join', (req, res) => {
  const id = req.params.id;
  res.redirect(`/c/${id}`);
});
app.get('/hashtag/:des', (req, res) => {
  const des = req.params.des;
  res.redirect(`/s?q=${des}`);
});

app.get('/redirect', (req, res) => {
  const subp = req.query.p;
  const id= req.query.id;
  if (id) {
    res.redirect(`/${subp}/${id}`);
  } else {
    res.redirect(`/${subp}`);
  }
});

app.get("/block/cc3q",(req, res) => {
    let referer = req.get('Referer') || 'No referer information';
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  res.render('../views/tst/2.ejs', { ip: ip });
})

app.get('/edu', (req, res) =>{
  res.render('edu/home');
})

app.get('/wk/:id', async(req, res) => {
  const { id } = req.params;
  try{
    const response = await axios.get(`https://wccreat.glitch.me/data/${id}`);
    const html = response.data.html;
    res.send(html);
  }catch(error){
    res.stat(500).send("ページが存在していません。");
  }
});

app.get('/edu/create/:id', (req, res) => {
  const { id } = req.params;
  res.render('edu/create', { id });
});

app.get('/edu/edit/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://wccreat.glitch.me/data/${id}`);
    const html = response.data.html;
    res.render('edu/edit', { id, html });
  } catch (error) {
    console.error('Error fetching HTML:', error.message);
    res.status(500).send('HTMLデータの取得中にエラーが発生しました。');
  }
});

app.get('/edu/f/:id', (req, res) => {
  const id = req.params.id;
  res.render(`edu/f/${id}`);
});

app.get('/edu/help/:id', (req, res) => {
  const id = req.params.id;
  res.render(`edu/help/${id}`);
});

app.get('/edu/site/:id', (req, res) => {
  const id = req.params.id;
  res.render(`edu/site/${id}`);
});

app.get('/edu/sitehtml/:id', (req, res) => {
  const id = req.params.id;
  res.render(`edu/sitehtml/${id}`);
});

app.get('/edu/site', (req, res) => {
  const id = req.params.id;
  res.render(`edu/site`);
});

app.all("/edu/request",async(req,res)=>{
  try{
    const path=req.query.path;
    const options={
      method:req.method,
      url:`https://wccreat.glitch.me${path}`,
      headers:{...req.headers,host:undefined},
      data:["POST","PUT","PATCH"].includes(req.method)? req.body: null
    };
    const {data:response}=await axios(options);
    res.set("Content-Type", "text/plain").send(response);
  }catch(e){
    console.error(e);
    res.send({message:"リクエストに失敗しました"});
  }
});

app.use((req, res) => {
	res.status(404).render("error.ejs", {
		title: "404 Not found",
	});
});



process.on("unhandledRejection", console.error);
