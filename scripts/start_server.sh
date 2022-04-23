#!/bin/bash
cd /home/ubuntu/chatting2/chatting_app_server/
npm i
pm2 start server.js
