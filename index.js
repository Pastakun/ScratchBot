import axios from 'axios'
import express from 'express'
import ws from 'ws'
async function main() {
    try {
        let comments = [];
        let statuscontent = "";
        const resp1 = await axios.get("https://scratch.mit.edu/csrf_token/", {
            headers: {
                'referer': 'https://scratch.mit.edu'
            }
        });

        const scratchcsrftoken = resp1.headers['set-cookie'][1].match(/scratchcsrftoken=([^;]+)/)[1];
        console.log(scratchcsrftoken);
        const resp2 = await axios.post("https://scratch.mit.edu/login/", {
            password: process.env["password"],
            useMessages: true,
            username: "noodle_910"
        }, {
            headers: {
                'x-csrftoken': scratchcsrftoken,
                'x-requested-with': 'XMLHttpRequest',
                'cookie': `scratchcsrftoken=${scratchcsrftoken}; scratchlanguage=en;`,
                'referer': 'https://scratch.mit.edu'
            }
        });
        const scratchsessionsid = resp2.headers['set-cookie'][0].match(/scratchsessionsid="([^"]+)/)[1];
        console.log(scratchsessionsid);

        const resp3 = await axios.get("https://scratch.mit.edu/session/", {
            headers: {
                'cookie': `scratchcsrftoken=${scratchcsrftoken}; scratchlanguage=en; scratchsessionsid=${scratchsessionsid};`,
                'referer': 'https://scratch.mit.edu',
                'x-requested-with': 'XMLHttpRequest'
            }
        });

        const token = resp3.data.user.token;
        console.log(token);
        
        const app = express()
        const port = 8000
        app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader(
              "Access-Control-Allow-Methods",
              "GET, POST, PUT, PATCH, DELETE, OPTION"
            );
            res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            next();
        });
        app.get('/', function(req, res){
            res.send('Hello World!');
        })
        app.use(express.json());
        app.post('/users', function(req, res){
            statuscontent = req.body.content;
        })
        app.listen(port, function(){
            console.log(`Listening on port ${port}!`);
        })
        setInterval(async function(){
            try {
                const resp4 = await axios.put(
                    "https://projects.scratch.mit.edu/946162940",
                    {
                        "targets": [
                          {
                            "isStage": true,
                            "name": "Stage",
                            "variables": {},
                            "lists": {
                              "rkUQb`d1jg!LRs1|eg?5": [
                                "コメント欄",
                                comments
                              ]
                            },
                            "broadcasts": {},
                            "blocks": {},
                            "comments": {},
                            "currentCostume": 0,
                            "costumes": [
                              {
                                "name": "背景1",
                                "dataFormat": "svg",
                                "assetId": "cd21514d0531fdffb22204e0ec5ed84a",
                                "md5ext": "cd21514d0531fdffb22204e0ec5ed84a.svg",
                                "rotationCenterX": 240,
                                "rotationCenterY": 180
                              }
                            ],
                            "sounds": [
                              {
                                "name": "ポップ",
                                "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                                "dataFormat": "wav",
                                "format": "",
                                "rate": 48000,
                                "sampleCount": 1123,
                                "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                              }
                            ],
                            "volume": 100,
                            "layerOrder": 0,
                            "tempo": 60,
                            "videoTransparency": 50,
                            "videoState": "on",
                            "textToSpeechLanguage": null
                          },
                          {
                            "isStage": false,
                            "name": "スプライト1",
                            "variables": {},
                            "lists": {},
                            "broadcasts": {},
                            "blocks": {},
                            "comments": {},
                            "currentCostume": 0,
                            "costumes": [
                              {
                                "name": "コスチューム1",
                                "bitmapResolution": 1,
                                "dataFormat": "svg",
                                "assetId": "bcf454acf82e4504149f7ffe07081dbc",
                                "md5ext": "bcf454acf82e4504149f7ffe07081dbc.svg",
                                "rotationCenterX": 48,
                                "rotationCenterY": 50
                              },
                              {
                                "name": "コスチューム2",
                                "bitmapResolution": 1,
                                "dataFormat": "svg",
                                "assetId": "0fb9be3e8397c983338cb71dc84d0b25",
                                "md5ext": "0fb9be3e8397c983338cb71dc84d0b25.svg",
                                "rotationCenterX": 46,
                                "rotationCenterY": 53
                              }
                            ],
                            "sounds": [
                              {
                                "name": "ニャー",
                                "assetId": "83c36d806dc92327b9e7049a565c6bff",
                                "dataFormat": "wav",
                                "format": "",
                                "rate": 48000,
                                "sampleCount": 40681,
                                "md5ext": "83c36d806dc92327b9e7049a565c6bff.wav"
                              }
                            ],
                            "volume": 100,
                            "layerOrder": 1,
                            "visible": true,
                            "x": 0,
                            "y": 0,
                            "size": 100,
                            "direction": 90,
                            "draggable": false,
                            "rotationStyle": "all around"
                          }
                        ],
                        "monitors": [
                          {
                            "id": "rkUQb`d1jg!LRs1|eg?5",
                            "mode": "list",
                            "opcode": "data_listcontents",
                            "params": {
                              "LIST": "コメント欄"
                            },
                            "spriteName": null,
                            "value": [
                              "test"
                            ],
                            "width": 480,
                            "height": 360,
                            "x": 0,
                            "y": 0,
                            "visible": true
                          }
                        ],
                        "extensions": [],
                        "meta": {
                          "semver": "3.0.0",
                          "vm": "2.1.14",
                          "agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                        }
                    },
                    {
                        headers: {
                            'cookie': `scratchcsrftoken=${scratchcsrftoken}; scratchlanguage=en; scratchsessionsid=${scratchsessionsid};`,
                            'referer': 'https://scratch.mit.edu'
                        }
                    }
                );
            } catch (error) {
                console.error("エラーが発生しました:", statuscontent);
            }
        }, 8000);
        const socket = new ws("wss://clouddata.scratch.mit.edu", {
            headers :{
                "origin": "https://scratch.mit.edu",
                "Cookie": `scratchsessionsid=${scratchsessionsid};`
            }
        });
        socket.onopen = function() {
            socket.send("".concat(JSON.stringify({"method":"handshake","user":"noodle_910","project_id":"484994630"}), "\n"));
        }
        socket.onmessage = function(data) {
            data.data.split("\n").forEach((function(e) {
                if (e) {
                    comments.unshift(JSON.parse(e).value);
                    console.log(JSON.parse(e));
                }
            }
            ))
        }
        /*
        setInterval(async function(){
            socket.send("".concat(JSON.stringify({"method":"set","user":"noodle_910","project_id":"484994630","name":"☁ 5","value":"1728216018502001415150412054136282799999999999999999999"}), "\n"));
        }, 1000);
        */
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
