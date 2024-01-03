import axios from 'axios'
import express from 'express'
import ws from 'ws'
async function main() {
    try {
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
        const port = 8080
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
                    "https://scratch.mit.edu/site-api/users/all/noodle_910/",
                    {
                        "id": "noodle_910",
                        "userId": 125060630,
                        "username": "noodle_910",
                        "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png",
                        "comments_allowed": true,
                        "status": statuscontent
                    },
                    {
                        headers: {
                            'x-csrftoken': scratchcsrftoken,
                            'x-requested-with': 'XMLHttpRequest',
                            'cookie': `scratchcsrftoken=${scratchcsrftoken}; scratchlanguage=en; scratchsessionsid=${scratchsessionsid};`,
                            'referer': 'https://scratch.mit.edu'
                        }
                    }
                );
            } catch (error) {
                console.error("エラーが発生しました:", statuscontent);
            }
        }, 8000);
        const socket = new WebSocket("wss://clouddata.scratch.mit.edu", {
            headers :{
                "origin": "https://scratch.mit.edu",
                "Cookie": `scratchsessionsid=${scratchsessionsid};`
            }
        });
        socket.on('open', () => {
            socket.send("".concat('{"method":"handshake","user":"noodle_910","project_id":"945955173"}', "\n"));
        });
        socket.on('message', (data) => {
            console.log('サーバーからメッセージを受信:', data);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
