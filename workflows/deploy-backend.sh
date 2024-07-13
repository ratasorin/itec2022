#! /bin/bash
ssh_key_location="C:/ssh/deskbooking-ssh-key.pem"
source .env

# build node app
npx nx run server:build;

# copy build artifacts to server
scp -i "$ssh_key_location" -rp dist/apps/server "$aws_ec2_ssh_location:/home/ubuntu"

# start server
ssh -i "$ssh_key_location" "$aws_ec2_ssh_location" "bash -i -c 'bash start-server.sh'";
# sudo pm2 stop all; export NODE_ENV=production; sudo pm2 node main.js