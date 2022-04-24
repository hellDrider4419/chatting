#!/bin/bash
cd /home/ubuntu/chatting/chatting_app_server/
npm i
pm2 start server.js
nginx -s reload
