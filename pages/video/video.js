// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],//导航标签数据
    navId: '',//导航的标识
    videoList: [],//视频列表数据
    videoId: '',//视频id标识
    videoUpdateTime: [],//记录video播放的时长[{time,vid},{}]
    isTriggered: false,//标记是否被触发下拉刷新
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupListData();

  },

  // 获取导航数据
  async getVideoGroupListData() {
    let videoGroupListData = await request('/video/group/list');
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      navId: videoGroupListData.data[0].id
    })
    this.getVideoList(this.data.navId);
  },
  // 获取视频列表数据
  async getVideoList(navId) {
    if (!navId) {//空串先返回
      return;
    }
    let videoListData = await request('/video/group', { id: navId })
    //关闭消息提示框
    wx.hideLoading();

    let index = 0;
    let videoList = videoListData.datas.map(item => {
      item.id = index++;
      return item;
    })
    this.setData({
      videoList,
      //关闭下拉刷新
      isTriggered: false
    })
  },
  // 点击切换导航的回调
  changeNav(event) {
    // 比较点击的navID和绑定的item.id是否相等，相等就加上类active
    let navId = event.currentTarget.id;//自动转化为String,如果用dataset传递是不会自动转换的
    this.setData({
      // navId>>>0强制转换为number
      navId: navId * 1,
      videoList: []
    })
    //显示正在加载
    wx.showLoading({
      title: '正在加载'
    })
    //动态获取当前导航对应的视频数据
    this.getVideoList(this.data.navId);

  },
  //点击播放/继续播放的回调--解决两个视频同时播放的问题---这里获取不到网易云视频看不到效果
  handlePlay(event) {
    // 单例模式：1.需要创建多个对象的场景下，通过一个变量接受，始终保持只有一个对象2.节省内存空间
    let vid = event.currentTarget.id;
    // 保证点击的是不同的视频
    this.vid !== vid && this.videoContext && this.videoContext.stop();
    this.vid = vid;
    // 更新data中videoId的状态数据
    this.setData({
      videoId: vid
    })
    //创建video标签的实例对象
    this.videoContext = wx.createVideoContext(vid);
    //判断当前的视频之前是否播放过，是否有播放记录，有就跳转
    let { videoUpdateTime } = this.data;
    let videoItem = videoUpdateTime.find(item => item.vid === vid);
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime);//跳转到指定位置

    }
    this.videoContext.play();

  },
  //监听视频播放进度的回调
  handleTimeUpdate(event) {
    let videoTimeObj = { vid: event.currentTarget.id, currentTime: event.detail.currentTime }
    //判断之前数组里面有没有这个对象，有就更新时间，没有就添加，最后设置数据
    let { videoUpdateTime } = this.data;
    let videoObj = videoUpdateTime.find(item => item.vid == videoTimeObj.vid)
    if (videoObj) {
      videoObj.currentTime = videoTimeObj.currentTime;
    } else {
      videoUpdateTime.push(videoTimeObj);
    }
    this.setData({
      videoUpdateTime
    })
  },
  //视频播放结束的时候调用
  handleEnded(event) {
    //移除记录播放时长数组中当前视频的对象
    let { videoUpdateTime } = this.data;

    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id), 1)
  },
  //下拉刷新
  handleRefresher() {
    this.getVideoList(this.data.navId);
  },
  //上拉加载
  handleToLower() {
    //模拟数据
    let newVideoList = [
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_12CC2540689A6A01B44A2F4D8A9F6AA7",
          "coverUrl": "https://p1.music.126.net/ZFioavJja3s5Z6HAVQxFMQ==/109951163699701450.jpg",
          "height": 1080,
          "width": 1920,
          "title": "艾伦沃克新歌又火了！迷幻旋律动听女声，歌词直击人心",
          "description": "",
          "commentCount": 209,
          "shareCount": 371,
          "resolutions": [
            {
              "resolution": 240,
              "size": 16859287
            },
            {
              "resolution": 480,
              "size": 28521680
            },
            {
              "resolution": 720,
              "size": 41646514
            },
            {
              "resolution": 1080,
              "size": 77038906
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 510000,
            "authStatus": 1,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/Bol2Dm0VR9a9pgF8a100RQ==/109951164801198620.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 510100,
            "birthday": 766618639605,
            "userId": 410654889,
            "userType": 204,
            "nickname": "DEERMUSIC",
            "signature": "保持乐观开心，爱音乐爱图片，喜欢的小伙伴随便撩❤️🎵🐰",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951164801198620,
            "backgroundImgId": 109951165815156420,
            "backgroundUrl": "http://p1.music.126.net/Qd-rQvcmtulqRTEfjWrPlg==/109951165815156417.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐原创视频达人"
            },
            "djStatus": 10,
            "vipType": 0,
            "remarkName": null,
            "backgroundImgIdStr": "109951165815156417",
            "avatarImgIdStr": "109951164801198620"
          },
          "urlInfo": {
            "id": "12CC2540689A6A01B44A2F4D8A9F6AA7",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/J8EYik7F_2160603204_uhd.mp4?ts=1657360956&rid=1F27D1921392689DB7583450FC114BA7&rl=3&rs=CeersdeOmOSUUQAmYVmxPxdFnXzpOMlP&sign=266d9ca0860df6450c3273b0157c662b&ext=kVncLZkLyOqNW1gBJTdZzxrP%2FTsVqE762rN%2BV0tn5K1HJUWisd53xdOFi79tsUo3Hq%2BhIGe2SHHCcaRpP9XvMAtiKQZF4E8FR%2BpM%2BLsqOxXsvIfhS2cUN8p%2Bo%2BFWFtWV6hSXmXXjEA%2FE4oPhK3mXok9DK3VpTSMXRaNesBNlKrJ2SZlqnDZxe2fORiyESHxFCh0cJXjcxr7tBp%2BMTsExokzcscLGMhJYPuOhUwpEbpBvi0cbRT8jvnYMRCs0O1YU",
            "size": 77038906,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [
            {
              "id": 9136,
              "name": "艾兰·沃克",
              "alg": null
            },
            {
              "id": 9104,
              "name": "电子",
              "alg": null
            },
            {
              "id": 4104,
              "name": "电音",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 15249,
              "name": "Alan Walker",
              "alg": null
            },
            {
              "id": 25137,
              "name": "音乐资讯",
              "alg": null
            },
            {
              "id": 13254,
              "name": "欧美资讯",
              "alg": null
            },
            {
              "id": 14187,
              "name": "新歌推荐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "12CC2540689A6A01B44A2F4D8A9F6AA7",
          "durationms": 136086,
          "playTime": 621583,
          "praisedCount": 2620,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_91B9B855E011817BCB9B631299BC1EB7",
          "coverUrl": "https://p2.music.126.net/_dPRKlGkasJkY26yjt6M8A==/109951164995784926.jpg",
          "height": 1080,
          "width": 1920,
          "title": "最近很火的青钢影BGM，这句“我没说你可以走了”太燃了！",
          "description": "分享三首最近特别火的英雄联盟台词向歌曲\n①：优雅永不过时；我没说你可以走了--青钢影\n②：没有撤退可言-亚托克斯\n③：欢迎来到祖安--艾克",
          "commentCount": 148,
          "shareCount": 220,
          "resolutions": [
            {
              "resolution": 240,
              "size": 24219075
            },
            {
              "resolution": 480,
              "size": 41085124
            },
            {
              "resolution": 720,
              "size": 59860467
            },
            {
              "resolution": 1080,
              "size": 100478802
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 430000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/zhiko5uohH5ysFaK58GE1w==/109951165140421577.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 430100,
            "birthday": 872006400000,
            "userId": 1566634844,
            "userType": 204,
            "nickname": "唯一燃音乐",
            "signature": "生活已经安静了太久，需要音乐带来热闹的理由！\n （有视频疑问私信）",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951165140421580,
            "backgroundImgId": 109951165811671060,
            "backgroundUrl": "http://p1.music.126.net/ddYc_CSnzRaR_av4dpxu8g==/109951165811671051.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐原创视频达人"
            },
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "backgroundImgIdStr": "109951165811671051",
            "avatarImgIdStr": "109951165140421577"
          },
          "urlInfo": {
            "id": "91B9B855E011817BCB9B631299BC1EB7",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/qHy6q4u8_2993483969_uhd.mp4?ts=1657360956&rid=1F27D1921392689DB7583450FC114BA7&rl=3&rs=GJizVBVIITdLzEhEBFNMsBNWRItjEsOu&sign=f743663c2228c37e4e5b52e1128216ce&ext=kVncLZkLyOqNW1gBJTdZzxrP%2FTsVqE762rN%2BV0tn5K1HJUWisd53xdOFi79tsUo3Hq%2BhIGe2SHHCcaRpP9XvMAtiKQZF4E8FR%2BpM%2BLsqOxXsvIfhS2cUN8p%2Bo%2BFWFtWV6hSXmXXjEA%2FE4oPhK3mXok9DK3VpTSMXRaNesBNlKrJ2SZlqnDZxe2fORiyESHxFCh0cJXjcxr7tBp%2BMTsExokzcscLGMhJYPuOhUwpEbpBvi0cbRT8jvnYMRCs0O1YU",
            "size": 100478802,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [
            {
              "id": 2103,
              "name": "游戏",
              "alg": null
            },
            {
              "id": 9104,
              "name": "电子",
              "alg": null
            },
            {
              "id": 4104,
              "name": "电音",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 23116,
              "name": "音乐推荐",
              "alg": null
            },
            {
              "id": 15102,
              "name": "华语音乐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "虚拟",
              "id": 421423808,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 1007170,
                  "name": "陈粒",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 100,
              "st": 0,
              "rt": null,
              "fee": 8,
              "v": 33,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 34780579,
                "name": "小梦大半",
                "picUrl": "http://p4.music.126.net/HQxTggMCB7AHUXN-ZFEtmA==/1371091013186741.jpg",
                "tns": [],
                "pic": 1371091013186741
              },
              "dt": 240626,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 9627733,
                "vd": -7972
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 5776657,
                "vd": -5343
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 3851119,
                "vd": -3596
              },
              "a": null,
              "cd": "1",
              "no": 9,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 2,
              "s_id": 0,
              "rtype": 0,
              "rurl": null,
              "mst": 9,
              "cp": 1416476,
              "mv": 5368127,
              "publishTime": 1469462400007,
              "privilege": {
                "id": 421423808,
                "fee": 8,
                "payed": 0,
                "st": 0,
                "pl": 128000,
                "dl": 0,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 999000,
                "fl": 128000,
                "toast": false,
                "flag": 0,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "91B9B855E011817BCB9B631299BC1EB7",
          "durationms": 210280,
          "playTime": 421944,
          "praisedCount": 3066,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_30B990CD9E2606915788784ACC7EB95D",
          "coverUrl": "https://p2.music.126.net/_KI89Tzh0gq6vq76TNaRJA==/109951163144595833.jpg",
          "height": 720,
          "width": 1280,
          "title": "10岁小女孩演唱艾伦沃克热单《Sing Me To Sleep》惊艳！",
          "description": "10岁小女孩Angelina Jordan演唱Alan Walker大热单《Sing Me To Sleep》~2分半后高能开始~[奸笑]",
          "commentCount": 0,
          "shareCount": 0,
          "resolutions": [
            {
              "resolution": 240,
              "size": 39555875
            },
            {
              "resolution": 480,
              "size": 56437890
            },
            {
              "resolution": 720,
              "size": 90834609
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 340000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/OqEkaKwFoV2XgsddPGfcow==/109951165474023172.jpg",
            "accountStatus": 0,
            "gender": 0,
            "city": 340100,
            "birthday": 631123200000,
            "userId": 415197557,
            "userType": 207,
            "nickname": "全球音乐吧",
            "signature": "",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951165474023170,
            "backgroundImgId": 109951166223106900,
            "backgroundUrl": "http://p1.music.126.net/p1stKDNMdYwRKoEtTcQogQ==/109951166223106890.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐视频达人",
              "2": "欧美音乐资讯达人"
            },
            "djStatus": 10,
            "vipType": 11,
            "remarkName": null,
            "backgroundImgIdStr": "109951166223106890",
            "avatarImgIdStr": "109951165474023172"
          },
          "urlInfo": {
            "id": "30B990CD9E2606915788784ACC7EB95D",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/dJS97bzz_1292885200_shd.mp4?ts=1657360956&rid=1F27D1921392689DB7583450FC114BA7&rl=3&rs=tNUFRpnaexAfyAYOYtvuBAdiSvMXNbom&sign=2e474f2fbfe09a8e77495b6b8a18a7fe&ext=kVncLZkLyOqNW1gBJTdZzxrP%2FTsVqE762rN%2BV0tn5K1HJUWisd53xdOFi79tsUo3Hq%2BhIGe2SHHCcaRpP9XvMAtiKQZF4E8FR%2BpM%2BLsqOxXsvIfhS2cUN8p%2Bo%2BFWFtWV6hSXmXXjEA%2FE4oPhK3mXok9DK3VpTSMXRaNesBNlKrJ2SZlqnDZxe2fORiyESHxFCh0cJXjcxr7tBp%2BMTsExokzcscLGMhJYPuOhUwpEbpBvi0cbRT8jvnYMRCs0O1YU",
            "size": 90834609,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [
            {
              "id": 60100,
              "name": "翻唱",
              "alg": null
            },
            {
              "id": 58109,
              "name": "国外达人",
              "alg": null
            },
            {
              "id": 9136,
              "name": "艾兰·沃克",
              "alg": null
            },
            {
              "id": 9104,
              "name": "电子",
              "alg": null
            },
            {
              "id": 4104,
              "name": "电音",
              "alg": null
            },
            {
              "id": 12100,
              "name": "流行",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 15249,
              "name": "Alan Walker",
              "alg": null
            },
            {
              "id": 14146,
              "name": "兴奋",
              "alg": null
            },
            {
              "id": 16131,
              "name": "英文",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "Sing Me to Sleep",
              "id": 415792222,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 1045123,
                  "name": "Alan Walker",
                  "tns": [],
                  "alias": []
                },
                {
                  "id": 1078390,
                  "name": "Iselin Solheim",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 100,
              "st": 0,
              "rt": null,
              "fee": 8,
              "v": 32,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 34720510,
                "name": "Sing Me To Sleep",
                "picUrl": "http://p4.music.126.net/NPLCsSrfxMLhZJQs_x4joQ==/109951165976851791.jpg",
                "tns": [],
                "pic_str": "109951165976851791",
                "pic": 109951165976851790
              },
              "dt": 189387,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 7575554,
                "vd": -66153
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 4545350,
                "vd": -63892
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 3030248,
                "vd": -62459
              },
              "a": null,
              "cd": "1",
              "no": 1,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 1,
              "s_id": 0,
              "rtype": 0,
              "rurl": null,
              "mst": 9,
              "cp": 7001,
              "mv": 5328167,
              "publishTime": 1464883200000,
              "privilege": {
                "id": 415792222,
                "fee": 8,
                "payed": 0,
                "st": 0,
                "pl": 128000,
                "dl": 0,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 320000,
                "fl": 128000,
                "toast": false,
                "flag": 4,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "30B990CD9E2606915788784ACC7EB95D",
          "durationms": 337191,
          "playTime": 24395,
          "praisedCount": 0,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_F80BAF33496B3736B00FA388E194AC86",
          "coverUrl": "https://p2.music.126.net/xXhvYlJBkyvVUtY2QCh9lA==/109951163572656969.jpg",
          "height": 720,
          "width": 1280,
          "title": "钢琴曲谱教学 Alan Walker 《The Spectre》，想学的抓紧看看！",
          "description": "钢琴曲谱教学 Alan Walker 《The Spectre》，想学的赶紧操练起来。",
          "commentCount": 207,
          "shareCount": 881,
          "resolutions": [
            {
              "resolution": 240,
              "size": 24376024
            },
            {
              "resolution": 480,
              "size": 35010808
            },
            {
              "resolution": 720,
              "size": 55758165
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 340000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/C6VID_CReqmt8ETsUWaYTQ==/18499283139231828.jpg",
            "accountStatus": 0,
            "gender": 0,
            "city": 340100,
            "birthday": -2209017600000,
            "userId": 479954154,
            "userType": 207,
            "nickname": "音乐诊疗室",
            "signature": "当我坐在那架破旧古钢琴旁边的时候，我对最幸福的国王也不羡慕。（合作推广请私信，或者+V信：mjs927721）",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 18499283139231828,
            "backgroundImgId": 1364493978647983,
            "backgroundUrl": "http://p1.music.126.net/i4J_uvH-pb4sYMsh4fgQAA==/1364493978647983.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐视频达人",
              "2": "音乐资讯达人"
            },
            "djStatus": 0,
            "vipType": 11,
            "remarkName": null,
            "backgroundImgIdStr": "1364493978647983",
            "avatarImgIdStr": "18499283139231828"
          },
          "urlInfo": {
            "id": "F80BAF33496B3736B00FA388E194AC86",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/pVuehq4D_23292535_shd.mp4?ts=1657360956&rid=1F27D1921392689DB7583450FC114BA7&rl=3&rs=NeYRYIhfsiUxHVHIuUaEfCAhQyYcoMud&sign=3d1773c16b8ec9e3627819a7629eb42d&ext=kVncLZkLyOqNW1gBJTdZzxrP%2FTsVqE762rN%2BV0tn5K1HJUWisd53xdOFi79tsUo3Hq%2BhIGe2SHHCcaRpP9XvMAtiKQZF4E8FR%2BpM%2BLsqOxXsvIfhS2cUN8p%2Bo%2BFWFtWV6hSXmXXjEA%2FE4oPhK3mXok9DK3VpTSMXRaNesBNlKrJ2SZlqnDZxe2fORiyESHxFCh0cJXjcxr7tBp%2BMTsExokzcscLGMhJYPuOhUwpEbpBvi0cbRT8jvnYMRCs0O1YU",
            "size": 55758165,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [
            {
              "id": 4103,
              "name": "演奏",
              "alg": null
            },
            {
              "id": 9136,
              "name": "艾兰·沃克",
              "alg": null
            },
            {
              "id": 9104,
              "name": "电子",
              "alg": null
            },
            {
              "id": 4104,
              "name": "电音",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 15249,
              "name": "Alan Walker",
              "alg": null
            },
            {
              "id": 23116,
              "name": "音乐推荐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "The Spectre",
              "id": 506092035,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 1045123,
                  "name": "Alan Walker",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 100,
              "st": 0,
              "rt": null,
              "fee": 8,
              "v": 107,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 36224021,
                "name": "The Spectre",
                "picUrl": "http://p3.music.126.net/P6XMbCPENqlMsvPDEGIQxg==/109951165982513700.jpg",
                "tns": [],
                "pic_str": "109951165982513700",
                "pic": 109951165982513700
              },
              "dt": 193828,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 7754231,
                "vd": -33665
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 4652556,
                "vd": -31326
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 3101719,
                "vd": -29991
              },
              "a": null,
              "cd": "1",
              "no": 1,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 1,
              "s_id": 0,
              "rtype": 0,
              "rurl": null,
              "mst": 9,
              "cp": 7001,
              "mv": 5666029,
              "publishTime": 1505404800000,
              "privilege": {
                "id": 506092035,
                "fee": 8,
                "payed": 0,
                "st": 0,
                "pl": 128000,
                "dl": 0,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 320000,
                "fl": 128000,
                "toast": false,
                "flag": 4,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "F80BAF33496B3736B00FA388E194AC86",
          "durationms": 202780,
          "playTime": 351840,
          "praisedCount": 2676,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_EF6FA6BF4DAA06F6092EC58D1BBFEE54",
          "coverUrl": "https://p2.music.126.net/SnP8PGMgz96z4byAO9jU8Q==/109951163572747184.jpg",
          "height": 720,
          "width": 1280,
          "title": "OMFG《Hello》还能这么玩？这是爱因斯坦搭建的设备吧！",
          "description": "OMFG《Hello》还能这么玩？这是爱因斯坦搭建的设备吧！",
          "commentCount": 2340,
          "shareCount": 5922,
          "resolutions": [
            {
              "resolution": 240,
              "size": 26178107
            },
            {
              "resolution": 480,
              "size": 37372216
            },
            {
              "resolution": 720,
              "size": 59503293
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 1000000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/1vXZspuEC2GmhQfqqZQb6g==/109951166006968184.jpg",
            "accountStatus": 0,
            "gender": 0,
            "city": 1004400,
            "birthday": 960566400000,
            "userId": 18607052,
            "userType": 204,
            "nickname": "YouTube",
            "signature": "音乐视频自媒体 Vx：307752336",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951166006968200,
            "backgroundImgId": 109951166584722620,
            "backgroundUrl": "http://p1.music.126.net/tSYDGbYWtl_TQ1zW8RxJMw==/109951166584722618.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "泛生活视频达人",
              "2": "生活图文达人"
            },
            "djStatus": 10,
            "vipType": 11,
            "remarkName": null,
            "backgroundImgIdStr": "109951166584722618",
            "avatarImgIdStr": "109951166006968184"
          },
          "urlInfo": {
            "id": "EF6FA6BF4DAA06F6092EC58D1BBFEE54",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/CdWF0MqU_73612670_shd.mp4?ts=1657360956&rid=1F27D1921392689DB7583450FC114BA7&rl=3&rs=qMbimJVOOrxKHycMouQBDcyGTSjXFDkz&sign=456a5fce00a83b0ccd1ab84557c130da&ext=kVncLZkLyOqNW1gBJTdZzxrP%2FTsVqE762rN%2BV0tn5K1HJUWisd53xdOFi79tsUo3Hq%2BhIGe2SHHCcaRpP9XvMAtiKQZF4E8FR%2BpM%2BLsqOxXsvIfhS2cUN8p%2Bo%2BFWFtWV6hSXmXXjEA%2FE4oPhK3mXok9DK3VpTSMXRaNesBNlKrJ2SZlqnDZxe2fORiyESHxFCh0cJXjcxr7tBp%2BMTsExokzcscLGMhJYPuOhUwpEbpBvi0cbRT8jvnYMRCs0O1YU",
            "size": 59503293,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [
            {
              "id": 9104,
              "name": "电子",
              "alg": null
            },
            {
              "id": 4104,
              "name": "电音",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 23116,
              "name": "音乐推荐",
              "alg": null
            },
            {
              "id": 13164,
              "name": "快乐",
              "alg": null
            },
            {
              "id": 15229,
              "name": "英语",
              "alg": null
            },
            {
              "id": 15149,
              "name": "创意音乐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "Hello",
              "id": 33211676,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 381949,
                  "name": "OMFG",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 100,
              "st": 0,
              "rt": null,
              "fee": 8,
              "v": 63,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 3190201,
                "name": "Hello",
                "picUrl": "http://p3.music.126.net/sylTociq8lh0QP7BuXRLGQ==/109951164852190706.jpg",
                "tns": [],
                "pic_str": "109951164852190706",
                "pic": 109951164852190700
              },
              "dt": 226307,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 9055129,
                "vd": -72865
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 5433095,
                "vd": -70531
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 3622078,
                "vd": -69149
              },
              "a": null,
              "cd": "1",
              "no": 1,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 0,
              "s_id": 0,
              "rtype": 0,
              "rurl": null,
              "mst": 9,
              "cp": 1416729,
              "mv": 5309845,
              "publishTime": 1416672000000,
              "privilege": {
                "id": 33211676,
                "fee": 8,
                "payed": 0,
                "st": 0,
                "pl": 128000,
                "dl": 0,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 999000,
                "fl": 128000,
                "toast": false,
                "flag": 260,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "EF6FA6BF4DAA06F6092EC58D1BBFEE54",
          "durationms": 224095,
          "playTime": 2006517,
          "praisedCount": 20198,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_EA5498A6B468061ACAC4B2CC059DDA9D",
          "coverUrl": "https://p2.music.126.net/uQ5CwkdbEZqyr2OHTS1_Kg==/109951165028886829.jpg",
          "height": 1080,
          "width": 1920,
          "title": "【Homage/血液机器】迷幻且酷炫的废土科幻",
          "description": "# 超燃计划 #\n素材：电影《血液机器》\nBGM：Homage\n\nSkiptracing - Mild High Club",
          "commentCount": 18,
          "shareCount": 87,
          "resolutions": [
            {
              "resolution": 240,
              "size": 18698451
            },
            {
              "resolution": 480,
              "size": 32738781
            },
            {
              "resolution": 720,
              "size": 49966591
            },
            {
              "resolution": 1080,
              "size": 87959873
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 150000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/opKoByJZYydnpVne9cyVew==/109951166249474043.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 150200,
            "birthday": -2209017600000,
            "userId": 103602066,
            "userType": 204,
            "nickname": "EM47",
            "signature": "有空一起拉屎哦(´-ω-`)",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951166249474050,
            "backgroundImgId": 109951163626438050,
            "backgroundUrl": "http://p1.music.126.net/7Kguc5EQOTP1t80OhE3Hsw==/109951163626438044.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "超燃联盟视频达人"
            },
            "djStatus": 0,
            "vipType": 11,
            "remarkName": null,
            "backgroundImgIdStr": "109951163626438044",
            "avatarImgIdStr": "109951166249474043"
          },
          "urlInfo": {
            "id": "EA5498A6B468061ACAC4B2CC059DDA9D",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/rMJF5lRi_3016519806_uhd.mp4?ts=1657360956&rid=1F27D1921392689DB7583450FC114BA7&rl=3&rs=GosEkqYPPNzvgPHwDTtizGQeHDaqhabg&sign=c3cb22b7405df9679709adcd811f3e42&ext=kVncLZkLyOqNW1gBJTdZzxrP%2FTsVqE762rN%2BV0tn5K1HJUWisd53xdOFi79tsUo3Hq%2BhIGe2SHHCcaRpP9XvMAtiKQZF4E8FR%2BpM%2BLsqOxXsvIfhS2cUN8p%2Bo%2BFWFtWV6hSXmXXjEA%2FE4oPhK3mXok9DK3VpTSMXRaNesBNlKrJ2SZlqnDZxe2fORiyESHxFCh0cJXjcxr7tBp%2BMTsExokzcscLGMhJYPuOhUwpEbpBvi0cbRT8jvnYMRCs0O1YU",
            "size": 87959873,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [
            {
              "id": 1105,
              "name": "最佳饭制",
              "alg": null
            },
            {
              "id": 9104,
              "name": "电子",
              "alg": null
            },
            {
              "id": 4104,
              "name": "电音",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 14212,
              "name": "欧美音乐",
              "alg": null
            },
            {
              "id": 15241,
              "name": "饭制",
              "alg": null
            },
            {
              "id": 23116,
              "name": "音乐推荐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "Homage",
              "id": 424995410,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 11992195,
                  "name": "Mild High Club",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 100,
              "st": 0,
              "rt": null,
              "fee": 8,
              "v": 31,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 34815067,
                "name": "Skiptracing",
                "picUrl": "http://p4.music.126.net/dXV98yjJAahYbHpkzwqvgw==/109951163353719045.jpg",
                "tns": [],
                "pic_str": "109951163353719045",
                "pic": 109951163353719040
              },
              "dt": 177493,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 7102215,
                "vd": -2
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 4261346,
                "vd": -2
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 2840912,
                "vd": -2
              },
              "a": null,
              "cd": "1",
              "no": 2,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 0,
              "s_id": 0,
              "rtype": 0,
              "rurl": null,
              "mst": 9,
              "cp": 743010,
              "mv": 0,
              "publishTime": 1472169600000,
              "privilege": {
                "id": 424995410,
                "fee": 8,
                "payed": 0,
                "st": 0,
                "pl": 128000,
                "dl": 0,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 320000,
                "fl": 128000,
                "toast": false,
                "flag": 261,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "EA5498A6B468061ACAC4B2CC059DDA9D",
          "durationms": 176880,
          "playTime": 60103,
          "praisedCount": 446,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_DAEC00324DE081DC072B09BD90AAAE4D",
          "coverUrl": "https://p2.music.126.net/rdhHaWkYEZ_NCF1OltaG1A==/109951163572664380.jpg",
          "height": 540,
          "width": 540,
          "title": "Cutting Shapes",
          "description": null,
          "commentCount": 104,
          "shareCount": 203,
          "resolutions": [
            {
              "resolution": 240,
              "size": 5501895
            },
            {
              "resolution": 480,
              "size": 10802400
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 1000000,
            "authStatus": 1,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/-nWkenzggN-zpmx2gTCEiQ==/109951167476906187.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 1003000,
            "birthday": 320428800000,
            "userId": 487218777,
            "userType": 2,
            "nickname": "DonDiablo",
            "signature": "The official account of Dutch DJ/producer Don Diablo.",
            "description": "知名荷兰DJ、电子音乐制作人",
            "detailDescription": "知名荷兰DJ、电子音乐制作人",
            "avatarImgId": 109951167476906190,
            "backgroundImgId": 109951166376436580,
            "backgroundUrl": "http://p1.music.126.net/-pTvnwBpu94G4g3HSnq9BA==/109951166376436581.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 10,
            "vipType": 0,
            "remarkName": null,
            "backgroundImgIdStr": "109951166376436581",
            "avatarImgIdStr": "109951167476906187"
          },
          "urlInfo": {
            "id": "DAEC00324DE081DC072B09BD90AAAE4D",
            "url": "http://vodkgeyttp9.vod.126.net/cloudmusic/fwm2TveM_3130841446_hd.mp4?ts=1657360956&rid=1F27D1921392689DB7583450FC114BA7&rl=3&rs=dOtOpItIqlchSNNuMXNYhXgQcrwhvpml&sign=b509a94357717f985a15a50c9a2fea7c&ext=kVncLZkLyOqNW1gBJTdZzxrP%2FTsVqE762rN%2BV0tn5K1HJUWisd53xdOFi79tsUo3Hq%2BhIGe2SHHCcaRpP9XvMAtiKQZF4E8FR%2BpM%2BLsqOxXsvIfhS2cUN8p%2Bo%2BFWFtWV6hSXmXXjEA%2FE4oPhK3mXok9DK3VpTSMXRaNesBNlKrJ2SZlqnDZxe2fORiyESHxFCh0cJXjcxr7tBp%2BMTsExokzcscLGMhJYPuOhUwpEbpBvi0cbRT8jvnYMRCs0O1YU",
            "size": 10802400,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 480
          },
          "videoGroup": [
            {
              "id": 58100,
              "name": "现场",
              "alg": null
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": null
            },
            {
              "id": 9104,
              "name": "电子",
              "alg": null
            },
            {
              "id": 4104,
              "name": "电音",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 16131,
              "name": "英文",
              "alg": null
            },
            {
              "id": 13164,
              "name": "快乐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": [
            109
          ],
          "relateSong": [
            {
              "name": "Cutting Shapes",
              "id": 427542143,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 139072,
                  "name": "Don Diablo",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 100,
              "st": 0,
              "rt": null,
              "fee": 1,
              "v": 16,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 34855075,
                "name": "Cutting Shapes",
                "picUrl": "http://p4.music.126.net/jp4h_qjO-ZpPCPLa22zB3Q==/109951163789250446.jpg",
                "tns": [],
                "pic_str": "109951163789250446",
                "pic": 109951163789250450
              },
              "dt": 179047,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 7164909,
                "vd": -74570
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 4298963,
                "vd": -74570
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 2865990,
                "vd": -74570
              },
              "a": null,
              "cd": "1",
              "no": 1,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 1,
              "s_id": 0,
              "rtype": 0,
              "rurl": null,
              "mst": 9,
              "cp": 1419024,
              "mv": 5461179,
              "publishTime": 1478188800000,
              "privilege": {
                "id": 427542143,
                "fee": 1,
                "payed": 0,
                "st": 0,
                "pl": 0,
                "dl": 0,
                "sp": 0,
                "cp": 0,
                "subp": 0,
                "cs": false,
                "maxbr": 999000,
                "fl": 0,
                "toast": false,
                "flag": 260,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "DAEC00324DE081DC072B09BD90AAAE4D",
          "durationms": 59000,
          "playTime": 132726,
          "praisedCount": 1368,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_FEB6BFB7D5DD4836E34E04AE804F865B",
          "coverUrl": "https://p2.music.126.net/-zo_20hYc2skYq3trlNrJA==/109951165080786607.jpg",
          "height": 1080,
          "width": 1920,
          "title": "最近这段BGM突然火了，配上刘备蹦迪，简直太魔性了",
          "description": "最近这段BGM突然火了，配上刘备蹦迪，简直太魔性了",
          "commentCount": 33,
          "shareCount": 25,
          "resolutions": [
            {
              "resolution": 240,
              "size": 21386025
            },
            {
              "resolution": 480,
              "size": 35743694
            },
            {
              "resolution": 720,
              "size": 52006313
            },
            {
              "resolution": 1080,
              "size": 98511453
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 330000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/te0CwypQW0VE6MoZDDEPrw==/109951163456001950.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 330500,
            "birthday": 860860800000,
            "userId": 427239707,
            "userType": 204,
            "nickname": "唯一音乐老撕鸡",
            "signature": "听最high的歌，开最快的车",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951163456001950,
            "backgroundImgId": 109951162868128400,
            "backgroundUrl": "http://p1.music.126.net/2zSNIqTcpHL2jIvU6hG0EA==/109951162868128395.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐原创视频达人"
            },
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "backgroundImgIdStr": "109951162868128395",
            "avatarImgIdStr": "109951163456001950"
          },
          "urlInfo": {
            "id": "FEB6BFB7D5DD4836E34E04AE804F865B",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/I5U8jdhk_3037632837_uhd.mp4?ts=1657360956&rid=1F27D1921392689DB7583450FC114BA7&rl=3&rs=FVauBxHthOsImLTmQQKPaJczsLERuTje&sign=588704216d6dc7598abd990c75337ed6&ext=kVncLZkLyOqNW1gBJTdZzxrP%2FTsVqE762rN%2BV0tn5K1HJUWisd53xdOFi79tsUo3Hq%2BhIGe2SHHCcaRpP9XvMAtiKQZF4E8FR%2BpM%2BLsqOxXsvIfhS2cUN8p%2Bo%2BFWFtWV6hSXmXXjEA%2FE4oPhK3mXok9DK3VpTSMXRaNesBNlKrJ2SZlqnDZxe2fORiyESHxFCh0cJXjcxr7tBp%2BMTsExokzcscLGMhJYPuOhUwpEbpBvi0cbRT8jvnYMRCs0O1YU",
            "size": 98511453,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [
            {
              "id": 1101,
              "name": "舞蹈",
              "alg": null
            },
            {
              "id": 9104,
              "name": "电子",
              "alg": null
            },
            {
              "id": 4104,
              "name": "电音",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 14212,
              "name": "欧美音乐",
              "alg": null
            },
            {
              "id": 23116,
              "name": "音乐推荐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "FEB6BFB7D5DD4836E34E04AE804F865B",
          "durationms": 176266,
          "playTime": 150901,
          "praisedCount": 545,
          "praised": false,
          "subscribed": false
        }
      }
    ];
    let videoList = this.data.videoList;
    //...拆包，push的是对象而不应该是数组
    //将视频最新数据更新到原有列表中
    videoList.push(...newVideoList);
    this.setData({
      videoList,

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})