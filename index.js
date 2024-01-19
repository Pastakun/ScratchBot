import axios from 'axios'
import express from 'express'
import ws from 'ws'
import fs from 'fs'


async function main() {
    try {
        const jsondata = JSON.parse(fs.readFileSync('./project.json', 'utf8'));
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
            username: "Pasta-kun_lv6"
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
                    "https://projects.scratch.mit.edu/953524083",
                    jsondata,
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
            socket.send("".concat(JSON.stringify({"method":"handshake","user":"noodle_910","project_id":"946162940"}), "\n"));
        }
        socket.onmessage = function(data) {
            data.data.split("\n").forEach((function(e) {
                if (e) {
                    const datavalue = JSON.parse(e).value;
                    let sendcomennt = "";
                    for(let i = 0; i < datavalue.length / 5; i++){
                        sendcomennt += jsondata.targets[0].lists["+/MOgfMF3$TXO37i5ggS"][1][datavalue.substring( i * 5, i * 5 + 5 ) - 10001];
                    }
                    console.log(sendcomennt);
                    comments.unshift(sendcomennt);
                    jsondata.targets[0].lists["rkUQb`d1jg!LRs1|eg?5"][1] = comments;
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
