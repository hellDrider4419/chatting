#!/bin/bash
cd /home/ubuntu/chatting/chatting_app_server/
npm i
pm2 kill
pm2 start /home/ubuntu/chatting/chatting_app_server/server.js
nginx -s reload
